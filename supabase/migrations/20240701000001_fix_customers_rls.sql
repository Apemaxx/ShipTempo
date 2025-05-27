-- Temporarily disable RLS to allow all operations while testing
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

-- Add a public policy that allows all operations without authentication
DROP POLICY IF EXISTS "Public access to customers" ON customers;
CREATE POLICY "Public access to customers"
  ON customers
  USING (true);

-- Enable realtime again to ensure it's active
alter publication supabase_realtime add table customers;
