import { getGroupById, getGroupMember } from "@/db/repo/groupsRepo";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import { redirect } from "next/navigation";

export default async function ViewInvite({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const groupId = Number(id);
	if (Number.isNaN(groupId)) {
		redirect("/user/dashboard");
	}

	const user = await requireAndGetUser();
	const group = await getGroupById(groupId);
	if (!group) {
		redirect("/user/dashboard");
	}

	const groupMember = await getGroupMember({ groupId, userId: user.id });

	if (group.createdBy !== user.id || groupMember?.role !== "admin") {
		redirect("/user/dashboard");
	}

	const inviteUrl = `/group/${groupId}/invite/${group.inviteCode}`;
	// build the invite link where the invite code is the last to make it specific to each group
	// Changed the url to fetch domain dynamically instead of hardcoding it, so it works in production and development
	const domain =
		process.env.NEXT_PUBLIC_DOMAIN ||
		"http://localhost:" + (process.env.PORT || "3000");
	const inviteLink = `${domain}${inviteUrl}`;

	return (
		<div className="page invite-view">
			<h1 className="outline-text">Invite link for {group.name}</h1>
			{inviteLink ? (
				<>
					<p className="shadow-text">
						Share this to invite members to your group
					</p>
					<div className="invite-link">
						<a href={inviteLink}>{inviteLink}</a>
					</div>
					<p className="invite-code shadow-text">
						or just give them the invite code: <br />
						<br />
						<input
							type="text"
							value={group.inviteCode || ""}
							readOnly
						/>
					</p>
					<a
						className="group-action-btn"
						href={`/group/${groupId}/invite/generate`}
					>
						Generate New Link
					</a>
				</>
			) : (
				<>
					<p className="shadow-text">No invite code generated yet.</p>
					<a
						className="group-action-btn"
						href={`/group/${groupId}/invite/generate`}
					>
						Generate Invite Link
					</a>
				</>
			)}
		</div>
	);
}
