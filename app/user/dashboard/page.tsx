import { listUserGroups } from "@/db/repo/groupsRepo";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import Link from "next/link";

export default async function Group() {
	const user = await requireAndGetUser();
	const groups = await listUserGroups(user.id);
	return (
		<div>
			{groups.map((group) => (
				<li key={group.id}>
					<Link href={`/group/${group.id}`}>{group.name}</Link>
				</li>
			))}

			<br />
			<Link href="/group/create">Create New Group</Link>
			<br/>
			<Link href="/user/dashboard/profile">My Profile</Link>
		</div>
	);
}
