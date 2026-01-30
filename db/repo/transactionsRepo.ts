import { db } from "@/db/schema";
import { transactions, transactionParticipants } from "@/db/schema/schema";
import { eq, and } from "drizzle-orm";

export async function createTransaction(args: {
	groupId: number;
	createdByUserId: number;
	title: string;
	description: string;
	totalAmount: string;
	occurredAt?: Date;
	participants: Array<{ userId: number; paidAmount?: string }>;
}) {
	if (!args.participants.length) {
		throw new Error("Transaction must have at least one participant");
	}

	return await db.transaction(async (tx) => {
		const transactionInsert = await tx
			.insert(transactions)
			.values({
				groupId: args.groupId,
				createdBy: args.createdByUserId,
				title: args.title,
				description: args.description,
				totalAmount: args.totalAmount,
				occurredAt: args.occurredAt ?? new Date(),
			})
			.returning();

		const t = transactionInsert[0];

		await tx.insert(transactionParticipants).values(
			args.participants.map((p) => ({
				transactionId: t.id,
				userId: p.userId,
				paidAmount: p.paidAmount ?? "0",
			})),
		);

		return t;
	});
}

export async function getTransactionById(id: number) {
	const transactionSelect = await db
		.select()
		.from(transactions)
		.where(eq(transactions.id, id));
	return transactionSelect[0] ?? null;
}

export async function listTransactionsForGroup(
	groupId: number,
	limit = 100,
	page = 1,
) {
	return await db
		.select()
		.from(transactions)
		.where(eq(transactions.groupId, groupId))
		.limit(limit)
		.offset((page - 1) * limit);
}

export async function updateTransactionBasics(args: {
	id: number;
	title?: string;
	description?: string;
	totalAmount?: string;
	occurredAt?: Date;
}) {
	const transactionUpdate = await db
		.update(transactions)
		.set({
			...(args.title !== undefined ? { title: args.title } : {}),
			...(args.description !== undefined
				? { description: args.description }
				: {}),
			...(args.totalAmount !== undefined
				? { totalAmount: args.totalAmount }
				: {}),
			...(args.occurredAt !== undefined
				? { occurredAt: args.occurredAt }
				: {}),
		})
		.where(eq(transactions.id, args.id))
		.returning();

	return transactionUpdate[0] ?? null;
}

export async function deleteTransaction(id: number) {
	await db.delete(transactions).where(eq(transactions.id, id));
}

export async function listParticipants(transactionId: number) {
	return await db
		.select()
		.from(transactionParticipants)
		.where(eq(transactionParticipants.transactionId, transactionId));
}

export async function setParticipantPaidAmount(args: {
	transactionId: number;
	userId: number;
	paidAmount: string;
}) {
	const transactionParticipantUpdate = await db
		.update(transactionParticipants)
		.set({ paidAmount: args.paidAmount })
		.where(
			and(
				eq(transactionParticipants.transactionId, args.transactionId),
				eq(transactionParticipants.userId, args.userId),
			),
		)
		.returning();
	return transactionParticipantUpdate[0] ?? null;
}

export async function addParticipant(args: {
	transactionId: number;
	userId: number;
	paidAmount?: string;
}) {
	const transactionParticipantInsert = await db
		.insert(transactionParticipants)
		.values({
			transactionId: args.transactionId,
			userId: args.userId,
			paidAmount: args.paidAmount ?? "0",
		})
		.returning();
	return transactionParticipantInsert[0];
}

export async function removeParticipant(args: {
	transactionId: number;
	userId: number;
}) {
	await db
		.delete(transactionParticipants)
		.where(
			and(
				eq(transactionParticipants.transactionId, args.transactionId),
				eq(transactionParticipants.userId, args.userId),
			),
		);
}
