import { db } from "@/db/schema";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

export async function createUser(args: {
	email: string;
	passwordHash: string;
	displayName: string;
}) {
	const userInsert = await db
		.insert(users)
		.values({
			email: args.email,
			passwordHash: args.passwordHash,
			displayName: args.displayName,
		})
		.returning();
	return userInsert[0];
}

export async function getUserById(id: number) {
	const userSelect = await db.select().from(users).where(eq(users.id, id));
	return userSelect[0] ?? null;
}

export async function getUserByEmail(email: string) {
	const userSelect = await db
		.select()
		.from(users)
		.where(eq(users.email, email));
	return userSelect[0] ?? null;
}

export async function listUsers(limit = 50, page = 1) {
	return await db
		.select()
		.from(users)
		.limit(limit)
		.offset((page - 1) * limit);
}

export async function updateUserDisplayName(id: number, displayName: string) {
	const userUpdate = await db
		.update(users)
		.set({ displayName, updatedAt: new Date() })
		.where(eq(users.id, id))
		.returning();
	return userUpdate[0] ?? null;
}

export async function updateUserPasswordHash(id: number, passwordHash: string) {
	const userUpdate = await db
		.update(users)
		.set({ passwordHash, updatedAt: new Date() })
		.where(eq(users.id, id))
		.returning();
	return userUpdate[0] ?? null;
}
