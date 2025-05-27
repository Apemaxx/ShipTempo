-- Create freight_quotes table
CREATE TABLE IF NOT EXISTS freight_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id TEXT NOT NULL,
  customer JSONB NOT NULL,
  origin JSONB NOT NULL,
  destination JSONB NOT NULL,
  cargo JSONB NOT NULL,
  service JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL,
  selected_quote_id TEXT,
  booking_id TEXT
);

-- Enable row level security
ALTER TABLE freight_quotes ENABLE ROW LEVEL SECURITY;

-- Create policy for freight_quotes
DROP POLICY IF EXISTS "Users can view their own freight quotes" ON freight_quotes;
CREATE POLICY "Users can view their own freight quotes"
  ON freight_quotes
  FOR ALL
  USING (true);

-- Enable realtime
alter publication supabase_realtime add table freight_quotes;
