import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth/requireUser";

export async function GET() {
	const loggedIn = await isLoggedIn();
	if (loggedIn) {
		return NextResponse.json({ loggedIn: true });
	} else {
		return NextResponse.json({ loggedIn: false });
	}
}
