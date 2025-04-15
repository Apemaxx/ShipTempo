-- Create function to handle invoice creation with items in a transaction
CREATE OR REPLACE FUNCTION create_invoice(invoice_data JSONB, items_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_invoice_id UUID;
  new_invoice JSONB;
BEGIN
  -- Insert the invoice
  INSERT INTO invoices (
    invoice_number,
    customer_id,
    customer_name,
    shipment_id,
    amount,
    status,
    issue_date,
    due_date,
    paid_date,
    notes,
    created_at,
    updated_at
  )
  VALUES (
    invoice_data->>'invoice_number',
    invoice_data->>'customer_id',
    invoice_data->>'customer_name',
    invoice_data->>'shipment_id',
    (invoice_data->>'amount')::DECIMAL,
    invoice_data->>'status',
    (invoice_data->>'issue_date')::DATE,
    (invoice_data->>'due_date')::DATE,
    CASE WHEN invoice_data->>'paid_date' IS NOT NULL THEN (invoice_data->>'paid_date')::DATE ELSE NULL END,
    invoice_data->>'notes',
    NOW(),
    NOW()
  )
  RETURNING id INTO new_invoice_id;
  
  -- Insert the invoice items
  INSERT INTO invoice_items (
    invoice_id,
    billing_code_id,
    description,
    quantity,
    rate,
    amount,
    created_at,
    updated_at
  )
  SELECT 
    new_invoice_id,
    item->>'billing_code_id',
    item->>'description',
    (item->>'quantity')::INTEGER,
    (item->>'rate')::DECIMAL,
    (item->>'amount')::DECIMAL,
    NOW(),
    NOW()
  FROM jsonb_array_elements(items_data) AS item;
  
  -- Return the new invoice ID
  new_invoice := jsonb_build_object('id', new_invoice_id);
  RETURN new_invoice;
END;
$$;

-- Create function to handle credit memo creation with items in a transaction
CREATE OR REPLACE FUNCTION create_credit_memo(memo_data JSONB, items_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_memo_id UUID;
  new_memo JSONB;
BEGIN
  -- Insert the credit memo
  INSERT INTO credit_memos (
    memo_number,
    invoice_id,
    invoice_number,
    customer_id,
    customer_name,
    shipment_id,
    amount,
    status,
    issue_date,
    reason,
    notes,
    created_at,
    updated_at
  )
  VALUES (
    memo_data->>'memo_number',
    CASE WHEN memo_data->>'invoice_id' IS NOT NULL THEN (memo_data->>'invoice_id')::UUID ELSE NULL END,
    memo_data->>'invoice_number',
    memo_data->>'customer_id',
    memo_data->>'customer_name',
    memo_data->>'shipment_id',
    (memo_data->>'amount')::DECIMAL,
    memo_data->>'status',
    (memo_data->>'issue_date')::DATE,
    memo_data->>'reason',
    memo_data->>'notes',
    NOW(),
    NOW()
  )
  RETURNING id INTO new_memo_id;
  
  -- Insert the credit memo items
  INSERT INTO credit_memo_items (
    credit_memo_id,
    billing_code_id,
    description,
    quantity,
    rate,
    amount,
    created_at,
    updated_at
  )
  SELECT 
    new_memo_id,
    item->>'billing_code_id',
    item->>'description',
    (item->>'quantity')::INTEGER,
    (item->>'rate')::DECIMAL,
    (item->>'amount')::DECIMAL,
    NOW(),
    NOW()
  FROM jsonb_array_elements(items_data) AS item;
  
  -- Return the new credit memo ID
  new_memo := jsonb_build_object('id', new_memo_id);
  RETURN new_memo;
END;
$$;
