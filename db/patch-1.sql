CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS public.users
(
    id bigserial NOT NULL,
    email citext NOT NULL,
    password_hash text NOT NULL,
    display_name character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (email)
);

ALTER TABLE IF EXISTS public.users
    OWNER to hopverkefni2;

CREATE TABLE IF NOT EXISTS public.groups
(
    id bigserial NOT NULL,
    name character varying(100) NOT NULL,
    created_by bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (created_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
);

ALTER TABLE IF EXISTS public.groups
    OWNER to hopverkefni2;

CREATE TABLE IF NOT EXISTS public.group_members
(
    group_id bigint NOT NULL,
    user_id bigint NOT NULL,
    role text NOT NULL DEFAULT 'member',
    joined_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id)
        REFERENCES public.groups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CHECK (role IN ('admin', 'member')) NOT VALID
);

ALTER TABLE IF EXISTS public.group_members
    OWNER to hopverkefni2;

CREATE INDEX IF NOT EXISTS group_members_user_id_idx
    ON public.group_members USING btree
    (user_id)
    WITH (deduplicate_items=True)
;

CREATE TABLE IF NOT EXISTS public.transactions
(
    id bigserial NOT NULL,
    group_id bigint NOT NULL,
    created_by bigint NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    total_amount numeric(12, 2) NOT NULL,
    occurred_at timestamp with time zone NOT NULL DEFAULT now(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (group_id)
        REFERENCES public.groups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    FOREIGN KEY (created_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
);

ALTER TABLE IF EXISTS public.transactions
    OWNER to hopverkefni2;

CREATE INDEX IF NOT EXISTS transaction_group_id_idx
    ON public.transactions USING btree
    (group_id)
    WITH (deduplicate_items=True)
;

CREATE TABLE IF NOT EXISTS public.transaction_participants
(
    transaction_id bigint NOT NULL,
    user_id bigint NOT NULL,
    paid_amount numeric(12, 2) NOT NULL DEFAULT 0,
    PRIMARY KEY (transaction_id, user_id),
    FOREIGN KEY (transaction_id)
        REFERENCES public.transactions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CHECK (paid_amount >= 0) NOT VALID
);

ALTER TABLE IF EXISTS public.transaction_participants
    OWNER to hopverkefni2;

CREATE INDEX IF NOT EXISTS transaction_participants_user_id_idx
    ON public.transaction_participants USING btree
    (user_id)
    WITH (deduplicate_items=True)
;
