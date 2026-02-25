import { getGroupByInviteCode, addMemberToGroup } from "@/db/repo/groupsRepo";
import { requireAndGetUser, isLoggedIn } from "@/lib/auth/requireUser";
import { redirect } from "next/navigation";
import Form from "next/form";

export default async function InvitePage({
	params,
}: {
	params: Promise<{ code: string }>;
	// get the invite code in the url
}) {
	const { code } = await params;
	const group = await getGroupByInviteCode(code);
	// get the group that has the invite code that is in the url

	const loggedIn = await isLoggedIn();

	if (!group) {
		redirect("/user/dashboard");
		// if a group with the invite code is not found redirect to user dashboard
	}

	async function acceptInvite() {
		// a function that is called once the user has accepted the invite
		"use server";

		const user = await requireAndGetUser();
		// get the user

		await addMemberToGroup({
			// call the function that adds user to the group
			groupId: group.id,
			userId: user.id,
		});

		redirect(`/group/${group.id}`);
		// redirect to the group page the user has been added to
	}

	return (
		<div className="form-page">
			{!loggedIn && <p>Please log in to accept the invite.</p>}
			{loggedIn && (
				<Form action={acceptInvite} className="form-card">
					<h1>You have been invited to {group.name}</h1>

					<button type="submit">Accept Invite</button>
				</Form>
			)}
		</div>
	);
}
