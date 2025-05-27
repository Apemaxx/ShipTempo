-- Create LTL Quotes table to store quote requests and responses
CREATE TABLE IF NOT EXISTS ltl_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  origin_zip VARCHAR(20) NOT NULL,
  origin_country VARCHAR(50) NOT NULL,
  destination_zip VARCHAR(20) NOT NULL,
  destination_country VARCHAR(50) NOT NULL,
  commodity TEXT NOT NULL,
  pieces INTEGER NOT NULL,
  pallets INTEGER NOT NULL,
  packaging_type VARCHAR(50) NOT NULL,
  length NUMERIC(10,2) NOT NULL,
  width NUMERIC(10,2) NOT NULL,
  height NUMERIC(10,2) NOT NULL,
  weight NUMERIC(10,2) NOT NULL,
  freight_class VARCHAR(10) NOT NULL,
  accessorials JSONB,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  company_name VARCHAR(255),
  request_payload JSONB,
  response_payload JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE ltl_quotes ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own quotes
CREATE POLICY "Users can view their own quotes"
  ON ltl_quotes FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own quotes
CREATE POLICY "Users can insert their own quotes"
  ON ltl_quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own quotes
CREATE POLICY "Users can update their own quotes"
  ON ltl_quotes FOR UPDATE
  USING (auth.uid() = user_id);

-- Add to realtime publication
alter publication supabase_realtime add table ltl_quotes;

-- Create index for faster queries
CREATE INDEX idx_ltl_quotes_user_id ON ltl_quotes(user_id);
CREATE INDEX idx_ltl_quotes_status ON ltl_quotes(status);
