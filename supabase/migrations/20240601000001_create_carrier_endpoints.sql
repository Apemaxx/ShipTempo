-- Create carrier_endpoints table
CREATE TABLE IF NOT EXISTS carrier_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  auth_type TEXT NOT NULL,
  auth_details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sample carrier endpoints
INSERT INTO carrier_endpoints (name, url, auth_type, auth_details)
VALUES 
  ('FedEx', 'https://api.fedex.com/shipping/v1/pro-numbers', 'apiKey', '{"headerName": "X-API-Key", "apiKey": "sample_key_fedex"}'::jsonb),
  ('UPS', 'https://api.ups.com/api/shipments/tracking', 'apiKey', '{"headerName": "Authorization", "apiKey": "Bearer sample_key_ups"}'::jsonb),
  ('DHL', 'https://api.dhl.com/shipments/pro', 'basic', '{"username": "dhl_api_user", "password": "sample_password"}'::jsonb);

-- Add pro_number column to shipments table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_tables WHERE tablename = 'shipments') THEN
    CREATE TABLE shipments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      pro_number TEXT,
      carrier_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    BEGIN
      ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pro_number TEXT;
      ALTER TABLE shipments ADD COLUMN IF NOT EXISTS carrier_id TEXT;
    EXCEPTION WHEN OTHERS THEN
      -- Column might already exist
    END;
  END IF;
END $$;

-- Enable realtime for carrier_endpoints
alter publication supabase_realtime add table carrier_endpoints;

-- Enable realtime for shipments if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_catalog.pg_tables WHERE tablename = 'shipments') THEN
    alter publication supabase_realtime add table shipments;
  END IF;
END $$;
