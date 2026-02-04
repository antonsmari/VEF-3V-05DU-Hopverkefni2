/* Generates an invite code in the format: 1 uppercase letter + 4 digits */
/* Example: A4839, Q0021, L6492 */

export function generateInviteCode(): string {
  const letter = String.fromCharCode(
    65 + Math.floor(Math.random() * 26)
  );

  const numbers = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `${letter}${numbers}`;
}

/* ---------------------------------------------------------------------------------------------------------------------------------- */

/* The SQL database would handle the code being UNIQUE, meaning thered be no duplicate codes going on at the same time! */

/*
groups (
  id SERIAL PRIMARY KEY,
  name TEXT,
  invite_code VARCHAR(5) UNIQUE
)
*/

/* ---------------------------------------------------------------------------------------------------------------------------------- */

/* Example of what the database insert could look like, with DB fallback protection! */
/* Its commented because it gives a few errors due to the db not existing yet */

/* import { generateInviteCode } from "@/scripts/inviteCode";
import { db } from "@/db";

export async function createGroup(name: string) {
  while (true) {
    const inviteCode = generateInviteCode();

    try {
      const result = await db.query(
        `
        INSERT INTO groups (name, invite_code)
        VALUES ($1, $2)
        RETURNING *
        `,
        [name, inviteCode]
      );

      return result.rows[0];

    } catch (error: any) {
      // Postgres duplicate key error
      if (error.code === "23505") {
        continue; // try again
      }

      throw error;
    }
  }
} */
