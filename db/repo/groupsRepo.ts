import { db } from "@/db/schema";
import { groups, groupMembers, users } from "@/db/schema/schema";
import { eq, and, sql } from "drizzle-orm";

export async function createGroup(args: {
	name: string;
	createdByUserId: number;
}) {
	return db.transaction(async (tx) => {
		const groupInsert = await tx
			.insert(groups)
			.values({
				name: args.name,
				createdBy: args.createdByUserId,
			})
			.returning();

		const group = groupInsert[0];

		await tx.insert(groupMembers).values({
			groupId: group.id,
			userId: args.createdByUserId,
			role: "admin",
		});

		return group;
	});
}

export async function getGroupById(id: number) {
	const groupSelect = await db.select().from(groups).where(eq(groups.id, id));
	return groupSelect[0] ?? null;
}

export async function listGroups(limit = 50, page = 1) {
	return await db
		.select()
		.from(groups)
		.limit(limit)
		.offset((page - 1) * limit);
}

export async function updateGroupName(id: number, name: string) {
	const groupUpdate = await db
		.update(groups)
		.set({ name, updatedAt: new Date() })
		.where(eq(groups.id, id))
		.returning();
	return groupUpdate[0] ?? null;
}

export async function addMemberToGroup(args: {
	groupId: number;
	userId: number;
	role?: "admin" | "member";
}) {
	const groupMemberInsert = await db
		.insert(groupMembers)
		.values({
			groupId: args.groupId,
			userId: args.userId,
			role: args.role ?? "member",
		})
		.returning();
	return groupMemberInsert[0];
}

export async function updateMemberRole(args: {
	groupId: number;
	userId: number;
	role: "admin" | "member";
}) {
	const groupMemberUpdate = await db
		.update(groupMembers)
		.set({ role: args.role })
		.where(
			and(
				eq(groupMembers.groupId, args.groupId),
				eq(groupMembers.userId, args.userId),
			),
		)
		.returning();
	return groupMemberUpdate[0] ?? null;
}

export async function removeMemberFromGroup(args: {
	groupId: number;
	userId: number;
}) {
	await db
		.delete(groupMembers)
		.where(
			and(
				eq(groupMembers.groupId, args.groupId),
				eq(groupMembers.userId, args.userId),
			),
		);
}

export async function listGroupMembers(groupId: number) {
	return await db
		.select()
		.from(groupMembers)
		.innerJoin(users, eq(groupMembers.userId, users.id))
		.where(eq(groupMembers.groupId, groupId));
}

export async function listUserGroups(userId: number) {
	return await db
		.select({
			id: groups.id,
			name: groups.name,
			createdBy: groups.createdBy,
			createdAt: groups.createdAt,
			updatedAt: groups.updatedAt,
			memberCount: sql<number>`count(distinct ${groupMembers.userId})`,
		})
		.from(groups)
		.innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
		.where(eq(groupMembers.userId, userId))
		.groupBy(groups.id);
}
