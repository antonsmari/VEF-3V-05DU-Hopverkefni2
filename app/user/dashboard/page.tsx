import Image from "next/image";

export default function UserDashboard() {
	return (
		<main className="dashboard">
			{/* PROFILE */}
			<section className="dashboard-profile">
				<div className="profile-image">
					<Image
						src="/images/placeholder.jpeg"
						alt="Profile"
						width={220}
						height={220}
					/>
				</div>

				<div className="profile-info">
					<h2>User</h2>

					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
						Ut enim ad minim veniam.
					</p>
				</div>
			</section>

			{/* PATTERN STRIP */}
			<section className="pattern-strip">
				<div className="pattern-strip-inner moving-pattern"></div>
			</section>

			{/* STATS + ACTIONS */}
			<section className="dashboard-stats">
				<div className="stats-box">
					<div className="stat-item">
						<h4>You owe:</h4>
						<p>$123.45</p>
					</div>

					<div className="stat-item">
						<h4>You are owed:</h4>
						<p>$456.78</p>
					</div>
				</div>

				<div className="actions-box">
					<h2>ACTIVITIES</h2>

					<div className="action-buttons">
						<button className="dashboard-btn">Create Group</button>
						<button className="dashboard-btn">Join Group</button>
					</div>
				</div>
			</section>

			{/* CURRENT ACTIVITIES */}
			<section className="dashboard-section active-section">
				<h2 className="section-title">Current Activities</h2>

				<div className="activity-grid">
					<div className="activity-card">
						<h3>TITLE</h3>

						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Sed do eiusmod tempor incididunt ut labore.
						</p>

						<span className="group-name">Group: Lorem</span>

						<span className="activity-date">
							DD.MM.YYYY - DD.MM.YYYY
						</span>
					</div>

					<div className="activity-card">
						<h3>TITLE</h3>

						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Sed do eiusmod tempor incididunt ut labore.
						</p>

						<span className="group-name">Group: Lorem</span>

						<span className="activity-date">
							DD.MM.YYYY - DD.MM.YYYY
						</span>
					</div>
				</div>
			</section>

			{/* ARCHIVED ACTIVITIES */}
			<section className="dashboard-section archived-section">
				<h2 className="section-title">Archived Activities</h2>

				<div className="activity-grid archived">
					{[1,2,3,4].map((i) => (
						<div key={i} className="activity-card small archived-card">
							<h3>TITLE</h3>

							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

							<span className="activity-date">
								DD.MM.YYYY - DD.MM.YYYY
							</span>
						</div>
					))}
				</div>
			</section>
			
			{/* PATTERN STRIP */}
			<section className="pattern-strip">
				<div className="pattern-strip-inner moving-pattern"></div>
			</section>
		</main>
	);
}

/*
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
*/