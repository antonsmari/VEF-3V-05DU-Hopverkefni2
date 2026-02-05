import "server-only";
import { redirect } from "next/navigation";
import { getDbSession } from "@/lib/auth/session";
import { getUserById } from "@/db/repo/usersRepo";

export async function requireUserId() {
	const session = await getDbSession();
	if (!session) redirect("/login");
	return session.userId;
}

export async function requireAndGetUser() {
	const id = await requireUserId();
	const user = await getUserById(id);
	if (!user) redirect("/login");
	return user;
}
