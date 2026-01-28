DO
$do$
BEGIN
	IF EXISTS (
		SELECT FROM pg_catalog.pg_roles
		WHERE  rolname = 'hopverkefni2') THEN

		RAISE NOTICE 'Role "hopverkefni2" already exists. Skipping...';
	ELSE
		CREATE ROLE hopverkefni2 WITH
			LOGIN
			NOSUPERUSER
			NOCREATEDB
			NOCREATEROLE
			INHERIT
			NOREPLICATION
			NOBYPASSRLS
			CONNECTION LIMIT -1
			PASSWORD 'hopverkefni2';
	END IF;
END
$do$;

ALTER DATABASE hopverkefni2 OWNER TO hopverkefni2;

CREATE TABLE IF NOT EXISTS schema_version (
    version int NOT NULL
);

ALTER TABLE IF EXISTS public.schema_version
    OWNER TO hopverkefni2;

INSERT INTO schema_version(version)
SELECT 0 WHERE NOT EXISTS (SELECT * FROM schema_version);