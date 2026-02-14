import { listDebtsForUsers, setUserDebt } from "@/db/repo/userDebtsRepo";

export type Participant = {
	userId: number;
	paidAmount: number;
};

export type DebtTransfer = {
	debtorId: number;
	debteeId: number;
	amount: string;
};

export type UnitConfig = {
	quantum: number;
	remainderPolicy: "distribute" | "drop";
};

const DEFAULT_UNIT: UnitConfig = {
	quantum: 1,
	remainderPolicy: "drop",
};

function toMinorUnits(amount: number, quantum: number) {
	return Math.round(amount / quantum);
}

function fromMinorUnits(units: number, quantum: number) {
	return (units * quantum).toFixed(quantum === 1 ? 0 : 2);
}

export function calculateDebts(
	participants: Participant[],
	unit: UnitConfig = DEFAULT_UNIT,
): DebtTransfer[] {
	// Step 1: Convert paid amounts to minor units (e.g., cents or krónur)
	const paidByUserInMinorUnits = new Map<number, number>();
	for (const participant of participants) {
		paidByUserInMinorUnits.set(
			participant.userId,
			toMinorUnits(participant.paidAmount || 0, unit.quantum),
		);
	}

	// Step 2: Calculate total paid in minor units
	const totalPaidMinorUnits = participants.reduce(
		(sum, participant) =>
			sum + (paidByUserInMinorUnits.get(participant.userId) ?? 0),
		0,
	);

	// Step 3: Calculate base share and remainder
	const baseShareMinorUnits = Math.floor(
		totalPaidMinorUnits / participants.length,
	);
	let remainderMinorUnits = totalPaidMinorUnits % participants.length;

	// Step 4: Calculate net balance for each participant and sort by paid amount
	// so that those who paid less get the remainder first if distribution is needed
	const participantsSortedByPaidAmount = [...participants].sort((a, b) => {
		const paidA = paidByUserInMinorUnits.get(a.userId) ?? 0;
		const paidB = paidByUserInMinorUnits.get(b.userId) ?? 0;

		if (paidA !== paidB) return paidA - paidB;
		return a.userId - b.userId;
	});

	// Step 5: Calculate net balance and separate creditors and debtors
	const netBalanceByUser = new Map<number, number>();
	for (const participant of participantsSortedByPaidAmount) {
		const shouldReceiveExtra =
			unit.remainderPolicy === "distribute" && remainderMinorUnits > 0;
		const extraUnit = shouldReceiveExtra ? 1 : 0;

		if (shouldReceiveExtra) remainderMinorUnits--;

		const owedShareMinorUnits = baseShareMinorUnits + extraUnit;
		const paidMinorUnits =
			paidByUserInMinorUnits.get(participant.userId) ?? 0;

		netBalanceByUser.set(
			participant.userId,
			paidMinorUnits - owedShareMinorUnits,
		);
	}

	// Step 6: Create lists of creditors and debtors
	const creditors: Array<{ userId: number; amount: number }> = [];
	const debtors: Array<{ userId: number; amount: number }> = [];

	// Step 7: Match debtors to creditors to create transfer list
	for (const [userId, netMinorUnits] of netBalanceByUser.entries()) {
		if (netMinorUnits > 0)
			creditors.push({ userId, amount: netMinorUnits });
		else if (netMinorUnits < 0)
			debtors.push({ userId, amount: -netMinorUnits });
	}

	// Step 8: Generate transfers
	const transfers: DebtTransfer[] = [];
	let debtorIndex = 0;
	let creditorIndex = 0;

	// Step 9: Match debtors and creditors until all debts are settled
	while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
		const debtor = debtors[debtorIndex];
		const creditor = creditors[creditorIndex];

		const transferAmountMinorUnits = Math.min(
			debtor.amount,
			creditor.amount,
		);

		transfers.push({
			debtorId: debtor.userId,
			debteeId: creditor.userId,
			amount: fromMinorUnits(transferAmountMinorUnits, unit.quantum),
		});

		debtor.amount -= transferAmountMinorUnits;
		creditor.amount -= transferAmountMinorUnits;

		if (debtor.amount === 0) debtorIndex++;
		if (creditor.amount === 0) creditorIndex++;
	}

	// Step 10: Return the list of transfers
	return transfers;
}

export async function settleDebts(
	debts: DebtTransfer[],
	participantsUserIdList: number[],
) {
	const getPriorDebts = await listDebtsForUsers(participantsUserIdList);

	for (const debt of debts) {
		// Step 1: Find any existing debt between the same two users (regardless of direction)
		const priorDebt = getPriorDebts.find(
			(d) =>
				(d.debtor === debt.debtorId && d.debtee === debt.debteeId) ||
				(d.debtor === debt.debteeId && d.debtee === debt.debtorId),
		);

		// Step 2: Calculate the new net debt amount and direction
		// based on the prior debt and the new debt transfer
		const priorAmountMinor = priorDebt
			? Math.round(parseFloat(priorDebt.amount) * 100)
			: 0;
		const debtAmountMinor = Math.round(parseFloat(debt.amount) * 100);

		let netAmountMinor: number;
		let netDebtorId: number;
		let netDebteeId: number;

		// If the prior debt is in the same direction as the new debt, we simply add the amounts
		// Otherwise, we subtract to find the new net debt and its direction
		if (priorDebt?.debtor === debt.debtorId) {
			netAmountMinor = priorAmountMinor + debtAmountMinor;
			netDebtorId = debt.debtorId;
			netDebteeId = debt.debteeId;
		} else if (priorDebt) {
			netAmountMinor = priorAmountMinor - debtAmountMinor;

			if (netAmountMinor <= 0) {
				// Clear old debt
				await setUserDebt({
					debtorId: priorDebt.debtor,
					debteeId: priorDebt.debtee,
					amount: "0",
				});

				// Flip: new debt goes opposite direction
				netDebtorId = priorDebt.debtee;
				netDebteeId = priorDebt.debtor;
				netAmountMinor = Math.abs(netAmountMinor);
			} else {
				// Old debt direction still wins
				netDebtorId = priorDebt.debtor;
				netDebteeId = priorDebt.debtee;
			}
		} else {
			// No prior debt
			netAmountMinor = debtAmountMinor;
			netDebtorId = debt.debtorId;
			netDebteeId = debt.debteeId;
		}

		const netAmount = (Math.abs(netAmountMinor) / 100).toFixed(2);

		// Step 3: Update the database with the new net debt amount and direction
		if (netAmountMinor > 0) {
			await setUserDebt({
				debtorId: netDebtorId,
				debteeId: netDebteeId,
				amount: netAmount,
			});
		}
	}
}
