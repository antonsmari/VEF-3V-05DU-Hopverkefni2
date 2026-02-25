import { createGroup } from "@/db/repo/groupsRepo";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import { redirect } from "next/navigation";
import { FormWithAction } from "@/components/FormWithAction";
import { ToastError } from "@/lib/errors/ToastError";

export default function GroupCreate() {
	async function newGroup(formData: FormData) {
		// function that is called when the form is submitted
		"use server";

		const user = await requireAndGetUser();
		// function that gets the user that is in the session

		const name = formData.get("title") as string;
		const description = formData.get("description") as string | null;
		// this field has the option to be empty
		const startDate = formData.get("start_date") as string;
		const endDate = formData.get("end_date") as string;

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
			const group = await createGroup({
				// call the function that creates a group and feed it the values from the form
				name: name,
				createdByUserId: user.id,
				description: description ?? "",
				// if description field is null return an empty string
				startDate: new Date(startDate),
				// convert the startDate to a Date object, the repo takes date objects
				endDate: endDate ? new Date(endDate) : null,
				// if endDate field is empty assign it as null
			});

			redirect(`/group/${group.id}`);
			// redirect to the page for the group we just created
		} catch (error) {
			throw new ToastError("Failed to create group. Please try again.");
		}
	}

	return (
		<div className="form-page">
			<FormWithAction action={newGroup}>
				<h2>Create Group</h2>

				<div className="form-group">
					<label htmlFor="title">Group Title</label>
					<input
						id="title"
						name="title"
						type="text"
						placeholder="Event name"
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="description">Description (Optional)</label>
					<textarea
						id="description"
						name="description"
						placeholder="Describe your event"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="start_date">Start Date</label>
					<input
						id="start_date"
						name="start_date"
						type="date"
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="end_date">End Date (Optional)</label>
					<input id="end_date" name="end_date" type="date" />
				</div>

				<div className="form-submit">
					<button type="submit">Create Group</button>
				</div>
			</FormWithAction>
		</div>
	);
}
