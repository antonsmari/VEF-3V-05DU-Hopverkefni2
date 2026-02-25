import { requireAndGetUser } from "@/lib/auth/requireUser";
import { getGroupByInviteCode, listUserGroups } from "@/db/repo/groupsRepo";
import { sumUserDebts } from "@/db/repo/userDebtsRepo";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Activities } from "@/components/Activities";

export default async function UserDashboard() {
	async function inviteCode(formData: FormData) {
		"use server";

		const group = await getGroupByInviteCode(
			formData.get("inviteCode") as string,
		);

		redirect(`/group/${group.id}/invite/${formData.get("inviteCode")}`);
	}

	const user = await requireAndGetUser();
	const debts = await sumUserDebts(user.id);
	const groups = await listUserGroups(user.id);

	const today = new Date();

	const activeGroups = groups.filter((group) => {
		if (!group.endDate) return true;
		return new Date(group.endDate) >= today;
	});

	const archivedGroups = groups.filter((group) => {
		if (!group.endDate) return false;
		return new Date(group.endDate) < today;
	});

	return (
		<main className="dashboard">
			{/* PROFILE */}
			<section className="dashboard-profile">
				<div className="profile-image">
					<Image
						src={
							user.image
								? `/images/profile_pic/${user.image}.png`
								: `/images/profile_pic/default.png`
						}
						width={260}
						height={260}
						alt="profile_picture"
					/>
					<div className="centered-text">
						{user.pronouns && <h3>{user.pronouns}</h3>}
					</div>
				</div>

				<div className="profile-info">
					<h2>{user.displayName}</h2>
					{user.description && <p>{user.description}</p>}
				</div>
			</section>

			<section className="pattern-strip">
				<div className="pattern-strip-inner moving-pattern"></div>
			</section>

			{/* STATS + ACTIONS */}
			<section className="dashboard-stats">
				<div className="stats-box">
					<div className="stat-item">
						<h4>You owe:</h4>
						<p>{debts.totalOwes} isk</p>
					</div>

					<div className="stat-item">
						<h4>You are owed:</h4>
						<p>{debts.totalOwed} isk</p>
					</div>
				</div>

				<div className="actions-box">
					<h2 className="shadow-text">ACTIVITIES</h2>

					<div className="action-buttons">
						<Link href="/group/create">
							<button className="dashboard-btn">
								Create Group
							</button>
						</Link>

						<Link href="/group/join">
							<button className="dashboard-btn">
								Join Group
							</button>
						</Link>
					</div>
				</div>
			</section>

			{/* CURRENT */}
			<section className="dashboard-section active-section">
				<h2 className="section-title shadow-text">
					Current Activities
				</h2>

				<Activities groups={activeGroups} archived={false} />
			</section>

			{/* ARCHIVED */}
			<section className="dashboard-section archived-section">
				<h2 className="section-title shadow-text">
					Archived Activities
				</h2>

				<Activities groups={archivedGroups} archived={true} />
			</section>
		</main>
	);
}
