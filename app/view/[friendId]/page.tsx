import { getUserById } from "@/db/repo/usersRepo";
import { getUserDebt } from "@/db/repo/userDebtsRepo";
import { requireAndGetUser } from "@/lib/auth/requireUser";
import Image from "next/image";

export default async function ViewProfile({
	params,
}: {
	params: Promise<{ friendId: string }>;
}) {
	const { friendId } = await params;

	const userFriend = await getUserById(Number(friendId));
	// get friend user by their Id

	const userLoggedIn = await requireAndGetUser();

	const debtUser = await getUserDebt({
		debtorId: userLoggedIn.id,
		debteeId: Number(friendId),
	});

	const debtFriend = await getUserDebt({
		debtorId: Number(friendId),
		debteeId: userLoggedIn.id,
	});

	return (
		<main className="dashboard">
			{/* PROFILE */}
			<section className="dashboard-profile">
				<div className="profile-image">
					<Image
						src={
							userFriend.image
								? `/images/profile_pic/${userFriend.image}.png`
								: `/images/profile_pic/default.png`
						}
						width={260}
						height={260}
						alt="profile_picture"
					/>
					<div className="centered-text">
						{userFriend.pronouns && <h3>{userFriend.pronouns}</h3>}
					</div>
				</div>

				<div className="profile-info">
					<h2>{userFriend.displayName}</h2>
					{userFriend.description && <p>{userFriend.description}</p>}
				</div>
			</section>

			<section className="pattern-strip">
				<div className="pattern-strip-inner moving-pattern"></div>
			</section>

			{/* DEBT INFO */}
			<section className="dashboard-stats">
				<div className="stats-box">
					<div className="stat-item">
						{debtUser && Number(debtUser.amount) > 0 ? (
							<>
								<h4>You owe {userFriend.displayName}:</h4>
								<p>{debtUser.amount} kr</p>
							</>
						) : debtFriend && Number(debtFriend.amount) > 0 ? (
							<>
								<h4>{userFriend.displayName} owes you:</h4>
								<p>{debtFriend.amount} kr</p>
							</>
						) : (
							<>
								<h4>No debts</h4>
								<p>You don&apos;t owe each other</p>
							</>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}
