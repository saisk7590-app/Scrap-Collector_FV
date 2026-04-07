1)-- Table: public.collector_wallet_transactions

-- DROP TABLE IF EXISTS public.collector_wallet_transactions;

CREATE TABLE IF NOT EXISTS public.collector_wallet_transactions
(
    id integer NOT NULL DEFAULT nextval('collector_wallet_transactions_id_seq'::regclass),
    collector_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    type character varying(20) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    reference_id integer,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT collector_wallet_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT collector_wallet_transactions_collector_id_fkey FOREIGN KEY (collector_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT collector_wallet_transactions_type_check CHECK (type::text = ANY (ARRAY['CREDIT'::character varying, 'DEBIT'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.collector_wallet_transactions
    OWNER to postgres;
=================================
2)-- Table: public.collectors

-- DROP TABLE IF EXISTS public.collectors;

CREATE TABLE IF NOT EXISTS public.collectors
(
    id integer NOT NULL DEFAULT nextval('collectors_id_seq'::regclass),
    user_id integer NOT NULL,
    profile_id integer,
    vehicle_number character varying(50) COLLATE pg_catalog."default",
    license_number character varying(100) COLLATE pg_catalog."default",
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT collectors_pkey PRIMARY KEY (id),
    CONSTRAINT collectors_user_id_key UNIQUE (user_id),
    CONSTRAINT fk_collector_profile FOREIGN KEY (profile_id)
        REFERENCES public.profiles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT fk_collector_user FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.collectors
    OWNER to postgres;
=================================
3)-- Table: public.corporates

-- DROP TABLE IF EXISTS public.corporates;

CREATE TABLE IF NOT EXISTS public.corporates
(
    id integer NOT NULL DEFAULT nextval('corporates_id_seq'::regclass),
    user_id integer NOT NULL,
    company_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    contact_person character varying(100) COLLATE pg_catalog."default",
    contact_phone character varying(20) COLLATE pg_catalog."default",
    company_email character varying(150) COLLATE pg_catalog."default",
    address text COLLATE pg_catalog."default",
    gst_number character varying(50) COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT corporates_pkey PRIMARY KEY (id),
    CONSTRAINT corporates_user_id_key UNIQUE (user_id),
    CONSTRAINT fk_corporate_user FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.corporates
    OWNER to postgres;
=================================
4)-- Table: public.customers

-- DROP TABLE IF EXISTS public.customers;

CREATE TABLE IF NOT EXISTS public.customers
(
    id integer NOT NULL DEFAULT nextval('customers_id_seq'::regclass),
    user_id integer NOT NULL,
    profile_id integer,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT customers_pkey PRIMARY KEY (id),
    CONSTRAINT customers_user_id_key UNIQUE (user_id),
    CONSTRAINT fk_customer_profile FOREIGN KEY (profile_id)
        REFERENCES public.profiles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT fk_customer_user FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.customers
    OWNER to postgres;
=================================
5)-- Table: public.gated_communities

-- DROP TABLE IF EXISTS public.gated_communities;

CREATE TABLE IF NOT EXISTS public.gated_communities
(
    id integer NOT NULL DEFAULT nextval('gated_communities_id_seq'::regclass),
    user_id integer NOT NULL,
    community_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    manager_name character varying(100) COLLATE pg_catalog."default",
    manager_phone character varying(20) COLLATE pg_catalog."default",
    total_units integer,
    address text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT gated_communities_pkey PRIMARY KEY (id),
    CONSTRAINT gated_communities_user_id_key UNIQUE (user_id),
    CONSTRAINT fk_gated_user FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.gated_communities
    OWNER to postgres;
=================================
6)-- Table: public.government_sectors

-- DROP TABLE IF EXISTS public.government_sectors;

CREATE TABLE IF NOT EXISTS public.government_sectors
(
    id integer NOT NULL DEFAULT nextval('government_sectors_id_seq'::regclass),
    user_id integer NOT NULL,
    department_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    officer_name character varying(100) COLLATE pg_catalog."default",
    contact_number character varying(20) COLLATE pg_catalog."default",
    zone character varying(100) COLLATE pg_catalog."default",
    address text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT government_sectors_pkey PRIMARY KEY (id),
    CONSTRAINT government_sectors_user_id_key UNIQUE (user_id),
    CONSTRAINT fk_government_user FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.government_sectors
    OWNER to postgres;
=================================
7)-- Table: public.pickup_items

-- DROP TABLE IF EXISTS public.pickup_items;

CREATE TABLE IF NOT EXISTS public.pickup_items
(
    id integer NOT NULL DEFAULT nextval('pickup_items_id_seq'::regclass),
    pickup_id integer NOT NULL,
    customer_category_id integer,
    collector_category_id integer,
    customer_weight numeric(10,2) DEFAULT 0.00,
    collector_weight numeric(10,2) DEFAULT 0.00,
    final_price numeric(10,2) DEFAULT 0.00,
    is_modified boolean DEFAULT false,
    remarks text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    measurement_type character varying(20) COLLATE pg_catalog."default" DEFAULT 'weight'::character varying,
    CONSTRAINT pickup_items_pkey PRIMARY KEY (id),
    CONSTRAINT pickup_items_collector_category_id_fkey FOREIGN KEY (collector_category_id)
        REFERENCES public.scrap_categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT pickup_items_customer_category_id_fkey FOREIGN KEY (customer_category_id)
        REFERENCES public.scrap_categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT pickup_items_pickup_id_fkey FOREIGN KEY (pickup_id)
        REFERENCES public.pickups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.pickup_items
    OWNER to postgres;
=================================
8)-- Table: public.pickups

-- DROP TABLE IF EXISTS public.pickups;

CREATE TABLE IF NOT EXISTS public.pickups
(
    id integer NOT NULL DEFAULT nextval('pickups_id_seq'::regclass),
    pickup_no integer NOT NULL DEFAULT nextval('pickups_pickup_no_seq'::regclass),
    user_id integer NOT NULL,
    items jsonb,
    total_qty integer DEFAULT 0,
    total_weight numeric(10,2) DEFAULT 0.00,
    alternate_number character varying(20) COLLATE pg_catalog."default",
    time_slot character varying(50) COLLATE pg_catalog."default",
    city character varying(100) COLLATE pg_catalog."default" DEFAULT 'Hyderabad'::character varying,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'scheduled'::character varying,
    amount numeric(10,2) DEFAULT 0.00,
    collector_id integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    scheduled_date date,
    pickup_date date DEFAULT CURRENT_DATE,
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
=================================
9)-- Table: public.profiles

-- DROP TABLE IF EXISTS public.profiles;

CREATE TABLE IF NOT EXISTS public.profiles
(
    id integer NOT NULL DEFAULT nextval('profiles_id_seq'::regclass),
    user_id integer NOT NULL,
    role_id integer NOT NULL DEFAULT 1,
    full_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    wallet_balance numeric(10,2) DEFAULT 0.00,
    address text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    alternate_phone character varying(20) COLLATE pg_catalog."default",
    assigned_area character varying(100) COLLATE pg_catalog."default",
    profile_image_url text COLLATE pg_catalog."default",
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_role_id_fkey FOREIGN KEY (role_id)
        REFERENCES public.roles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.profiles
    OWNER to postgres;
-- Index: idx_profiles_role_id

-- DROP INDEX IF EXISTS public.idx_profiles_role_id;

CREATE INDEX IF NOT EXISTS idx_profiles_role_id
    ON public.profiles USING btree
    (role_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_profiles_user_id

-- DROP INDEX IF EXISTS public.idx_profiles_user_id;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id
    ON public.profiles USING btree
    (user_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
=================================
10)-- Table: public.roles

-- DROP TABLE IF EXISTS public.roles;

CREATE TABLE IF NOT EXISTS public.roles
(
    id integer NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    display_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp(6) without time zone,
    CONSTRAINT roles_pkey PRIMARY KEY (id),
    CONSTRAINT roles_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.roles
    OWNER to postgres;
=================================
11)-- Table: public.scrap_categories

-- DROP TABLE IF EXISTS public.scrap_categories;

CREATE TABLE IF NOT EXISTS public.scrap_categories
(
    id integer NOT NULL DEFAULT nextval('scrap_categories_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    icon_name character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'default_icon'::character varying,
    icon_bg character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT '#E5E7EB'::character varying,
    card_bg character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT '#FFFFFF'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    has_weight boolean DEFAULT true,
    has_quantity boolean DEFAULT false,
    CONSTRAINT scrap_categories_pkey PRIMARY KEY (id),
    CONSTRAINT scrap_categories_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.scrap_categories
    OWNER to postgres;
=================================
12)-- Table: public.scrap_items

-- DROP TABLE IF EXISTS public.scrap_items;

CREATE TABLE IF NOT EXISTS public.scrap_items
(
    id integer NOT NULL DEFAULT nextval('scrap_items_id_seq'::regclass),
    category_id integer NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    measurement_type character varying(20) COLLATE pg_catalog."default" NOT NULL,
    base_price numeric(10,2) DEFAULT 0.00,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT scrap_items_pkey PRIMARY KEY (id),
    CONSTRAINT scrap_items_category_id_name_key UNIQUE (category_id, name),
    CONSTRAINT uk7tny7ciqpoywhtlfs59w89m43 UNIQUE (category_id, name),
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
=================================
13)-- Table: public.scrap_requests

-- DROP TABLE IF EXISTS public.scrap_requests;

CREATE TABLE IF NOT EXISTS public.scrap_requests
(
    id integer NOT NULL DEFAULT nextval('scrap_requests_id_seq'::regclass),
    user_id integer NOT NULL,
    items jsonb,
    total_weight numeric(10,2) DEFAULT 0.00,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'draft'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    total_qty integer DEFAULT 0,
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
=================================
14)-- Table: public.time_slots

-- DROP TABLE IF EXISTS public.time_slots;

CREATE TABLE IF NOT EXISTS public.time_slots
(
    id integer NOT NULL DEFAULT nextval('time_slots_id_seq'::regclass),
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
=================================
15)-- Table: public.user_addresses

-- DROP TABLE IF EXISTS public.user_addresses;

CREATE TABLE IF NOT EXISTS public.user_addresses
(
    id integer NOT NULL DEFAULT nextval('user_addresses_id_seq'::regclass),
    user_id integer NOT NULL,
    type character varying(20) COLLATE pg_catalog."default" DEFAULT 'Home'::character varying,
    house_no character varying(100) COLLATE pg_catalog."default",
    area character varying(100) COLLATE pg_catalog."default",
    pincode character varying(10) COLLATE pg_catalog."default",
    landmark text COLLATE pg_catalog."default",
    address text COLLATE pg_catalog."default" NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
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
=================================
16)-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
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
=================================
17)-- Table: public.wallet_transactions

-- DROP TABLE IF EXISTS public.wallet_transactions;

CREATE TABLE IF NOT EXISTS public.wallet_transactions
(
    id integer NOT NULL DEFAULT nextval('wallet_transactions_id_seq'::regclass),
    user_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    type character varying(20) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT wallet_transactions_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT wallet_transactions_type_check CHECK (type::text = ANY (ARRAY['CREDIT'::character varying, 'DEBIT'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wallet_transactions
    OWNER to postgres;
=================================
18)CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,

    pickup_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    collector_id INTEGER NOT NULL,

    total_amount NUMERIC(10,2) NOT NULL,
    total_weight NUMERIC(10,2),

    status VARCHAR(20) DEFAULT 'GENERATED', -- GENERATED, SENT, PAID

    pdf_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
=================================
19)CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,

    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),

    weight NUMERIC(10,2) NOT NULL,
    price_per_kg NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);
=================================
ALTER TABLE invoices
ADD CONSTRAINT fk_pickup
FOREIGN KEY (pickup_id) REFERENCES pickups(id);

ALTER TABLE invoices
ADD CONSTRAINT fk_customer
FOREIGN KEY (customer_id) REFERENCES users(id);

ALTER TABLE invoices
ADD CONSTRAINT fk_collector
FOREIGN KEY (collector_id) REFERENCES users(id);

-- Payment tracking
ALTER TABLE invoices ADD COLUMN payment_status VARCHAR(20) DEFAULT 'PENDING';

-- Tax support
ALTER TABLE invoices ADD COLUMN tax_amount NUMERIC(10,2) DEFAULT 0;

-- Notes
ALTER TABLE invoices ADD COLUMN notes TEXT;
=================================
*Add auto updated_at trigger (for ALL tables)*

-- Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_pickups_updated
BEFORE UPDATE ON pickups
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_pickup_items_updated
BEFORE UPDATE ON pickup_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_scrap_categories_updated
BEFORE UPDATE ON scrap_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_scrap_items_updated
BEFORE UPDATE ON scrap_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_scrap_requests_updated
BEFORE UPDATE ON scrap_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_time_slots_updated
BEFORE UPDATE ON time_slots
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_addresses_updated
BEFORE UPDATE ON user_addresses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_invoices_updated
BEFORE UPDATE ON invoices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
====================
🔧 TABLE-WISE FIXES
====================
*collector_wallet_transactions*
CREATE INDEX IF NOT EXISTS idx_cwt_collector_id
ON collector_wallet_transactions(collector_id);
========
*collectors*
CREATE INDEX IF NOT EXISTS idx_collectors_user_id
ON collectors(user_id);
========
*pickup_items*
ALTER TABLE pickup_items
ADD CONSTRAINT chk_measurement_type
CHECK (measurement_type IN ('weight','quantity'));
========
*pickups*
ALTER TABLE pickups
ADD CONSTRAINT chk_amount_positive CHECK (amount >= 0);
========
*profiles*
ALTER TABLE profiles
ADD CONSTRAINT chk_wallet_balance CHECK (wallet_balance >= 0);
========
*scrap_items*
ALTER TABLE scrap_items
DROP CONSTRAINT IF EXISTS uk7tny7ciqpoywhtlfs59w89m43;
========
*scrap_requests*
ALTER TABLE scrap_requests
ADD CONSTRAINT chk_total_weight CHECK (total_weight >= 0);
========
*user_addresses*
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_default_address
ON user_addresses(user_id)
WHERE is_default = true;
========
*wallet_transactions*
CREATE INDEX IF NOT EXISTS idx_wallet_user_id
ON wallet_transactions(user_id);
========
*invoices*
🔥 FIX 1: Add status check
ALTER TABLE invoices
ADD CONSTRAINT chk_invoice_status
CHECK (status IN ('GENERATED','SENT','PAID'));
🔥 FIX 2: Payment status check
ALTER TABLE invoices
ADD CONSTRAINT chk_payment_status
CHECK (payment_status IN ('PENDING','PAID','FAILED'));
🔥 FIX 3: Indexes (VERY IMPORTANT)
CREATE INDEX IF NOT EXISTS idx_invoices_pickup_id
ON invoices(pickup_id);

CREATE INDEX IF NOT EXISTS idx_invoices_customer_id
ON invoices(customer_id);
========
*invoice_items*
ALTER TABLE invoice_items
ADD CONSTRAINT chk_weight_positive CHECK (weight >= 0);

ALTER TABLE invoice_items
ADD CONSTRAINT chk_price_positive CHECK (price_per_kg >= 0);
========
