import { requireAndGetUser } from "@/lib/auth/requireUser";
import { listUserGroups } from "@/db/repo/groupsRepo";
import { sumUserDebts } from "@/db/repo/userDebtsRepo";
import Image from "next/image";
import Link from "next/link";
import { date } from "drizzle-orm/mysql-core";

export default async function UserDashboard() {

	const user = await requireAndGetUser();
	// get the user that is logged in
  
	const debts = await sumUserDebts(user.id);

	const groups = await listUserGroups(user.id)
	// get the groups that the user is a part of via their user id

	return (
		<main className="dashboard">
			{/* PROFILE */}
			<section className="dashboard-profile">
				<div className="profile-image">
					{/* Displays default image if the user's image is null */}
					<Image
						src={
							user.image
							? `/images/profile_pic/${user.image}.png`
							: `/images/profile_pic/default.png`
						}
						width={500}
						height={500}
						alt="profile_picture"
					/>
					{/* only displayed if user pronouns is not null */}
            		{user.pronouns && (
                		<h3>{user.pronouns}</h3>
            		)}
				</div>

				<div className="profile-info">
					<h2>{user.displayName}</h2>

					{/* only displayed if user description is not null */}
          {user.description && (
              <p>{user.description}</p>
          )}
				</div>
				
				<Link href="/user/dashboard/profile/settings">Update Profile</Link>

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
						<button className="dashboard-btn">Join Group</button>
					</div>
				</div>
			</section>

			{/* CURRENT ACTIVITIES */}
			<section className="dashboard-section active-section">
				<h2 className="section-title">Current Activities</h2>
				{/* Display a list of the groups that the user is in */}
				<div className="activity-grid">
					<ul>
						{groups.map((group) => (
							<li key={group.id}>
								<div className="activity-card">
									{/* go to the page for a specific group */}
									<Link href={`/group/${group.id}`}>
              							<strong>{group.name}</strong>
            						</Link>
									<h3>{group.name}</h3>

									{group.description && (
										<p>{group.description}</p>
									)}

                  <span className="group-name">
                    Group: {group.name}
                  </span>

									<span className="activity-date">
										DD.MM.YYYY - DD.MM.YYYY
									</span>
								</div>
							</li>
						))}
					</ul>
						{/*
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
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Sed do eiusmod tempor incididunt ut labore.
						</p>

						<span className="group-name">Group: Lorem</span>

						<span className="activity-date">
							DD.MM.YYYY - DD.MM.YYYY
						</span>
					</div>
					*/}
				</div>
			</section>

			{/* ARCHIVED ACTIVITIES */}
			<section className="dashboard-section archived-section">
				<h2 className="section-title">Archived Activities</h2>

				<div className="activity-grid archived">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="activity-card small archived-card"
						>
							<h3>TITLE</h3>

							<p>
								Lorem ipsum dolor sit amet, consectetur
								adipiscing elit.
							</p>

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
