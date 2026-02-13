import {
	calculateDebts,
	type Participant,
} from "@/lib/calculation/expenseShare";

const participants: Participant[] = [
	{ userId: 1, paidAmount: 0 },
	{ userId: 2, paidAmount: 3002 },
	{ userId: 3, paidAmount: 0 },
];

const transfers = calculateDebts(participants, {
	quantum: 1,
	remainderPolicy: "drop",
});

console.log("Transfers:", transfers);
