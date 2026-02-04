import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db/schema";
import { sessions } from "@/db/schema/schema";

const COOKIE_NAME = "sid";

const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	path: "/",
};

function sha256(input: string) {
	return crypto.createHash("sha256").update(input).digest("hex");
}

function newToken() {
	return crypto.randomBytes(32).toString("hex");
}

export async function createDbSession(userId: number) {
	const token = newToken();
	const tokenHash = sha256(token);

	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	await db.insert(sessions).values({
		userId,
		tokenHash,
		expiresAt,
	});

	const cookieStore = await cookies();
	cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export async function getDbSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;
	if (!token) return null;

	const tokenHash = sha256(token);
	const now = new Date();

	const selectSession = await db
		.select({ userId: sessions.userId, expiresAt: sessions.expiresAt })
		.from(sessions)
		.where(
			and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)),
		)
		.limit(1);

	return selectSession[0] ?? null;
}

export async function destroyDbSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;
	if (token) {
		const tokenHash = sha256(token);
		await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
	}
	cookieStore.delete(COOKIE_NAME);
}
