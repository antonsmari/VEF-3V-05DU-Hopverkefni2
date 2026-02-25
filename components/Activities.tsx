import Link from "next/link";

type Group = {
	id: number;
	name: string;
	description?: string | null;
	startDate: Date;
	endDate?: Date | null;
};

export function Activities({
	groups,
	archived,
}: {
	groups: Group[];
	archived: boolean;
}) {
	return (
		<div className="activity-grid">
			{groups.length === 0 ? (
				<div className="empty-state">
					{archived
						? "No archived groups yet."
						: "No active groups yet."}
				</div>
			) : (
				groups.map((group) => (
					<Link
						href={`/group/${group.id}`}
						key={group.id}
						className="card-link"
					>
						<div
							className={`activity-card${archived ? " archived-card" : ""}`}
						>
							<h3>{group.name}</h3>
							{group.description && <p>{group.description}</p>}

							<div className="activity-date">
								<span>
									{new Date(
										group.startDate,
									).toLocaleDateString("is-IS")}
								</span>
								{group.endDate && (
									<span>
										{" - "}
										{new Date(
											group.endDate,
										).toLocaleDateString("is-IS")}
									</span>
								)}
							</div>
						</div>
					</Link>
				))
			)}
		</div>
	);
}
