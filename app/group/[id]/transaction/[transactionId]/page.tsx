import {
	getTransactionById,
	listParticipants,
} from "@/db/repo/transactionsRepo";
import { getGroupById } from "@/db/repo/groupsRepo";
import { getUserById } from "@/db/repo/usersRepo";

export default async function Transaction({
	params,
}: {
	params: Promise<{ id: string; transactionId: string }>;
	// get the group id and transaction id trough the url
}) {
	const { id, transactionId } = await params;
	// define the group id and transaction id

	const group = await getGroupById(Number(id));
	// get the specific group the transaction is in via the id code

	const transaction = await getTransactionById(Number(transactionId));
	// get the specific transaction the user clicked on by the transacion id code

	const transactionCreator = await getUserById(transaction.createdBy);

	const participants = await listParticipants(transaction.id);
	// get the list of participants in the transaction

	return (
		<div className="page transaction-view">
			<h1 className="shadow-text">
				&quot;{transaction.title}&quot; in group &quot;{group.name}
				&quot;
			</h1>
			{/* display the tranaction title */}

			<div className="transaction-meta">
				<p>
					<b>Creator: </b>
					{transactionCreator.displayName}
				</p>
				{/* display the name of the user that created the transaction */}
				<p>
					<b>Total Amount: </b>
					{transaction.totalAmount}
				</p>
				{/* total amount of what was payed with the transaction */}
				<p>
					<b>Occured at:</b>
					{transaction.occurredAt.toDateString()}
				</p>
				{/* get the date at when the transaction was created and display it in string format */}
			</div>

			{transaction.description && transaction.description !== "" && (
				<div className="transaction-meta">
					<h2 className="shadow-text">Description</h2>
					<p className="transaction-description shadow-text">
						{transaction.description}
					</p>
				</div>
			)}
			{/* display the transaction's description */}

			<div className="transaction-section">
				<h2 className="shadow-text">Participants</h2>
				<ul>
					{/* go trough the list of participants in the transaction */}
					{participants.map((p) => (
						<li key={p.userId}>
							{/* get the user via user id */}
							{p.displayName} - paid: {p.paidAmount}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
