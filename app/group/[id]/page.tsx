import { getGroupById, listGroupMembers, getGroupMember } from "@/db/repo/groupsRepo";
import { listTransactionsForGroup } from "@/db/repo/transactionsRepo";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Group({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	if (isNaN(Number(id))) {
		redirect("/user/dashboard");
	}

	const group = await getGroupById(Number(id));
	const groupMembers = await listGroupMembers(Number(id));
	const groupTransactions = await listTransactionsForGroup(Number(id));


	const user = await requireAndGetUser();
	// get the user that is viewing the site

	const membership = await getGroupMember({
	// get the member inside the group so we can reference their membership
		groupId: Number(id),
		userId: user.id
	})

	const isAdmin = membership?.role === "admin";
	// declare an admin if the user on the side has the role admin in the group
	if (!group || !groupMembers) {
		redirect("/user/dashboard");
	}

	return (
		<div>
			<h1>{group.name}</h1>

			<Link href={`/group/${group.id}/transaction/new`}>
				Add New Transaction
			</Link>

			{isAdmin && (
			<Link href={`/group/${group.id}/invite/view`}>
				View Invite Code
			</Link>
			)}

			<h2>Members:</h2>
			<ul>
				{groupMembers.map((member) => (
					<li key={member.users.id}>
						<Link href={`/view/${member.users.id}`}>
							{member.users.displayName} ({member.users.email}) -{" "}
							{member.group_members.role}
						</Link>
					</li>
				))}
			</ul>

			<h2>Transactions:</h2>
			<ul>
				{groupTransactions.map((transaction) => (
					<li key={transaction.id}>
						<Link
							href={`/group/${group.id}/transaction/${transaction.id}`}
						>
							{/* if the transaction is clicked user goes to a page that shows more details about the transaction */}
							{transaction.title} - {transaction.totalAmount}{" "}
							(Occurred at:{" "}
							{transaction.occurredAt.toDateString()})
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
