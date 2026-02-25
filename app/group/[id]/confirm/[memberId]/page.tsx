import { getGroupMember, removeMemberFromGroup } from "@/db/repo/groupsRepo";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import { getUserById } from "@/db/repo/usersRepo";
import { redirect } from "next/navigation";
import { FormWithAction } from "@/components/FormWithAction";
import Link from "next/link";

export default async function ConfirmRemoveMember({
	params,
}: {
	params: Promise<{ id: string; memberId: string }>;
}) {
	const { id, memberId } = await params;

	const groupId = Number(id);
	// get the groupId number that is in the url
	const memberToRemoveId = Number(memberId);
	// get the id of the member that is to be removed

	const currentUser = await requireAndGetUser();
	// get the user that is on the page

	const memberToRemove = await getUserById(memberToRemoveId);

	const membership = await getGroupMember({
		// get a reference to the user in the group so we can confirm they have an admin role
		groupId,
		userId: currentUser.id,
	});

	if (
		!membership ||
		membership.role !== "admin" ||
		memberToRemoveId === currentUser.id
	) {
		// if the user does not have an admin role within the group, redirect them to the group page
		redirect(`/group/${groupId}`);
	}

	async function removeMemberConfirmed() {
		// if user has confirmed they want to remove said member
		"use server";

		await removeMemberFromGroup({
			// call the function that removes a member from a group
			groupId,
			userId: memberToRemoveId,
		});

		redirect(`/group/${groupId}`);
		// redirect to the group page once the member has been removed
	}

	return (
		<div className="form-page confirmation-page">
			<FormWithAction action={removeMemberConfirmed}>
				<h1 className="shadow-text">Remove Member</h1>
				<p className="confirmation-message shadow-text">
					Are you sure you want to remove{" "}
					<strong>{memberToRemove.displayName}</strong> from the
					group?
				</p>

				<div className="button-group">
					<button type="submit" className="btn-danger">
						Remove Member
					</button>{" "}
					<Link href={`/group/${groupId}`} className="btn-secondary">
						Cancel
					</Link>
				</div>
			</FormWithAction>
		</div>
	);
}
