-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  tax_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_code TEXT NOT NULL,
  postal_code TEXT,
  city TEXT,
  state TEXT,
  location_type TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number TEXT UNIQUE NOT NULL,
  quote_type TEXT NOT NULL CHECK (quote_type IN ('ltl', 'air', 'lcl_export')),
  status TEXT NOT NULL DEFAULT 'draft',
  customer_id UUID,
  origin_id UUID,
  destination_id UUID,
  expiry_date TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '15 days'),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID
);

-- Add foreign key constraints to quotes table
ALTER TABLE quotes
  ADD CONSTRAINT fk_quotes_customer
  FOREIGN KEY (customer_id)
  REFERENCES users(id)
  ON DELETE SET NULL;

ALTER TABLE quotes
  ADD CONSTRAINT fk_quotes_origin_location
  FOREIGN KEY (origin_id)
  REFERENCES locations(id)
  ON DELETE SET NULL;

ALTER TABLE quotes
  ADD CONSTRAINT fk_quotes_destination_location
  FOREIGN KEY (destination_id)
  REFERENCES locations(id)
  ON DELETE SET NULL;

ALTER TABLE quotes
  ADD CONSTRAINT fk_quotes_created_by
  FOREIGN KEY (created_by)
  REFERENCES users(id)
  ON DELETE SET NULL;

-- Create LTL quotes table
CREATE TABLE IF NOT EXISTS ltl_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id),
  pieces INTEGER,
  packaging_type INTEGER,
  weight NUMERIC,
  weight_unit TEXT,
  length NUMERIC,
  width NUMERIC,
  height NUMERIC,
  dimension_unit TEXT,
  freight_class TEXT,
  freight_class_auto BOOLEAN,
  density NUMERIC,
  accessorials TEXT[]
);

-- Create air quotes table
CREATE TABLE IF NOT EXISTS air_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id),
  origin_airport TEXT,
  destination_airport TEXT,
  service_level TEXT,
  ready_date TIMESTAMP,
  delivery_date TIMESTAMP,
  pieces INTEGER,
  packaging_type INTEGER,
  weight NUMERIC,
  weight_unit TEXT,
  length NUMERIC,
  width NUMERIC,
  height NUMERIC,
  dimension_unit TEXT,
  volume_cbm NUMERIC,
  volumetric_weight NUMERIC,
  chargeable_weight NUMERIC,
  hazardous BOOLEAN,
  temperature_controlled BOOLEAN,
  temp_min NUMERIC,
  temp_max NUMERIC
);

-- Create LCL quotes table
CREATE TABLE IF NOT EXISTS lcl_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id),
  origin_port TEXT,
  destination_port TEXT,
  incoterm TEXT,
  cargo_ready_date TIMESTAMP,
  commodity_type TEXT,
  pieces INTEGER,
  packaging_type INTEGER,
  weight NUMERIC,
  weight_unit TEXT,
  length NUMERIC,
  width NUMERIC,
  height NUMERIC,
  dimension_unit TEXT,
  volume_cbm NUMERIC,
  hazardous BOOLEAN
);

-- Enable realtime for all tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table quotes;
alter publication supabase_realtime add table customers;
alter publication supabase_realtime add table locations;
alter publication supabase_realtime add table ltl_quotes;
alter publication supabase_realtime add table air_quotes;
alter publication supabase_realtime add table lcl_quotes;