import { xanoApiClient } from "./index";
import { AUTH_CODE } from "@/config";
import { BillingCode, Invoice, CreditMemo, InvoiceItem } from "@/types/billing";

// ==================== BILLING CODES API FUNCTIONS ====================

// Get all billing codes
export async function getBillingCodes(): Promise<BillingCode[]> {
  try {
    const data = await xanoApiClient.get(
      "/billing_codes?sort=code&order=asc",
      AUTH_CODE
    );
    return data || [];
  } catch (error) {
    console.error("Error in getBillingCodes:", error);
    return [];
  }
}

// Create a new billing code
export async function createBillingCode(
  billingCode: Omit<BillingCode, "id" | "createdAt" | "updatedAt">
): Promise<BillingCode | null> {
  try {
    const now = new Date().toISOString();
    const newCode = {
      ...billingCode,
      createdAt: now,
      updatedAt: now,
    };

    const data = await xanoApiClient.post("/billing_codes", newCode, AUTH_CODE);
    return data || null;
  } catch (error) {
    console.error("Error in createBillingCode:", error);
    return null;
  }
}

// Update a billing code
export async function updateBillingCode(
  id: string,
  billingCode: Partial<BillingCode>
): Promise<boolean> {
  try {
    await xanoApiClient.put(
      `/billing_codes/${id}`,
      {
        ...billingCode,
        updatedAt: new Date().toISOString(),
      },
      AUTH_CODE
    );
    return true;
  } catch (error) {
    console.error("Error in updateBillingCode:", error);
    return false;
  }
}

// Delete a billing code
export async function deleteBillingCode(id: string): Promise<boolean> {
  try {
    await xanoApiClient.delete(`/billing_codes/${id}`, AUTH_CODE);
    return true;
  } catch (error) {
    console.error("Error in deleteBillingCode:", error);
    return false;
  }
}

// ==================== INVOICES API FUNCTIONS ====================

// Get all invoices
export async function getInvoices(): Promise<Invoice[]> {
  try {
    const data = await xanoApiClient.get(
      "/invoices?include_items=true",
      AUTH_CODE
    );

    // Transformar los datos al formato esperado
    return (data || []).map((invoice: any) => ({
      ...mapInvoiceFromDb(invoice),
      items: (invoice.items || []).map(mapInvoiceItemFromDb),
    }));
  } catch (error) {
    console.error("Error in getInvoices:", error);
    return [];
  }
}

// Get a single invoice by ID
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const data = await xanoApiClient.get(
      `/invoices/${id}?include_items=true`,
      AUTH_CODE
    );

    if (!data) {
      return null;
    }

    return {
      ...mapInvoiceFromDb(data),
      items: (data.items || []).map(mapInvoiceItemFromDb),
    };
  } catch (error) {
    console.error("Error in getInvoiceById:", error);
    return null;
  }
}

// Create a new invoice
export async function createInvoice(
  invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">
): Promise<Invoice | null> {
  try {
    const data = await xanoApiClient.post(
      "/invoices",
      {
        invoice: mapInvoiceToDb(invoice),
        items: invoice.items.map(mapInvoiceItemToDb),
      },
      AUTH_CODE
    );

    if (!data || !data.id) {
      return null;
    }

    // Return the created invoice
    return getInvoiceById(data.id);
  } catch (error) {
    console.error("Error in createInvoice:", error);
    return null;
  }
}

// Update an invoice
export async function updateInvoice(
  id: string,
  invoice: Partial<Invoice>
): Promise<boolean> {
  try {
    // Actualizar detalles de factura y elementos en una sola operación
    await xanoApiClient.put(
      `/invoices/${id}`,
      {
        invoice: {
          ...mapInvoiceToDb(invoice),
          updated_at: new Date().toISOString(),
        },
        items: invoice.items
          ? invoice.items.map(mapInvoiceItemToDb)
          : undefined,
      },
      AUTH_CODE
    );

    return true;
  } catch (error) {
    console.error("Error in updateInvoice:", error);
    return false;
  }
}

