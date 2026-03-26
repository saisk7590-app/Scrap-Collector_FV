-- Database schema snapshot generated at 2026-03-24T06:14:59.591Z
-- Database: scrap_collector

-- public.pickups
CREATE TABLE public.pickups (
  id integer NOT NULL DEFAULT nextval('pickups_id_seq'::regclass),
  pickup_no integer NOT NULL DEFAULT nextval('pickups_pickup_no_seq'::regclass),
  user_id integer NOT NULL,
  items jsonb NULL,
  total_qty integer NULL DEFAULT 0,
  total_weight numeric(10,2) NULL DEFAULT 0.00,
  alternate_number character varying(20) NULL,
  time_slot character varying(50) NULL,
  city character varying(100) NULL DEFAULT 'Hyderabad'::character varying,
  status character varying(20) NULL DEFAULT 'scheduled'::character varying,
  amount numeric(10,2) NULL DEFAULT 0.00,
  collector_id integer NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now()
);

-- public.profiles
CREATE TABLE public.profiles (
  id integer NOT NULL DEFAULT nextval('profiles_id_seq'::regclass),
  user_id integer NOT NULL,
  role_id integer NOT NULL DEFAULT 1,
  full_name character varying(255) NOT NULL,
  phone character varying(20) NULL,
  wallet_balance numeric(10,2) NULL DEFAULT 0.00,
  address text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  alternate_phone character varying(20) NULL
);

-- public.roles
CREATE TABLE public.roles (
  id integer NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
  name character varying(50) NOT NULL,
  display_name character varying(100) NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp without time zone NULL
);

-- public.scrap_categories
CREATE TABLE public.scrap_categories (
  id integer NOT NULL DEFAULT nextval('scrap_categories_id_seq'::regclass),
  name character varying(100) NOT NULL,
  icon_name character varying(50) NOT NULL DEFAULT 'default_icon'::character varying,
  icon_bg character varying(20) NOT NULL DEFAULT '#E5E7EB'::character varying,
  card_bg character varying(20) NOT NULL DEFAULT '#FFFFFF'::character varying,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now()
);

-- public.scrap_items
CREATE TABLE public.scrap_items (
  id integer NOT NULL DEFAULT nextval('scrap_items_id_seq'::regclass),
  category_id integer NOT NULL,
  name character varying(100) NOT NULL,
  measurement_type character varying(20) NOT NULL,
  base_price numeric(10,2) NULL DEFAULT 0.00,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now()
);

-- public.scrap_requests
CREATE TABLE public.scrap_requests (
  id integer NOT NULL DEFAULT nextval('scrap_requests_id_seq'::regclass),
  user_id integer NOT NULL,
  items jsonb NULL,
  total_weight numeric(10,2) NULL DEFAULT 0.00,
  status character varying(20) NULL DEFAULT 'draft'::character varying,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now()
);

-- public.time_slots
CREATE TABLE public.time_slots (
  id integer NOT NULL DEFAULT nextval('time_slots_id_seq'::regclass),
  slot_text character varying(100) NOT NULL,
  is_active boolean NULL DEFAULT true,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now()
);

-- public.user_addresses
CREATE TABLE public.user_addresses (
  id integer NOT NULL DEFAULT nextval('user_addresses_id_seq'::regclass),
  user_id integer NOT NULL,
  type character varying(20) NULL DEFAULT 'Home'::character varying,
  house_no character varying(100) NULL,
  area character varying(100) NULL,
  pincode character varying(10) NULL,
  landmark text NULL,
  address text NOT NULL,
  is_default boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now()
);

-- public.users
CREATE TABLE public.users (
  id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  email character varying(255) NOT NULL,
  password_hash character varying(255) NOT NULL,
  reset_token character varying(255) NULL,
  reset_token_expires timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now()
);
