import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const DB_DIR = path.join(process.cwd(), "db");
const INIT_PATH = path.join(DB_DIR, "init.sql");
const ENV_PATH = path.join(process.cwd(), ".env.local");

function setEnvVar(key: string, value: string) {
	let env = "";
	if (fs.existsSync(ENV_PATH)) {
		env = fs.readFileSync(ENV_PATH, "utf8");
	}

	const regex = new RegExp(`^${key}=.*$`, "m");

	if (regex.test(env)) {
		env = env.replace(regex, `${key}=${value}`);
	} else {
		env += `\n${key}=${value}\n`;
	}

	fs.writeFileSync(ENV_PATH, env.trim() + "\n");
}

function readSql(filePath: string) {
	return fs.readFileSync(filePath, "utf8");
}

function exists(filePath: string) {
	return fs.existsSync(filePath);
}

async function main() {
	const DATABASE_URL = process.env.DATABASE_URL;
	if (!DATABASE_URL) {
		console.error("Missing DATABASE_URL (put it in .env.local)");
		process.exit(1);
	}

	let client = new Client({ connectionString: DATABASE_URL });
	await client.connect();

	try {
		const versionTableExistsResponse = await client.query(
			`SELECT to_regclass('public.schema_version') IS NOT NULL AS exists`,
		);
		const versionTableExists = Boolean(
			versionTableExistsResponse.rows[0]?.exists,
		);

		if (!versionTableExists) {
			if (!exists(INIT_PATH)) {
				throw new Error(`Missing init.sql at ${INIT_PATH}`);
			}
			console.log("Running init.sql...");
			await client.query(readSql(INIT_PATH));
			await client.end();

			setEnvVar(
				"DATABASE_URL",
				"postgres://hopverkefni2:hopverkefni2@localhost:5432/hopverkefni2",
			);

			client = new Client({
				connectionString:
					"postgres://hopverkefni2:hopverkefni2@localhost:5432/hopverkefni2",
			});
			await client.connect();
		}

		const versionResponse = await client.query(
			"SELECT version FROM schema_version LIMIT 1",
		);
		if (!versionResponse.rowCount) {
			throw new Error(
				"Version table exists but has no rows. Insert a row like: INSERT INTO schema_version(version) VALUES (0);",
			);
		}
		let version = Number(versionResponse.rows[0].version);

		console.log(`Current DB version: ${version}`);

		while (true) {
			const nextVersion = version + 1;
			const patchFile = path.join(DB_DIR, `patch-${nextVersion}.sql`);

			if (!exists(patchFile)) {
				console.log(`No patch-${nextVersion}.sql found. Done.`);
				break;
			}

			console.log(`Applying patch-${nextVersion}.sql...`);
			await client.query(readSql(patchFile));
			await client.query("UPDATE schema_version SET version = $1", [
				nextVersion,
			]);

			version = nextVersion;
			console.log(`Updated version -> ${version}`);
		}
	} finally {
		await client.end();
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
