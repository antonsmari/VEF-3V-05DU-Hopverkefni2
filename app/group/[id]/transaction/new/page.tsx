import { createTransaction } from "@/db/repo/transactionsRepo";
import { requireUserId } from "@/lib/auth/requireUser";
import { listGroupMembers } from "@/db/repo/groupsRepo";
import TransactionForm from "./TransactionForm";
import { redirect } from "next/navigation";
import { calculateDebts, Participant } from "@/lib/calculation/expenseShare";
import { listDebtsForUsers, setUserDebt } from "@/db/repo/userDebtsRepo";

export default async function TransactionNew({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const userId = await requireUserId();
	const groupMembers = await listGroupMembers(Number(id));

	async function newTransaction(formData: FormData) {
		"use server";
		const memberIds = groupMembers.map((member) => member.users.id);

		const participants = memberIds.map((memberId) => ({
			userId: memberId,
			included: !!formData.get(`groupMemberInclude[${memberId}]`),
			paidAmount: formData.get(`groupMemberInclude[${memberId}]`)
				? parseFloat(
						formData.get(`groupMemberPaid[${memberId}]`) as string,
					) || 0
				: 0,
		}));
		const totalAmount = participants.reduce(
			(sum, participant) => sum + participant.paidAmount,
			0,
		);

		for (const participant of participants) {
			if (isNaN(participant.paidAmount) || participant.paidAmount < 0) {
				throw new Error(
					"Paid amount must be a number and cannot be negative",
				);
			}
		}

		if (isNaN(totalAmount) || totalAmount <= 0) {
			throw new Error("Total amount must be defined and greater than 0");
		}

		const dateString = formData.get("occurredAt") as string;
		let occurredAt = dateString ? new Date(dateString) : new Date();

		if (isNaN(occurredAt.getTime())) {
			occurredAt = new Date();
		}

		const participantsForCalculation: Participant[] = participants
			.filter((p) => p.included)
			.map((p) => ({
				userId: p.userId,
				paidAmount: p.paidAmount,
			}));

		const transaction = await createTransaction({
			groupId: Number(id),
			createdByUserId: userId,
			title: formData.get("title") as string,
			description: formData.get("description") as string,
			occurredAt: occurredAt,
			totalAmount: totalAmount.toString(),
			participants: participants.map((participant) => ({
				...participant,
				paidAmount: participant.paidAmount.toString(),
			})),
		});

		if (!transaction) {
			throw new Error("Failed to create transaction");
		} else {
			const debts = calculateDebts(participantsForCalculation);
			const participantsUserIdList = participantsForCalculation.map(
				(participant) => participant.userId,
			);

			const getPriorDebts = await listDebtsForUsers(
				participantsUserIdList,
			);

			for (const debt of debts) {
				// Step 1: Find any existing debt between the same two users (regardless of direction)
				const priorDebt = getPriorDebts.find(
					(d) =>
						(d.debtor === debt.debtorId &&
							d.debtee === debt.debteeId) ||
						(d.debtor === debt.debteeId &&
							d.debtee === debt.debtorId),
				);

				// Step 2: Calculate the new net debt amount and direction
				// based on the prior debt and the new debt transfer
				const priorAmountMinor = priorDebt
					? Math.round(parseFloat(priorDebt.amount) * 100)
					: 0;
				const debtAmountMinor = Math.round(
					parseFloat(debt.amount) * 100,
				);

				let netAmountMinor: number;
				let netDebtorId: number;
				let netDebteeId: number;

				// If the prior debt is in the same direction as the new debt, we simply add the amounts
				// Otherwise, we subtract the smaller from the larger to find the new net debt and its direction
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

		redirect(`/group/${id}`);
	}

	return (
		<div>
			<h1>New Transaction</h1>
			<h4>Members who are checked are either</h4>
			<TransactionForm
				groupMembers={groupMembers}
				action={newTransaction}
			/>
		</div>
	);
}
