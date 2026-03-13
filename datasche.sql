-- Table: public.pickups

-- DROP TABLE IF EXISTS public.pickups;

CREATE TABLE IF NOT EXISTS public.pickups
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    items jsonb,
    total_qty integer DEFAULT 0,
    total_weight numeric(10,2) DEFAULT 0.00,
    alternate_number character varying(20) COLLATE pg_catalog."default",
    time_slot character varying(50) COLLATE pg_catalog."default",
    city character varying(100) COLLATE pg_catalog."default" DEFAULT 'Hyderabad'::character varying,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'scheduled'::character varying,
    amount numeric(10,2) DEFAULT 0.00,
    collector_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    pickup_no integer NOT NULL DEFAULT nextval('pickups_pickup_no_seq'::regclass),
    CONSTRAINT pickups_pkey PRIMARY KEY (id),
    CONSTRAINT pickups_collector_id_fkey FOREIGN KEY (collector_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT pickups_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT pickups_status_check CHECK (status::text = ANY (ARRAY['scheduled'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.pickups
    OWNER to postgres;
-- Index: idx_pickups_collector_id

-- DROP INDEX IF EXISTS public.idx_pickups_collector_id;

CREATE INDEX IF NOT EXISTS idx_pickups_collector_id
    ON public.pickups USING btree
    (collector_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_pickups_created_at

-- DROP INDEX IF EXISTS public.idx_pickups_created_at;

CREATE INDEX IF NOT EXISTS idx_pickups_created_at
    ON public.pickups USING btree
    (created_at ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_pickups_status

-- DROP INDEX IF EXISTS public.idx_pickups_status;

CREATE INDEX IF NOT EXISTS idx_pickups_status
    ON public.pickups USING btree
    (status COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_pickups_user_id

-- DROP INDEX IF EXISTS public.idx_pickups_user_id;

CREATE INDEX IF NOT EXISTS idx_pickups_user_id
    ON public.pickups USING btree
    (user_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
******************************************************
-- Table: public.profiles

-- DROP TABLE IF EXISTS public.profiles;

CREATE TABLE IF NOT EXISTS public.profiles
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    full_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    role character varying(20) COLLATE pg_catalog."default" DEFAULT 'customer'::character varying,
    wallet_balance numeric(10,2) DEFAULT 0.00,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    address text COLLATE pg_catalog."default",
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT profiles_role_check CHECK (role::text = ANY (ARRAY['customer'::character varying, 'collector'::character varying, 'admin'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.profiles
    OWNER to postgres;
-- Index: idx_profiles_role

-- DROP INDEX IF EXISTS public.idx_profiles_role;

CREATE INDEX IF NOT EXISTS idx_profiles_role
    ON public.profiles USING btree
    (role COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_profiles_user_id

-- DROP INDEX IF EXISTS public.idx_profiles_user_id;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id
    ON public.profiles USING btree
    (user_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

******************************************************
-- Table: public.scrap_categories

-- DROP TABLE IF EXISTS public.scrap_categories;

CREATE TABLE IF NOT EXISTS public.scrap_categories
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    icon_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    icon_bg character varying(20) COLLATE pg_catalog."default" NOT NULL,
    card_bg character varying(20) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT scrap_categories_pkey PRIMARY KEY (id),
    CONSTRAINT scrap_categories_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.scrap_categories
    OWNER to postgres;
******************************************************
-- Table: public.scrap_items

-- DROP TABLE IF EXISTS public.scrap_items;

CREATE TABLE IF NOT EXISTS public.scrap_items
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    category_id uuid NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    measurement_type character varying(20) COLLATE pg_catalog."default" NOT NULL,
    base_price numeric(10,2) DEFAULT 0.00,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT scrap_items_pkey PRIMARY KEY (id),
    CONSTRAINT scrap_items_category_id_name_key UNIQUE (category_id, name),
    CONSTRAINT scrap_items_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES public.scrap_categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT scrap_items_measurement_type_check CHECK (measurement_type::text = ANY (ARRAY['weight'::character varying, 'quantity'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.scrap_items
    OWNER to postgres;
-- Index: idx_scrap_items_category_id

-- DROP INDEX IF EXISTS public.idx_scrap_items_category_id;

CREATE INDEX IF NOT EXISTS idx_scrap_items_category_id
    ON public.scrap_items USING btree
    (category_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
******************************************************
-- Table: public.scrap_requests

-- DROP TABLE IF EXISTS public.scrap_requests;

CREATE TABLE IF NOT EXISTS public.scrap_requests
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    items jsonb,
    total_weight numeric(10,2) DEFAULT 0.00,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'draft'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT scrap_requests_pkey PRIMARY KEY (id),
    CONSTRAINT scrap_requests_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT scrap_requests_status_check CHECK (status::text = ANY (ARRAY['draft'::character varying, 'submitted'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.scrap_requests
    OWNER to postgres;
-- Index: idx_scrap_requests_user_id

-- DROP INDEX IF EXISTS public.idx_scrap_requests_user_id;

CREATE INDEX IF NOT EXISTS idx_scrap_requests_user_id
    ON public.scrap_requests USING btree
    (user_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
******************************************************
-- Table: public.time_slots

-- DROP TABLE IF EXISTS public.time_slots;

CREATE TABLE IF NOT EXISTS public.time_slots
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    slot_text character varying(100) COLLATE pg_catalog."default" NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT time_slots_pkey PRIMARY KEY (id),
    CONSTRAINT time_slots_slot_text_key UNIQUE (slot_text)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.time_slots
    OWNER to postgres;
******************************************************
-- Table: public.user_addresses

-- DROP TABLE IF EXISTS public.user_addresses;

CREATE TABLE IF NOT EXISTS public.user_addresses
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    type character varying(20) COLLATE pg_catalog."default" DEFAULT 'Home'::character varying,
    address text COLLATE pg_catalog."default" NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    house_no character varying(100) COLLATE pg_catalog."default",
    area character varying(100) COLLATE pg_catalog."default",
    pincode character varying(10) COLLATE pg_catalog."default",
    landmark text COLLATE pg_catalog."default",
    CONSTRAINT user_addresses_pkey PRIMARY KEY (id),
    CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_addresses
    OWNER to postgres;
-- Index: idx_user_addresses_user_id

-- DROP INDEX IF EXISTS public.idx_user_addresses_user_id;

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id
    ON public.user_addresses USING btree
    (user_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
******************************************************
-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password_hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    reset_token character varying(255) COLLATE pg_catalog."default",
    reset_token_expires timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
******************************************************