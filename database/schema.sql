-- PostgreSQL starter schema. REVIEW AND TEST before applying; not yet executed.
BEGIN;
CREATE TABLE categories (
 id text PRIMARY KEY,
 name jsonb NOT NULL CHECK (name ?& ARRAY['zh','en','ms']),
 sort_order integer NOT NULL DEFAULT 0
);
CREATE TABLE options (
 kind text NOT NULL CHECK (kind IN ('size','milk','topping','foam')),
 id text NOT NULL,
 name jsonb NOT NULL CHECK (name ?& ARRAY['zh','en','ms']),
 price_cents integer NOT NULL CHECK (price_cents >= 0),
 metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
 sort_order integer NOT NULL DEFAULT 0,
 PRIMARY KEY (kind,id)
);
CREATE TABLE drinks (
 id text PRIMARY KEY,
 category_id text NOT NULL REFERENCES categories(id),
 name jsonb NOT NULL CHECK (name ?& ARRAY['zh','en','ms']),
 story jsonb NOT NULL CHECK (story ?& ARRAY['zh','en','ms']),
 ingredients jsonb NOT NULL CHECK (ingredients ?& ARRAY['zh','en','ms']),
 price_cents integer NOT NULL CHECK (price_cents >= 0),
 note text NOT NULL DEFAULT '',
 included_foam_id text,
 included_foam_kind text NOT NULL DEFAULT 'foam' CHECK(included_foam_kind='foam'),
 sort_order integer NOT NULL DEFAULT 0,
 is_active boolean NOT NULL DEFAULT true,
 FOREIGN KEY(included_foam_kind,included_foam_id) REFERENCES options(kind,id)
);
CREATE INDEX drinks_category_sort_idx ON drinks(category_id,sort_order);
CREATE TABLE drink_options (
 drink_id text NOT NULL REFERENCES drinks(id),
 option_kind text NOT NULL CHECK(option_kind IN ('topping','foam')),
 option_id text NOT NULL,
 included boolean NOT NULL DEFAULT false,
 sort_order integer NOT NULL DEFAULT 0,
 PRIMARY KEY(drink_id,option_kind,option_id),
 FOREIGN KEY(option_kind,option_id) REFERENCES options(kind,id)
);
CREATE TABLE demo_orders (
 id uuid PRIMARY KEY,
 public_reference text UNIQUE NOT NULL,
 pickup_name text NOT NULL CHECK(length(trim(pickup_name)) BETWEEN 1 AND 50),
 currency char(3) NOT NULL DEFAULT 'MYR' CHECK(currency='MYR'),
 total_cents integer NOT NULL CHECK(total_cents >= 0),
 simulated boolean NOT NULL DEFAULT true CHECK(simulated=true),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE demo_order_items (
 id uuid PRIMARY KEY,
 order_id uuid NOT NULL REFERENCES demo_orders(id),
 drink_id text NOT NULL REFERENCES drinks(id),
 quantity integer NOT NULL CHECK(quantity BETWEEN 1 AND 99),
 unit_price_cents integer NOT NULL CHECK(unit_price_cents >= 0),
 drink_name_snapshot jsonb NOT NULL,
 selection_snapshot jsonb NOT NULL
);
CREATE INDEX demo_order_items_order_idx ON demo_order_items(order_id);
COMMIT;
