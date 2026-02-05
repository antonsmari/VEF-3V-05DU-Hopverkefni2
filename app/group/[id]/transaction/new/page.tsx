import Form from "next/form";

export default async function TransactionNew() {
	return (
		<div>
			<Form action="" formMethod="post">
				<label htmlFor="title">Title:</label>
				<input
					id="title"
					type="text"
					name="title"
					placeholder="Title"
				/>

				<label htmlFor="description">Description:</label>
				<textarea
					id="description"
					name="description"
					placeholder="Description"
				></textarea>

				<label htmlFor="occurredAt">Date:</label>
				<input
					id="occurredAt"
					type="date"
					name="occurredAt"
					placeholder="Date"
					value=""
				/>

				<div className="groupMembersNewTransactionGrid">
					<div>
						<input
							type="checkbox"
							id="groupMemberInclude1"
							name="groupMemberInclude[1]"
						/>
						<label htmlFor="groupMember1">
							Group Member 1 paid:
						</label>
						<input
							id="groupMember1"
							type="text"
							name="groupMemberPaid[1]"
							placeholder="Group Member 1 paid"
						/>
					</div>

					<div>
						<input
							type="checkbox"
							id="groupMemberInclude2"
							name="groupMemberInclude[2]"
						/>
						<label htmlFor="groupMember2">
							Group Member 2 paid:
						</label>
						<input
							id="groupMember2"
							type="text"
							name="groupMemberPaid[2]"
							placeholder="Group Member 2 paid"
						/>
					</div>

					<div>
						<input
							type="checkbox"
							id="groupMemberInclude3"
							name="groupMemberInclude[3]"
						/>
						<label htmlFor="groupMember3">
							Group Member 3 paid:
						</label>
						<input
							id="groupMember3"
							type="text"
							name="groupMemberPaid[3]"
							placeholder="Group Member 3 paid"
						/>
					</div>

					<div>
						<input
							type="checkbox"
							id="groupMemberInclude4"
							name="groupMemberInclude[4]"
						/>
						<label htmlFor="groupMember4">
							Group Member 4 paid:
						</label>
						<input
							id="groupMember4"
							type="text"
							name="groupMemberPaid[4]"
							placeholder="Group Member 4 paid"
						/>
					</div>
				</div>

				<button type="submit">Submit</button>
			</Form>
		</div>
	);
}
