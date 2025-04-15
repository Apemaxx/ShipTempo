-- Create billing_codes table if it doesn't exist
CREATE TABLE IF NOT EXISTS billing_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(code)
);

-- Create invoices table if it doesn't exist
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipment_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'void')),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(invoice_number)
);

-- Create invoice_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  billing_code_id TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit_memos table if it doesn't exist
CREATE TABLE IF NOT EXISTS credit_memos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memo_number TEXT NOT NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  invoice_number TEXT,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipment_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'issued', 'applied')),
  issue_date DATE NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(memo_number)
);

-- Create credit_memo_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS credit_memo_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  credit_memo_id UUID NOT NULL REFERENCES credit_memos(id) ON DELETE CASCADE,
  billing_code_id TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE billing_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_memo_items ENABLE ROW LEVEL SECURITY;

-- Create policies for billing_codes
DROP POLICY IF EXISTS "Allow all users to read billing_codes" ON billing_codes;
CREATE POLICY "Allow all users to read billing_codes"
  ON billing_codes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert billing_codes" ON billing_codes;
CREATE POLICY "Allow authenticated users to insert billing_codes"
  ON billing_codes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to update billing_codes" ON billing_codes;
CREATE POLICY "Allow authenticated users to update billing_codes"
  ON billing_codes FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to delete billing_codes" ON billing_codes;
CREATE POLICY "Allow authenticated users to delete billing_codes"
  ON billing_codes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add tables to realtime publication
DROP FUNCTION IF EXISTS add_table_to_publication;
CREATE OR REPLACE FUNCTION add_table_to_publication()
RETURNS void AS $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Check if billing_codes is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'billing_codes'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE billing_codes';
  END IF;
  
  -- Check if invoices is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'invoices'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE invoices';
  END IF;
  
  -- Check if invoice_items is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'invoice_items'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE invoice_items';
  END IF;
  
  -- Check if credit_memos is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'credit_memos'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE credit_memos';
  END IF;
  
  -- Check if credit_memo_items is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'credit_memo_items'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE credit_memo_items';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT add_table_to_publication();

-- Drop the function after use
DROP FUNCTION add_table_to_publication();
