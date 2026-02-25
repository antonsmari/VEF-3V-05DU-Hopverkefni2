import { requireAndGetUser } from "@/lib/auth/requireUser";
import { getGroupByInviteCode } from "@/db/repo/groupsRepo";
import { redirect } from "next/navigation";

export default async function JoinGroup() {
	requireAndGetUser();
	async function inviteCode(formData: FormData) {
		"use server";

		const group = await getGroupByInviteCode(
			formData.get("inviteCode") as string,
		);

		redirect(`/group/${group.id}/invite/${formData.get("inviteCode")}`);
	}

	return (
		<div className="form-page">
			<form action={inviteCode} className="form-card">
				<h1>Join a Group</h1>
				<div className="form-group">
					<label htmlFor="inviteCode">Invite Code</label>
					<input
						id="inviteCode"
						name="inviteCode"
						type="text"
						placeholder="Enter invite code"
						required
					/>
				</div>
				<button type="submit" className="group-action-btn">
					Join Group
				</button>
			</form>
		</div>
	);
}
