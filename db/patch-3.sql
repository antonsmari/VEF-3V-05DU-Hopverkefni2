ALTER TABLE IF EXISTS public.groups
    ADD COLUMN description character varying(500) NOT NULL DEFAULT '';

ALTER TABLE IF EXISTS public.groups
    ADD COLUMN start_date timestamp with time zone NOT NULL DEFAULT now();

ALTER TABLE IF EXISTS public.groups
    ADD COLUMN end_date timestamp with time zone DEFAULT NULL;

ALTER TABLE IF EXISTS public.groups
    ADD COLUMN invite_code character varying(20) DEFAULT NULL;

ALTER TABLE IF EXISTS public.groups
    ADD COLUMN invite_code_disabled boolean NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS public.groups
    ADD UNIQUE (invite_code);

ALTER TABLE IF EXISTS public.users
    ADD COLUMN description character varying(500) NOT NULL DEFAULT '';

ALTER TABLE IF EXISTS public.users
    ADD COLUMN pronouns character varying(20) NOT NULL DEFAULT '';

ALTER TABLE IF EXISTS public.users
    ADD COLUMN image character varying(50) NOT NULL DEFAULT '';

CREATE TABLE public.user_debts
(
    debtor bigint NOT NULL,
    debtee bigint NOT NULL,
    amount numeric(12, 2) NOT NULL DEFAULT 0,
    PRIMARY KEY (debtor, debtee),
    FOREIGN KEY (debtor)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    FOREIGN KEY (debtee)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);