-- Add missing columns to shipments table if they don't exist
DO $$ 
BEGIN
    -- Check if customer_name column exists and add if it doesn't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shipments' AND column_name = 'customer_name') THEN
        ALTER TABLE shipments ADD COLUMN customer_name TEXT;
    END IF;

    -- Check if booking_number column exists and add if it doesn't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shipments' AND column_name = 'booking_number') THEN
        ALTER TABLE shipments ADD COLUMN booking_number TEXT;
    END IF;

    -- Check if container_number column exists and add if it doesn't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shipments' AND column_name = 'container_number') THEN
        ALTER TABLE shipments ADD COLUMN container_number TEXT;
    END IF;

    -- Check if bill_of_lading column exists and add if it doesn't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shipments' AND column_name = 'bill_of_lading') THEN
        ALTER TABLE shipments ADD COLUMN bill_of_lading TEXT;
    END IF;

    -- Check if pro_number column exists and add if it doesn't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shipments' AND column_name = 'pro_number') THEN
        ALTER TABLE shipments ADD COLUMN pro_number TEXT;
    END IF;

    -- Check if reference column exists and add if it doesn't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shipments' AND column_name = 'reference') THEN
        ALTER TABLE shipments ADD COLUMN reference TEXT;
    END IF;

    -- Check if type column exists and add if it doesn't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shipments' AND column_name = 'type') THEN
        ALTER TABLE shipments ADD COLUMN type TEXT;
    END IF;

    -- Check if status column exists and add if it doesn't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shipments' AND column_name = 'status') THEN
        ALTER TABLE shipments ADD COLUMN status TEXT;
    END IF;

    -- Check if created_at column exists and add if it doesn't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shipments' AND column_name = 'created_at') THEN
        ALTER TABLE shipments ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- Create the shipments table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_name = 'shipments') THEN
        CREATE TABLE shipments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            reference TEXT,
            type TEXT,
            status TEXT,
            customer_name TEXT,
            pro_number TEXT,
            booking_number TEXT,
            container_number TEXT,
            bill_of_lading TEXT,
            carrier_id TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    -- Add indexes for search performance
    CREATE INDEX IF NOT EXISTS idx_shipments_reference ON shipments(reference);
    CREATE INDEX IF NOT EXISTS idx_shipments_pro_number ON shipments(pro_number);
    CREATE INDEX IF NOT EXISTS idx_shipments_booking_number ON shipments(booking_number);
    CREATE INDEX IF NOT EXISTS idx_shipments_container_number ON shipments(container_number);
    CREATE INDEX IF NOT EXISTS idx_shipments_bill_of_lading ON shipments(bill_of_lading);
    CREATE INDEX IF NOT EXISTS idx_shipments_customer_name ON shipments(customer_name);

    -- Enable row level security but allow all operations for now
    ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

    -- Create a policy that allows all operations
    DROP POLICY IF EXISTS "Allow all operations" ON shipments;
    CREATE POLICY "Allow all operations" ON shipments FOR ALL USING (true);

    -- Enable realtime for the shipments table
    ALTER PUBLICATION supabase_realtime ADD TABLE shipments;

END $$;