// Delete an invoice
export async function deleteInvoice(id: string): Promise<boolean> {
  try {
    await xanoApiClient.delete(`/invoices/${id}`, AUTH_CODE);
    return true;
  } catch (error) {
    console.error("Error in deleteInvoice:", error);
    return false;
  }
}

// ==================== CREDIT MEMOS API FUNCTIONS ====================

// Get all credit memos
export async function getCreditMemos(): Promise<CreditMemo[]> {
  try {
    const data = await xanoApiClient.get(
      "/credit_memos?include_items=true",
      AUTH_CODE
    );

    // Transformar los datos al formato esperado
    return (data || []).map((memo: any) => ({
      ...mapCreditMemoFromDb(memo),
      items: (memo.items || []).map(mapInvoiceItemFromDb),
    }));
  } catch (error) {
    console.error("Error in getCreditMemos:", error);
    return [];
  }
}

// Get a single credit memo by ID
export async function getCreditMemoById(
  id: string
): Promise<CreditMemo | null> {
  try {
    const data = await xanoApiClient.get(
      `/credit_memos/${id}?include_items=true`,
      AUTH_CODE
    );

    if (!data) {
      return null;
    }

    return {
      ...mapCreditMemoFromDb(data),
      items: (data.items || []).map(mapInvoiceItemFromDb),
    };
  } catch (error) {
    console.error("Error in getCreditMemoById:", error);
    return null;
  }
}

// Create a new credit memo
export async function createCreditMemo(
  creditMemo: Omit<CreditMemo, "id" | "createdAt" | "updatedAt">
): Promise<CreditMemo | null> {
  try {
    const data = await xanoApiClient.post(
      "/credit_memos",
      {
        memo: mapCreditMemoToDb(creditMemo),
        items: creditMemo.items.map(mapInvoiceItemToDb),
      },
      AUTH_CODE
    );

    if (!data || !data.id) {
      return null;
    }

    // Return the created credit memo
    return getCreditMemoById(data.id);
  } catch (error) {
    console.error("Error in createCreditMemo:", error);
    return null;
  }
}

// Update a credit memo
export async function updateCreditMemo(
  id: string,
  creditMemo: Partial<CreditMemo>
): Promise<boolean> {
  try {
    // Actualizar detalles del memo y elementos en una sola operación
    await xanoApiClient.put(
      `/credit_memos/${id}`,
      {
        memo: {
          ...mapCreditMemoToDb(creditMemo),
          updated_at: new Date().toISOString(),
        },
        items: creditMemo.items
          ? creditMemo.items.map(mapInvoiceItemToDb)
          : undefined,
      },
      AUTH_CODE
    );

    return true;
  } catch (error) {
    console.error("Error in updateCreditMemo:", error);
    return false;
  }
}

// Delete a credit memo
export async function deleteCreditMemo(id: string): Promise<boolean> {
  try {
    await xanoApiClient.delete(`/credit_memos/${id}`, AUTH_CODE);
    return true;
  } catch (error) {
    console.error("Error in deleteCreditMemo:", error);
    return false;
  }
}

// ==================== HELPER FUNCTIONS ====================

// Map database invoice to frontend invoice
function mapInvoiceFromDb(dbInvoice: any): Invoice {
  return {
    id: dbInvoice.id,
    invoiceNumber: dbInvoice.invoice_number,
    customerId: dbInvoice.customer_id,
    customerName: dbInvoice.customer_name,
    shipmentId: dbInvoice.shipment_id,
    amount: dbInvoice.amount,
    status: dbInvoice.status,
    issueDate: dbInvoice.issue_date,
    dueDate: dbInvoice.due_date,
    paidDate: dbInvoice.paid_date,
    notes: dbInvoice.notes,
    createdAt: dbInvoice.created_at,
    updatedAt: dbInvoice.updated_at,
    items: [],
  };
}

