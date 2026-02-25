import { requireAndGetUser } from "@/lib/auth/requireUser";
import {
	getGroupMember,
	getGroupById,
	updateGroupDetails,
} from "@/db/repo/groupsRepo";
import { redirect } from "next/navigation";
import { FormWithAction } from "@/components/FormWithAction";
import { ToastError } from "@/lib/errors/ToastError";

export default async function UpdateGroup({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	// get the id code that is in the url

	const user = await requireAndGetUser();
	// get the user that is on the site

	const group = await getGroupById(Number(id));
	// get the group by the id code in the url

	const membership = await getGroupMember({
		// get the member inside the group so we can reference their role
		groupId: Number(id),
		userId: user.id,
	});

	if (membership.role !== "admin") {
		// redirect user to the group page if they do not have an admin role within the group
		redirect(`/group/${group.id}`);
	}

	async function editGroup(formData: FormData) {
		"use server";

		const name = formData.get("name") as string;
		const description = formData.get("description") as string | null;
		const startDate = formData.get("start_date") as string;
		const endDate = formData.get("end_date") as string | null;
		const inviteCodeDisabled =
			formData.get("invite_code_disabled") === "on";
		// get data wether the invite code disabled checkbox is checked

		if (!name || name.trim().length === 0) {
			throw new ToastError("Group name is required");
		}

		if (name.length > 100) {
			throw new ToastError("Group name must be 100 characters or less");
		}

		const startDateObj = new Date(startDate);
		const endDateObj = endDate ? new Date(endDate) : null;

		if (isNaN(startDateObj.getTime())) {
			throw new ToastError("Start date is invalid");
		}

		if (endDateObj && isNaN(endDateObj.getTime())) {
			throw new ToastError("End date is invalid");
		}

		if (endDateObj && endDateObj < startDateObj) {
			throw new ToastError("End date must be after start date");
		}

		try {
			await updateGroupDetails({
				id: group.id,
				name: name.trim(),
				description: description ?? "",
				startDate: startDateObj,
				endDate: endDateObj,
				inviteCodeDisabled,
			});

			redirect(`/group/${group.id}`);
		} catch (error) {
			throw new ToastError("Failed to update group. Please try again.");
		}
	}

	return (
		<div className="form-page">
			<FormWithAction action={editGroup}>
				<h1>Edit Group</h1>
				<div className="form-group">
					<label htmlFor="name">Group Name</label>
					<input
						id="name"
						name="name"
						type="name"
						defaultValue={group.name}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="description">Description</label>
					<textarea
						id="description"
						name="description"
						defaultValue={group.description}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="start_date">Start Date</label>
					<input
						id="start_date"
						name="start_date"
						type="date"
						defaultValue={
							group.startDate.toISOString().split("T")[0]
						}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="end_date">End Date</label>
					<input
						id="end_date"
						name="end_date"
						type="date"
						defaultValue={
							group.endDate
								? group.endDate.toISOString().split("T")[0]
								: ""
						}
					/>
				</div>
				{/* if an invite code for the group exists, user is able to enable and disable it */}
				{group.inviteCode && (
					<label htmlFor="disable_invite_code">
						<input
							id="disable_invite_code"
							name="disable_invite_code"
							type="checkbox"
							defaultChecked={group.inviteCodeDisabled ?? false}
						/>
						Disable invite code
					</label>
				)}
				<button type="submit">Submit</button>
			</FormWithAction>
		</div>
	);
}
