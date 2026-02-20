import { redirect } from "next/navigation";
import { destroyDbSession } from "@/lib/auth/session";

export default async function Logout() {
	"use server";

	await destroyDbSession();
	// destroy the session for the logged in user

	redirect("/");

	return <></>;
}
