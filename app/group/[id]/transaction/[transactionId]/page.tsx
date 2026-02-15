import { getTransactionById, listParticipants } from "@/db/repo/transactionsRepo";
import { getGroupById } from "@/db/repo/groupsRepo";
import { getUserById } from "@/db/repo/usersRepo";
import { get } from "http";

export default async function Transaction({
    params,
}: {
    params: Promise<{ id: string; transactionId: string }>;
    // get the group id and transaction id trough the url
}) {

    const {id , transactionId} = await params;
    // define the group id and transaction id

    const group = await getGroupById(Number(id));
    // get the specific group the transaction is in via the id code

    const transaction = await getTransactionById(Number(transactionId));
    // get the specific transaction the user clicked on by the transacion id code

    const transactionCreator = await getUserById(transaction.createdBy)

    const participants = await listParticipants(transaction.id);
    // get the list of participants in the transaction


    return(
        <div>
            <h1>{transaction.title}</h1>
            {/* display the tranaction title */}

            <p><b>Creator: </b>{transactionCreator.displayName}</p>
            {/* display the name of the user that created the transaction */}
            <p>{transaction.description}</p>
            {/* display the transaction's description */}
            <p><b>Total Amount: </b>{transaction.totalAmount}</p>
            {/* total amount of what was payed with the transaction */}
            <p><b>Occured at:</b>{transaction.occurredAt.toDateString()}</p>
            {/* get the date at when the transaction was created and display it in string format */}

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
    )
}