import {
	getGroupById,
	listGroupMembers,
	getGroupMember,
	removeMemberFromGroup,
} from "@/db/repo/groupsRepo";
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
		userId: user.id,
	});

	const isAdmin = membership?.role === "admin";
	// declare an admin if the user on the side has the role admin in the group

	if (!group || !groupMembers) {
		redirect("/user/dashboard");
	}

	groupMembers.sort((a, b) => {
		if (
			a.group_members.userId === user.id &&
			b.group_members.userId !== user.id
		) {
			return -1;
		} else {
			return 1;
		}
	});

	return (
		<div className="page group-dashboard">
			<h1 className="shadow-text">{group.name}</h1>

			<div className="actions">
				<Link
					className="group-action-btn"
					href={`/group/${group.id}/transaction/new`}
				>
					Add New Transaction
				</Link>
				<Link
					className="group-action-btn"
					href={`/group/${group.id}/invite/view`}
				>
					View Invite Code
				</Link>
			</div>

			<h2 className="shadow-text">Members:</h2>
			<ul>
				{groupMembers.map((member) => (
					<li key={member.users.id}>
						{(member.users.id === user.id && (
							<>
								{member.users.displayName} ({member.users.email}
								) - {member.group_members.role}
								<strong>(You)</strong>
							</>
						)) || (
							<Link href={`/view/${member.users.id}`}>
								{member.users.displayName} ({member.users.email}
								) - {member.group_members.role}
							</Link>
						)}

						{isAdmin && member.users.id !== user.id && (
							// if the user on the page is admin they can click on a link to a page that lets them remove other members form a group
							<Link
								href={`/group/${group.id}/confirm/${member.users.id}`}
							>
								Remove Member
							</Link>
						)}
					</li>
				))}
			</ul>

			<h2 className="shadow-text">Transactions:</h2>
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

			{/* if an admin is on the page they can click on a link that let's them update the group information */}
			{isAdmin && (
				<Link
					className="group-action-btn"
					href={`/group/${group.id}/edit`}
				>
					Update group details
				</Link>
			)}
		</div>
	);
}
