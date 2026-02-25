"use client";

import { FormWithAction } from "@/components/FormWithAction";

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
			<h1>New Transaction</h1>
			<h4>
				Checked members who paid less than others or nothing will be in
				debt to those who paid more
			</h4>

			<div className="form-group">
				<label htmlFor="title">Title:</label>
				<input
					id="title"
					type="text"
					name="title"
					placeholder="Title"
					required
				/>
			</div>

			<div className="form-group">
				<label htmlFor="description">Description:</label>
				<textarea
					id="description"
					name="description"
					placeholder="Description"
				></textarea>
			</div>

			<div className="form-group">
				<label htmlFor="occurredAt">Date:</label>
				<input id="occurredAt" type="date" name="occurredAt" />
			</div>

			<div className="groupMembersNewTransactionGrid">
				{groupMembers.map((member) => (
					<div key={member.users.id}>
						<div className="form-group">
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
								placeholder="0 (leave blank for 0)"
							/>
						</div>
					</div>
				))}
			</div>

			<button type="submit">Submit</button>
		</FormWithAction>
	);
}
