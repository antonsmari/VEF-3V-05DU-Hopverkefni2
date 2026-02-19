import { db } from "@/db/schema";
import { userDebts } from "@/db/schema/schema";
import { ne, and, eq, or, sql, inArray } from "drizzle-orm";

export async function getUserDebt(args: {
	debtorId: number;
	debteeId: number;
}) {
	const debtSelect = await db
		.select()
		.from(userDebts)
		.where(
			and(
				eq(userDebts.debtor, args.debtorId),
				eq(userDebts.debtee, args.debteeId),
			),
		);
	return debtSelect[0] ?? null;
}

export async function setUserDebt(args: {
	debtorId: number;
	debteeId: number;
	amount: string;
}) {
	const debtUpsert = await db
		.insert(userDebts)
		.values({
			debtor: args.debtorId,
			debtee: args.debteeId,
			amount: args.amount,
		})
		.onConflictDoUpdate({
			target: [userDebts.debtor, userDebts.debtee],
			set: { amount: args.amount },
		})
		.returning();
	return debtUpsert[0] ?? null;
}

export async function incrementUserDebt(args: {
	debtorId: number;
	debteeId: number;
	delta: string;
}) {
	const debtUpsert = await db
		.insert(userDebts)
		.values({
			debtor: args.debtorId,
			debtee: args.debteeId,
			amount: args.delta,
		})
		.onConflictDoUpdate({
			target: [userDebts.debtor, userDebts.debtee],
			set: {
				amount: sql`${userDebts.amount} + ${args.delta}`,
			},
		})
		.returning();
	return debtUpsert[0] ?? null;
}

export async function listUserDebts(userId: number) {
	return await db
		.select()
		.from(userDebts)
		.where(or(eq(userDebts.debtor, userId), eq(userDebts.debtee, userId)));
}

export async function listDebtsForUsers(userIds: number[]) {
	if (userIds.length === 0) return [];

	return await db
		.select()
		.from(userDebts)
		.where(
			and(
				inArray(userDebts.debtor, userIds),
				inArray(userDebts.debtee, userIds),
				ne(userDebts.amount, "0"),
			),
		);
}

export async function sumUserDebts(userId: number) {
	const debtSums = await db
		.select({
			totalOwes: sql<
				string | null
			>`SUM(CASE WHEN ${userDebts.debtor} = ${userId} THEN ${userDebts.amount} ELSE 0 END)`,
			totalOwed: sql<
				string | null
			>`SUM(CASE WHEN ${userDebts.debtee} = ${userId} THEN ${userDebts.amount} ELSE 0 END)`,
		})
		.from(userDebts)
		.where(or(eq(userDebts.debtor, userId), eq(userDebts.debtee, userId)));

	const result = debtSums[0];
	return {
		totalOwes: result?.totalOwes ?? "0",
		totalOwed: result?.totalOwed ?? "0",
	};
}
