import { requireAndGetUser } from "@/lib/auth/requireUser";
import { listUserGroups } from "@/db/repo/groupsRepo";
import { sumUserDebts } from "@/db/repo/userDebtsRepo";
import Image from "next/image";
import Link from "next/link";

export default async function UserDashboard() {
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
					{user.pronouns && <h3>{user.pronouns}</h3>}
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
					<h2>ACTIVITIES</h2>

					<div className="action-buttons">
						<Link href="/group/create">
							<button className="dashboard-btn">Create Group</button>
						</Link>
					</div>
				</div>
			</section>

			{/* CURRENT */}
			<section className="dashboard-section active-section">
				<h2 className="section-title">Current Activities</h2>

				<div className="activity-grid">
					{activeGroups.length === 0 ? (
						<div className="empty-state">
							No active groups yet.
						</div>
					) : (
						activeGroups.map((group) => (
							<Link href={`/group/${group.id}`} key={group.id} className="card-link">
								<div className="activity-card">
									<h3>{group.name}</h3>
									{group.description && <p>{group.description}</p>}

									<div className="activity-date">
										<span>{new Date(group.startDate).toLocaleDateString("is-IS")}</span>
										{group.endDate && (
											<span>
												{" - "}
												{new Date(group.endDate).toLocaleDateString("is-IS")}
											</span>
										)}
									</div>
								</div>
							</Link>
						))
					)}
				</div>
			</section>

			{/* ARCHIVED */}
			<section className="dashboard-section archived-section">
				<h2 className="section-title">Archived Activities</h2>

				<div className="activity-grid">
					{archivedGroups.length === 0 ? (
						<div className="empty-state">
							No archived groups yet.
						</div>
					) : (
						archivedGroups.map((group) => (
							<Link href={`/group/${group.id}`} key={group.id} className="card-link">
								<div className="activity-card archived-card">
									<h3>{group.name}</h3>
									{group.description && <p>{group.description}</p>}

									<div className="activity-date">
										<span>{new Date(group.startDate).toLocaleDateString("is-IS")}</span>
										{group.endDate && (
											<span>
												{" - "}
												{new Date(group.endDate).toLocaleDateString("is-IS")}
											</span>
										)}
									</div>
								</div>
							</Link>
						))
					)}
				</div>
			</section>
		</main>
	);
}