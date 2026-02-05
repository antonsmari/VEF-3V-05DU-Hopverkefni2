"use client";

import Form from "next/form";
import { FormWithAction } from "@/components/FormWithAction";

type ActionState = { error: string | null };

export default function TransactionForm({
	groupMembers,
	action,
}: {
	groupMembers: Array<{
		users: { id: number; displayName: string };
	}>;
	action: (formData: FormData) => Promise<void>;
}) {
	return (
		<FormWithAction action={action}>
			<label htmlFor="title">Title:</label>
			<input id="title" type="text" name="title" placeholder="Title" />

			<label htmlFor="description">Description:</label>
			<textarea
				id="description"
				name="description"
				placeholder="Description"
			></textarea>

			<label htmlFor="occurredAt">Date:</label>
			<input id="occurredAt" type="date" name="occurredAt" />

			<div className="groupMembersNewTransactionGrid">
				{groupMembers.map((member) => (
					<div key={member.users.id}>
						<input
							type="checkbox"
							defaultChecked
							id={`groupMemberInclude${member.users.id}`}
							name={`groupMemberInclude[${member.users.id}]`}
						/>

						<label htmlFor={`groupMember${member.users.id}`}>
							{member.users.displayName} paid:
						</label>
						<input
							id={`groupMember${member.users.id}`}
							type="text"
							name={`groupMemberPaid[${member.users.id}]`}
							placeholder="0"
						/>
					</div>
				))}
			</div>

			<button type="submit">Submit</button>
		</FormWithAction>
	);
}
