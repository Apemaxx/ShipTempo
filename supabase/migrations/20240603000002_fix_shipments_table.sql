-- Fix for the shipments table realtime publication
-- Check if the table is already a member of the publication before adding it
DO $$
BEGIN
  -- Check if the shipments table is already a member of the supabase_realtime publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'shipments'
  ) THEN
    -- Only add the table if it's not already a member
    ALTER PUBLICATION supabase_realtime ADD TABLE shipments;
  END IF;
END
$$;