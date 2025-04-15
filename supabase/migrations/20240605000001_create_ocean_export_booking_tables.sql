-- Create ocean export booking tables

-- Main bookings table
CREATE TABLE IF NOT EXISTS ocean_export_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT NOT NULL UNIQUE,
  carrier_booking_number TEXT,
  prepared_by TEXT,
  sales_by TEXT,
  date DATE,
  agent TEXT,
  consignee TEXT,
  notify_party TEXT,
  carrier TEXT,
  export_ref_no TEXT,
  place_of_receipt TEXT,
  port_of_loading TEXT,
  port_of_discharge TEXT,
  place_of_delivery TEXT,
  final_destination TEXT,
  etd DATE,
  eta DATE,
  commodity TEXT,
  dangerous BOOLEAN DEFAULT FALSE,
  lc BOOLEAN DEFAULT FALSE,
  pre_quoted BOOLEAN DEFAULT FALSE,
  remarks TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipper information
CREATE TABLE IF NOT EXISTS ocean_export_booking_shippers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES ocean_export_bookings(id) ON DELETE CASCADE,
  name TEXT,
  address TEXT,
  tel TEXT,
  fax TEXT,
  attn TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vessel information
CREATE TABLE IF NOT EXISTS ocean_export_booking_vessels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES ocean_export_bookings(id) ON DELETE CASCADE,
  name TEXT,
  voyage_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cargo information
CREATE TABLE IF NOT EXISTS ocean_export_booking_cargo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES ocean_export_bookings(id) ON DELETE CASCADE,
  kgs NUMERIC,
  lbs NUMERIC,
  cbm NUMERIC,
  cft NUMERIC,
  packages INTEGER,
  unit TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery information
CREATE TABLE IF NOT EXISTS ocean_export_booking_delivery_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES ocean_export_bookings(id) ON DELETE CASCADE,
  "to" TEXT,
  port_rail TEXT,
  cut_off_date DATE,
  cut_off_time TEXT,
  warehouse TEXT,
  sed_doc TEXT,
  move_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ocean_export_bookings_modtime
BEFORE UPDATE ON ocean_export_bookings
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_ocean_export_booking_shippers_modtime
BEFORE UPDATE ON ocean_export_booking_shippers
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_ocean_export_booking_vessels_modtime
BEFORE UPDATE ON ocean_export_booking_vessels
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_ocean_export_booking_cargo_modtime
BEFORE UPDATE ON ocean_export_booking_cargo
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_ocean_export_booking_delivery_info_modtime
BEFORE UPDATE ON ocean_export_booking_delivery_info
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Enable row level security
ALTER TABLE ocean_export_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocean_export_booking_shippers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocean_export_booking_vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocean_export_booking_cargo ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocean_export_booking_delivery_info ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (can be restricted later)
CREATE POLICY "Public access to ocean_export_bookings"
ON ocean_export_bookings FOR ALL
USING (true);

CREATE POLICY "Public access to ocean_export_booking_shippers"
ON ocean_export_booking_shippers FOR ALL
USING (true);

CREATE POLICY "Public access to ocean_export_booking_vessels"
ON ocean_export_booking_vessels FOR ALL
USING (true);

CREATE POLICY "Public access to ocean_export_booking_cargo"
ON ocean_export_booking_cargo FOR ALL
USING (true);

CREATE POLICY "Public access to ocean_export_booking_delivery_info"
ON ocean_export_booking_delivery_info FOR ALL
USING (true);

-- Enable realtime
alter publication supabase_realtime add table ocean_export_bookings;
alter publication supabase_realtime add table ocean_export_booking_shippers;
alter publication supabase_realtime add table ocean_export_booking_vessels;
alter publication supabase_realtime add table ocean_export_booking_cargo;
alter publication supabase_realtime add table ocean_export_booking_delivery_info;
