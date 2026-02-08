import { db } from "@/db/schema";
import { groups, groupMembers, users } from "@/db/schema/schema";
import { eq, and, sql } from "drizzle-orm";
import { generateInviteCode } from "@/lib/invite-code";
import { MySqlDateBaseColumn } from "drizzle-orm/mysql-core/columns/date.common";
// call a function that generates a random invite code

export async function createGroup(args: {
	name: string;
	createdByUserId: number;
	description?: string;
	startDate?: Date;
	endDate?: Date | null;
}) {
	return db.transaction(async (tx) => {
		const groupInsert = await tx
			.insert(groups)
			.values({
				name: args.name,
				description: args.description ?? "",
				startDate: args.startDate ?? new Date(),
				endDate: args.endDate ?? null,
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

export async function updateGroupDetails(args: {
	id: number;
	name?: string;
	description?: string;
	startDate?: Date;
	endDate?: Date | null;
	inviteCode?: string | null;
	inviteCodeDisabled?: boolean;
}) {
	const groupUpdate = await db
		.update(groups)
		.set({
			...(args.name !== undefined ? { name: args.name } : {}),
			...(args.description !== undefined
				? { description: args.description }
				: {}),
			...(args.startDate !== undefined
				? { startDate: args.startDate }
				: {}),
			...(args.endDate !== undefined ? { endDate: args.endDate } : {}),
			...(args.inviteCode !== undefined
				? { inviteCode: args.inviteCode }
				: {}),
			...(args.inviteCodeDisabled !== undefined
				? { inviteCodeDisabled: args.inviteCodeDisabled }
				: {}),
			updatedAt: new Date(),
		})
		.where(eq(groups.id, args.id))
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
			description: groups.description,
			startDate: groups.startDate,
			endDate: groups.endDate,
			inviteCode: groups.inviteCode,
			inviteCodeDisabled: groups.inviteCodeDisabled,
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

export async function generateGroupInviteCode(groupId: number) {
// generate an invite code for a specific group by their id
// has the option to me empty
	const code = generateInviteCode();
	// call an imported function that generates an invite code

	const updated = await db
		.update(groups)
		// update the groups table
		.set({
			inviteCode: code,
			inviteCodeDisabled: false,
			updatedAt: new Date(),
		})
		// set new values for the invite code, wether the invite code is addapted and when the groups table was last updated
		.where(eq(groups.id, groupId))
		// do this in the right group that wass called by the id
		.returning();

	return updated[0] ?? null;
	// if an error occured then run the code as null
}

export async function getGroupByInviteCode(code: string){
// function that located the group with a specific invite code
// will be called when a user clickes the link with an invite code to find the right group to add them into
	const result = await db
		.select()
		.from(groups)
		.where(
			and(
				eq(groups.inviteCode, code),
				eq(groups.inviteCodeDisabled, false)
				// locate group that has the same invite code as the code that the function recieved
			)
		);
	return result[0] ?? null;
}
