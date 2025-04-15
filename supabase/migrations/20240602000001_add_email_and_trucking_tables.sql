-- Check if shipments table exists and create it if not
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference_number TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add user_id column to shipments table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'shipments' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE shipments ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create email_accounts table
CREATE TABLE IF NOT EXISTS email_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook')),
  email TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  connected BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
  shipment_id UUID REFERENCES shipments(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  to_recipients TEXT[] NOT NULL,
  cc_recipients TEXT[],
  bcc_recipients TEXT[],
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create email_attachments table
CREATE TABLE IF NOT EXISTS email_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  document_id UUID NOT NULL,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create trucking_shipments table
CREATE TABLE IF NOT EXISTS trucking_shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TEXT NOT NULL,
  pick_reference TEXT,
  pro_number TEXT,
  special_instructions TEXT,
  status TEXT NOT NULL CHECK (status IN ('quoted', 'booked', 'dispatched', 'in_transit', 'delivered', 'completed')),
  carrier TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  vehicle_type TEXT,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucking_shipments ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own email accounts" ON email_accounts;
CREATE POLICY "Users can view their own email accounts"
  ON email_accounts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own email accounts" ON email_accounts;
CREATE POLICY "Users can insert their own email accounts"
  ON email_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own email accounts" ON email_accounts;
CREATE POLICY "Users can update their own email accounts"
  ON email_accounts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own email accounts" ON email_accounts;
CREATE POLICY "Users can delete their own email accounts"
  ON email_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Email policies
DROP POLICY IF EXISTS "Users can view their own emails" ON emails;
CREATE POLICY "Users can view their own emails"
  ON emails FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own emails" ON emails;
CREATE POLICY "Users can insert their own emails"
  ON emails FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own emails" ON emails;
CREATE POLICY "Users can update their own emails"
  ON emails FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own emails" ON emails;
CREATE POLICY "Users can delete their own emails"
  ON emails FOR DELETE
  USING (auth.uid() = user_id);

-- Email attachment policies
DROP POLICY IF EXISTS "Users can view email attachments for their emails" ON email_attachments;
CREATE POLICY "Users can view email attachments for their emails"
  ON email_attachments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM emails
    WHERE emails.id = email_attachments.email_id
    AND emails.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert email attachments for their emails" ON email_attachments;
CREATE POLICY "Users can insert email attachments for their emails"
  ON email_attachments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM emails
    WHERE emails.id = email_attachments.email_id
    AND emails.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete email attachments for their emails" ON email_attachments;
CREATE POLICY "Users can delete email attachments for their emails"
  ON email_attachments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM emails
    WHERE emails.id = email_attachments.email_id
    AND emails.user_id = auth.uid()
  ));

-- Trucking shipment policies
DROP POLICY IF EXISTS "Users can view trucking shipments" ON trucking_shipments;
CREATE POLICY "Users can view trucking shipments"
  ON trucking_shipments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM shipments
    WHERE shipments.id = trucking_shipments.shipment_id
    AND shipments.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert trucking shipments" ON trucking_shipments;
CREATE POLICY "Users can insert trucking shipments"
  ON trucking_shipments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM shipments
    WHERE shipments.id = trucking_shipments.shipment_id
    AND shipments.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update trucking shipments" ON trucking_shipments;
CREATE POLICY "Users can update trucking shipments"
  ON trucking_shipments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM shipments
    WHERE shipments.id = trucking_shipments.shipment_id
    AND shipments.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete trucking shipments" ON trucking_shipments;
CREATE POLICY "Users can delete trucking shipments"
  ON trucking_shipments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM shipments
    WHERE shipments.id = trucking_shipments.shipment_id
    AND shipments.user_id = auth.uid()
  ));

-- Enable realtime for all tables
alter publication supabase_realtime add table email_accounts;
alter publication supabase_realtime add table emails;
alter publication supabase_realtime add table email_attachments;
alter publication supabase_realtime add table trucking_shipments;
