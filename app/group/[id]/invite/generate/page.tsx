import { generateGroupInviteCode, getGroupMember } from "@/db/repo/groupsRepo";
import { redirect } from "next/navigation";
import { requireAndGetUser } from "@/lib/auth/requireUser";

export default async function GenerateInvite({
	params,
}: {
	params: Promise<{ id: string }>;
	// the id string is in the url
}) {
	const { id } = await params;
	// get the group id from the url

	const user = await requireAndGetUser();
	// get the logged in user

	if (!id) {
		redirect("/user/dashboard");
	}

	const groupId = Number(id);
	// get the group id that is marked as an id params in the url
	if (Number.isNaN(groupId)) {
		redirect("/user/dashboard");
	}

	const membership = await getGroupMember({ groupId, userId: user.id });
	// get the membership of the user in the group to check if they are an admin

	if (membership?.role !== "admin") {
		redirect("/user/dashboard");
	}
	// if the user is not an admin in the group they are redirected to the user dashboard

	await generateGroupInviteCode(groupId);
	// get the group with the groupId and add an invite code to it

	redirect(`/group/${groupId}/invite/view`);
	// redirect to the page where the user can view the invite code and link for the group
}