// Map frontend invoice to database invoice
function mapInvoiceToDb(invoice: Partial<Invoice>): any {
  const dbInvoice: any = {};

  if (invoice.invoiceNumber !== undefined)
    dbInvoice.invoice_number = invoice.invoiceNumber;
  if (invoice.customerId !== undefined)
    dbInvoice.customer_id = invoice.customerId;
  if (invoice.customerName !== undefined)
    dbInvoice.customer_name = invoice.customerName;
  if (invoice.shipmentId !== undefined)
    dbInvoice.shipment_id = invoice.shipmentId;
  if (invoice.amount !== undefined) dbInvoice.amount = invoice.amount;
  if (invoice.status !== undefined) dbInvoice.status = invoice.status;
  if (invoice.issueDate !== undefined) dbInvoice.issue_date = invoice.issueDate;
  if (invoice.dueDate !== undefined) dbInvoice.due_date = invoice.dueDate;
  if (invoice.paidDate !== undefined) dbInvoice.paid_date = invoice.paidDate;
  if (invoice.notes !== undefined) dbInvoice.notes = invoice.notes;

  return dbInvoice;
}

// Map database invoice item to frontend invoice item
function mapInvoiceItemFromDb(dbItem: any): InvoiceItem {
  return {
    id: dbItem.id,
    billingCodeId: dbItem.billing_code_id,
    description: dbItem.description,
    quantity: dbItem.quantity,
    rate: dbItem.rate,
    amount: dbItem.amount,
  };
}

// Map frontend invoice item to database invoice item
function mapInvoiceItemToDb(item: Partial<InvoiceItem>): any {
  const dbItem: any = {};

  if (item.billingCodeId !== undefined)
    dbItem.billing_code_id = item.billingCodeId;
  if (item.description !== undefined) dbItem.description = item.description;
  if (item.quantity !== undefined) dbItem.quantity = item.quantity;
  if (item.rate !== undefined) dbItem.rate = item.rate;
  if (item.amount !== undefined) dbItem.amount = item.amount;

  return dbItem;
}

// Map database credit memo to frontend credit memo
function mapCreditMemoFromDb(dbMemo: any): CreditMemo {
  return {
    id: dbMemo.id,
    memoNumber: dbMemo.memo_number,
    invoiceId: dbMemo.invoice_id,
    invoiceNumber: dbMemo.invoice_number,
    customerId: dbMemo.customer_id,
    customerName: dbMemo.customer_name,
    shipmentId: dbMemo.shipment_id,
    amount: dbMemo.amount,
    status: dbMemo.status,
    issueDate: dbMemo.issue_date,
    reason: dbMemo.reason,
    notes: dbMemo.notes,
    createdAt: dbMemo.created_at,
    updatedAt: dbMemo.updated_at,
    items: [],
  };
}

// Map frontend credit memo to database credit memo
function mapCreditMemoToDb(memo: Partial<CreditMemo>): any {
  const dbMemo: any = {};

  if (memo.memoNumber !== undefined) dbMemo.memo_number = memo.memoNumber;
  if (memo.invoiceId !== undefined) dbMemo.invoice_id = memo.invoiceId;
  if (memo.invoiceNumber !== undefined)
    dbMemo.invoice_number = memo.invoiceNumber;
  if (memo.customerId !== undefined) dbMemo.customer_id = memo.customerId;
  if (memo.customerName !== undefined) dbMemo.customer_name = memo.customerName;
  if (memo.shipmentId !== undefined) dbMemo.shipment_id = memo.shipmentId;
  if (memo.amount !== undefined) dbMemo.amount = memo.amount;
  if (memo.status !== undefined) dbMemo.status = memo.status;
  if (memo.issueDate !== undefined) dbMemo.issue_date = memo.issueDate;
  if (memo.reason !== undefined) dbMemo.reason = memo.reason;
  if (memo.notes !== undefined) dbMemo.notes = memo.notes;

  return dbMemo;
}
