import { createTransaction } from "@/db/repo/transactionsRepo";
import { requireUserId } from "@/lib/auth/requireUser";
import { listGroupMembers } from "@/db/repo/groupsRepo";
import TransactionForm from "./TransactionForm";
import { redirect } from "next/navigation";
import {
	calculateDebts,
	Participant,
	settleDebts,
} from "@/lib/calculation/expenseShare";

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
			const debts = await calculateDebts(participantsForCalculation);
			const participantsUserIdList = participantsForCalculation.map(
				(participant) => participant.userId,
			);

			await settleDebts(debts, participantsUserIdList);
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
