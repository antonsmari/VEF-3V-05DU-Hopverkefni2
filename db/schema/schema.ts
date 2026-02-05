import {
	pgTable,
	bigserial,
	bigint,
	varchar,
	text,
	timestamp,
	numeric,
	primaryKey,
	index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: bigserial("id", { mode: "number" }).primaryKey(),
	email: text("email").notNull(),
	passwordHash: text("password_hash").notNull(),
	displayName: varchar("display_name", { length: 100 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const groups = pgTable("groups", {
	id: bigserial("id", { mode: "number" }).primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	createdBy: bigint("created_by", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const groupMembers = pgTable(
	"group_members",
	{
		groupId: bigint("group_id", { mode: "number" }).notNull(),
		userId: bigint("user_id", { mode: "number" }).notNull(),
		role: text("role").notNull().default("member"),
		joinedAt: timestamp("joined_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(groupMembers) => [
		primaryKey({ columns: [groupMembers.groupId, groupMembers.userId] }),
		index("group_members_user_id_idx").on(groupMembers.userId),
	],
);

export const transactions = pgTable(
	"transactions",
	{
		id: bigserial("id", { mode: "number" }).primaryKey(),
		groupId: bigint("group_id", { mode: "number" }).notNull(),
		createdBy: bigint("created_by", { mode: "number" }).notNull(),
		title: varchar("title", { length: 100 }).notNull(),
		description: text("description").notNull(),
		totalAmount: numeric("total_amount", {
			precision: 12,
			scale: 2,
		}).notNull(),
		occurredAt: timestamp("occurred_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(transactions) => [
		index("transaction_group_id_idx").on(transactions.groupId),
	],
);

export const transactionParticipants = pgTable(
	"transaction_participants",
	{
		transactionId: bigint("transaction_id", { mode: "number" }).notNull(),
		userId: bigint("user_id", { mode: "number" }).notNull(),
		paidAmount: numeric("paid_amount", { precision: 12, scale: 2 })
			.notNull()
			.default("0"),
	},
	(transactionParticipants) => [
		primaryKey({
			columns: [
				transactionParticipants.transactionId,
				transactionParticipants.userId,
			],
		}),
		index("transaction_participants_user_id_idx").on(
			transactionParticipants.userId,
		),
	],
);

export const sessions = pgTable(
	"sessions",
	{
		id: bigserial("id", { mode: "number" }).primaryKey(),
		userId: bigint("user_id", { mode: "number" })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		tokenHash: text("token_hash").notNull().unique(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	},
	(sessions) => [
		index("sessions_user_id_idx").on(sessions.userId),
		index("sessions_expires_at_idx").on(sessions.expiresAt),
	],
);

export type GroupRole = "admin" | "member";
