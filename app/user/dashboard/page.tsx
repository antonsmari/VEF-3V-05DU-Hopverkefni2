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
			<Link href="/user/dashboard/accountsettings">My Account</Link>
			/* link to a page where user can see their user information and is able to update them */
			/* could also have this part in the nav bar but only visible once the user is logged in */
			<Link href="/group/create">Create New Group</Link>
		</div>
	);
}
