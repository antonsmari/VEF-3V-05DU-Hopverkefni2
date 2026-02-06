/* Generates an invite code in the format: 6 characters, each randomly a letter or number */
/* Guarantees at least one letter and one number */
/* Example: A9F2K7, 4B7Q2M, Z1R8P0 */


export function generateInviteCode(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let code = "";
  let hasLetter = false;
  let hasNumber = false;

  while (code.length < 6) {
    const isLetter = Math.random() < 0.5;

    if (isLetter) {
      const letter =
        letters[Math.floor(Math.random() * letters.length)];
      code += letter;
      hasLetter = true;
    } else {
      const number =
        numbers[Math.floor(Math.random() * numbers.length)];
      code += number;
      hasNumber = true;
    }
  }

  // This line ensures at least one letter and one number
  if (!hasLetter || !hasNumber) {
    return generateInviteCode(); // regenerate if invalid
  }

  return code;
}

/* ---------------------------------------------------------------------------------------------------------------------------------- */

/* The SQL database would handle the code being UNIQUE, meaning thered be no duplicate codes going on at the same time! */

/*
groups (
  id SERIAL PRIMARY KEY,
  name TEXT,
  invite_code VARCHAR(6) UNIQUE,
  etc...
)
*/

/* ---------------------------------------------------------------------------------------------------------------------------------- */

/* Example of what the database insert could look like, with DB fallback protection! */
/* Its commented because it gives a few errors due to the db not existing yet */

/*
import { generateInviteCode } from "@/scripts/inviteCode";
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
} 
*/