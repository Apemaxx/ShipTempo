-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('Active', 'Inactive')),
  services TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create brokers table
CREATE TABLE IF NOT EXISTS brokers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('Active', 'Inactive')),
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cfs_locations table
CREATE TABLE IF NOT EXISTS cfs_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('Active', 'Inactive')),
  operating_hours TEXT,
  services TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trucking_companies table
CREATE TABLE IF NOT EXISTS trucking_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('Active', 'Inactive')),
  fleet_size INTEGER,
  service_areas TEXT[],
  pick_reference TEXT,
  pro_number TEXT,
  trucking_status TEXT CHECK (trucking_status IN ('quote', 'booked', 'dispatched', 'in Transit', 'Delivered', NULL)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create insurance_providers table
CREATE TABLE IF NOT EXISTS insurance_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('Active', 'Inactive')),
  coverage_types TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for all tables
ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE brokers DISABLE ROW LEVEL SECURITY;
ALTER TABLE cfs_locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE trucking_companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_providers DISABLE ROW LEVEL SECURITY;

-- Add public policies for all tables
CREATE POLICY "Public access to vendors"
  ON vendors
  USING (true);

CREATE POLICY "Public access to brokers"
  ON brokers
  USING (true);

CREATE POLICY "Public access to cfs_locations"
  ON cfs_locations
  USING (true);

CREATE POLICY "Public access to trucking_companies"
  ON trucking_companies
  USING (true);

CREATE POLICY "Public access to insurance_providers"
  ON insurance_providers
  USING (true);

-- Enable realtime for all tables
alter publication supabase_realtime add table vendors;
alter publication supabase_realtime add table brokers;
alter publication supabase_realtime add table cfs_locations;
alter publication supabase_realtime add table trucking_companies;
alter publication supabase_realtime add table insurance_providers;
