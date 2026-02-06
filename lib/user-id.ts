/* Generates a 4-digit user ID, Format: ---- (0000–9999) */
/* Example: 8786, 1638, 6902 */

export function generateUserId(): string {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
}

/* ---------------------------------------------------------------------------------------------------------------------------------- */

/* The SQL database would handle the code being UNIQUE, meaning thered be no duplicate codes going on at the same time! */

/*
users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50),
  user_code VARCHAR(4) UNIQUE
  email VARCHAR(100),
  etc...
)
*/

/* ---------------------------------------------------------------------------------------------------------------------------------- */

/* Example of what the database insert could look like, with DB fallback protection! */
/* Its commented because it gives a few errors due to the db not existing yet */

/* 
import { generateUserId } from "@/scripts/userCode";
import { db } from "@/db";

export async function createUser(username: string) {
  while (true) {
    const userCode = generateUserId();

    try {
      const result = await db.query(
        `
        INSERT INTO users (username, user_code)
        VALUES ($1, $2)
        RETURNING *
        `,
        [username, userCode]
      );

      return result.rows[0];

    } catch (error: any) {
      // Duplicate key error
      if (error.code === "23505") {
        continue; // try again
      }

      throw error;
    }
  }
}
*/
