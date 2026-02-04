import "server-only";
import { redirect } from "next/navigation";
import { getDbSession } from "@/lib/auth/session";

export async function requireUserId() {
	const session = await getDbSession();
	if (!session) redirect("/login");
	return session.userId;
}
