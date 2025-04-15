import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { BillingCode, Invoice, CreditMemo, InvoiceItem } from "@/types/billing";
import {
  XanoContainerResponse,
  ZipCodeLookupResponse,
  LTLQuoteRequest,
  LTLQuoteResponse,
} from "@/types/api";
import { API_BASE_URL, ZIPCODE_API_BASE_URL } from "@/config";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Container interface (now sourced from Xano API)
export interface STGContainer extends XanoContainerResponse {}

// Carrier API endpoints interface
interface CarrierEndpoint {
  name: string;
  url: string;
  authType: "apiKey" | "oauth" | "basic";
  authDetails: Record<string, string>;
}

// Search result interface
export interface ShipmentSearchResult {
  id: string;
  reference: string;
  type: string;
  status: string;
  customer?: string;
  pro_number?: string;
  booking_number?: string;
  container_number?: string;
  bill_of_lading?: string;
  created_at?: string;
}

// Cache for carrier endpoints
let carrierEndpointsCache: CarrierEndpoint[] | null = null;

// Get all carrier endpoints from Supabase
export async function getCarrierEndpoints(): Promise<CarrierEndpoint[]> {
  if (carrierEndpointsCache) return carrierEndpointsCache;

  const { data, error } = await supabase.from("carrier_endpoints").select("*");

  if (error) {
    console.error("Error fetching carrier endpoints:", error);
    return [];
  }

  carrierEndpointsCache = data as CarrierEndpoint[];
  return carrierEndpointsCache;
}

// Search shipments by any reference
export async function searchShipments(
  query: string,
): Promise<ShipmentSearchResult[]> {
  if (!query || query.length < 3) return [];

  try {
    // Search across multiple columns using Postgres ilike for case-insensitive search
    const { data, error } = await supabase
      .from("shipments")
      .select(
        "id, reference, type, status, customer_name, pro_number, booking_number, container_number, bill_of_lading, created_at",
      )
      .or(
        `reference.ilike.%${query}%,` +
          `pro_number.ilike.%${query}%,` +
          `booking_number.ilike.%${query}%,` +
          `container_number.ilike.%${query}%,` +
          `bill_of_lading.ilike.%${query}%,` +
          `customer_name.ilike.%${query}%`,
      )
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error searching shipments:", error);
      return [];
    }

    // Transform the data to match the expected format
    return (data || []).map((item) => ({
      id: item.id,
      reference:
        item.reference ||
        item.booking_number ||
        item.container_number ||
        item.pro_number ||
        item.id,
      type: item.type || "Unknown",
      status: item.status || "pending",
      customer: item.customer_name,
      pro_number: item.pro_number,
      booking_number: item.booking_number,
      container_number: item.container_number,
      bill_of_lading: item.bill_of_lading,
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error("Error in searchShipments:", error);
    return [];
  }
}

// Fetch PRO number from a specific carrier
export async function fetchProNumber(
  carrierId: string,
  shipmentDetails: any,
): Promise<string> {
  try {
    const endpoints = await getCarrierEndpoints();
    const carrierEndpoint = endpoints.find(
      (endpoint) => endpoint.name === carrierId,
    );

    if (!carrierEndpoint) {
      throw new Error(`Carrier endpoint not found for: ${carrierId}`);
    }

    // Configure request based on auth type
    const config: any = {
      headers: {},
    };

    if (carrierEndpoint.authType === "apiKey") {
      config.headers[carrierEndpoint.authDetails.headerName] =
        carrierEndpoint.authDetails.apiKey;
    } else if (carrierEndpoint.authType === "basic") {
      config.auth = {
        username: carrierEndpoint.authDetails.username,
        password: carrierEndpoint.authDetails.password,
      };
    }
    // OAuth would require token acquisition flow

    const response = await axios.post(
      carrierEndpoint.url,
      shipmentDetails,
      config,
    );

    return response.data.proNumber || "";
  } catch (error) {
    console.error("Error fetching PRO number:", error);
    return "";
  }
}

// Validate a PRO number format
export function validateProNumber(
  proNumber: string,
  carrierFormat?: string,
): boolean {
  if (!proNumber) return false;

  // Default validation - alphanumeric, minimum 6 characters
  if (!carrierFormat) {
    return /^[a-zA-Z0-9]{6,}$/.test(proNumber);
  }

  // Custom validation based on carrier format
  // Format could be a regex string stored in the database
  try {
    const regex = new RegExp(carrierFormat);
    return regex.test(proNumber);
  } catch (e) {
    console.error("Invalid regex format:", e);
    return false;
  }
}

// Store PRO number in the database
export async function storeProNumber(
  shipmentId: string,
  carrierId: string,
  proNumber: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("shipments")
    .update({ pro_number: proNumber, carrier_id: carrierId })
    .eq("id", shipmentId);

  if (error) {
    console.error("Error storing PRO number:", error);
    return false;
  }

  return true;
}

// ==================== BILLING CODES API FUNCTIONS ====================

// Get all billing codes
export async function getBillingCodes(): Promise<BillingCode[]> {
  try {
    const { data, error } = await supabase
      .from("billing_codes")
      .select("*")
      .order("code", { ascending: true });

    if (error) {
      console.error("Error fetching billing codes:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getBillingCodes:", error);
    return [];
  }
}

// Create a new billing code
export async function createBillingCode(
  billingCode: Omit<BillingCode, "id" | "createdAt" | "updatedAt">,
): Promise<BillingCode | null> {
  try {
    const now = new Date().toISOString();
    const newCode = {
      ...billingCode,
      createdAt: now,
      updatedAt: now,
    };

    const { data, error } = await supabase
      .from("billing_codes")
      .insert([newCode])
      .select()
      .single();

    if (error) {
      console.error("Error creating billing code:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in createBillingCode:", error);
    return null;
  }
}

// Update a billing code
export async function updateBillingCode(
  id: string,
  billingCode: Partial<BillingCode>,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("billing_codes")
      .update({
        ...billingCode,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating billing code:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateBillingCode:", error);
    return false;
  }
}

// Delete a billing code
export async function deleteBillingCode(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("billing_codes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting billing code:", error);
      return false;
    }

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
    const { data: invoicesData, error: invoicesError } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (invoicesError) {
      console.error("Error fetching invoices:", invoicesError);
      return [];
    }

    // For each invoice, fetch its items
    const invoicesWithItems = await Promise.all(
      (invoicesData || []).map(async (invoice) => {
        const { data: itemsData, error: itemsError } = await supabase
          .from("invoice_items")
          .select("*")
          .eq("invoice_id", invoice.id);

        if (itemsError) {
          console.error("Error fetching invoice items:", itemsError);
          return {
            ...mapInvoiceFromDb(invoice),
            items: [],
          };
        }

        return {
          ...mapInvoiceFromDb(invoice),
          items: (itemsData || []).map(mapInvoiceItemFromDb),
        };
      }),
    );

    return invoicesWithItems;
  } catch (error) {
    console.error("Error in getInvoices:", error);
    return [];
  }
}

// Get a single invoice by ID
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single();

    if (invoiceError) {
      console.error("Error fetching invoice:", invoiceError);
      return null;
    }

    const { data: items, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id);

    if (itemsError) {
      console.error("Error fetching invoice items:", itemsError);
      return mapInvoiceFromDb(invoice);
    }

    return {
      ...mapInvoiceFromDb(invoice),
      items: (items || []).map(mapInvoiceItemFromDb),
    };
  } catch (error) {
    console.error("Error in getInvoiceById:", error);
    return null;
  }
}

// Create a new invoice
export async function createInvoice(
  invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">,
): Promise<Invoice | null> {
  try {
    // Start a transaction
    const { data, error } = await supabase.rpc("create_invoice", {
      invoice_data: mapInvoiceToDb(invoice),
      items_data: invoice.items.map(mapInvoiceItemToDb),
    });

    if (error) {
      console.error("Error creating invoice:", error);
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
  invoice: Partial<Invoice>,
): Promise<boolean> {
  try {
    // Update invoice details
    const { error: invoiceError } = await supabase
      .from("invoices")
      .update({
        ...mapInvoiceToDb(invoice),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (invoiceError) {
      console.error("Error updating invoice:", invoiceError);
      return false;
    }

    // If items are included, update them
    if (invoice.items && invoice.items.length > 0) {
      // First delete existing items
      const { error: deleteError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", id);

      if (deleteError) {
        console.error("Error deleting invoice items:", deleteError);
        return false;
      }

      // Then insert new items
      const { error: insertError } = await supabase
        .from("invoice_items")
        .insert(
          invoice.items.map((item) => ({
            ...mapInvoiceItemToDb(item),
            invoice_id: id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
        );

      if (insertError) {
        console.error("Error inserting invoice items:", insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error in updateInvoice:", error);
    return false;
  }
}

// Delete an invoice
export async function deleteInvoice(id: string): Promise<boolean> {
  try {
    // Delete the invoice (cascade will delete items)
    const { error } = await supabase.from("invoices").delete().eq("id", id);

    if (error) {
      console.error("Error deleting invoice:", error);
      return false;
    }

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
    const { data: memosData, error: memosError } = await supabase
      .from("credit_memos")
      .select("*")
      .order("created_at", { ascending: false });

    if (memosError) {
      console.error("Error fetching credit memos:", memosError);
      return [];
    }

    // For each memo, fetch its items
    const memosWithItems = await Promise.all(
      (memosData || []).map(async (memo) => {
        const { data: itemsData, error: itemsError } = await supabase
          .from("credit_memo_items")
          .select("*")
          .eq("credit_memo_id", memo.id);

        if (itemsError) {
          console.error("Error fetching credit memo items:", itemsError);
          return {
            ...mapCreditMemoFromDb(memo),
            items: [],
          };
        }

        return {
          ...mapCreditMemoFromDb(memo),
          items: (itemsData || []).map(mapInvoiceItemFromDb),
        };
      }),
    );

    return memosWithItems;
  } catch (error) {
    console.error("Error in getCreditMemos:", error);
    return [];
  }
}

// Get a single credit memo by ID
export async function getCreditMemoById(
  id: string,
): Promise<CreditMemo | null> {
  try {
    const { data: memo, error: memoError } = await supabase
      .from("credit_memos")
      .select("*")
      .eq("id", id)
      .single();

    if (memoError) {
      console.error("Error fetching credit memo:", memoError);
      return null;
    }

    const { data: items, error: itemsError } = await supabase
      .from("credit_memo_items")
      .select("*")
      .eq("credit_memo_id", id);

    if (itemsError) {
      console.error("Error fetching credit memo items:", itemsError);
      return mapCreditMemoFromDb(memo);
    }

    return {
      ...mapCreditMemoFromDb(memo),
      items: (items || []).map(mapInvoiceItemFromDb),
    };
  } catch (error) {
    console.error("Error in getCreditMemoById:", error);
    return null;
  }
}

// Create a new credit memo
export async function createCreditMemo(
  creditMemo: Omit<CreditMemo, "id" | "createdAt" | "updatedAt">,
): Promise<CreditMemo | null> {
  try {
    // Start a transaction
    const { data, error } = await supabase.rpc("create_credit_memo", {
      memo_data: mapCreditMemoToDb(creditMemo),
      items_data: creditMemo.items.map((item) => ({
        ...mapInvoiceItemToDb(item),
        credit_memo_id: null, // Will be set in the function
      })),
    });

    if (error) {
      console.error("Error creating credit memo:", error);
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
  creditMemo: Partial<CreditMemo>,
): Promise<boolean> {
  try {
    // Update credit memo details
    const { error: memoError } = await supabase
      .from("credit_memos")
      .update({
        ...mapCreditMemoToDb(creditMemo),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (memoError) {
      console.error("Error updating credit memo:", memoError);
      return false;
    }

    // If items are included, update them
    if (creditMemo.items && creditMemo.items.length > 0) {
      // First delete existing items
      const { error: deleteError } = await supabase
        .from("credit_memo_items")
        .delete()
        .eq("credit_memo_id", id);

      if (deleteError) {
        console.error("Error deleting credit memo items:", deleteError);
        return false;
      }

      // Then insert new items
      const { error: insertError } = await supabase
        .from("credit_memo_items")
        .insert(
          creditMemo.items.map((item) => ({
            ...mapInvoiceItemToDb(item),
            credit_memo_id: id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
        );

      if (insertError) {
        console.error("Error inserting credit memo items:", insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error in updateCreditMemo:", error);
    return false;
  }
}

// Delete a credit memo
export async function deleteCreditMemo(id: string): Promise<boolean> {
  try {
    // Delete the credit memo (cascade will delete items)
    const { error } = await supabase.from("credit_memos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting credit memo:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteCreditMemo:", error);
    return false;
  }
}

// ==================== STG API FUNCTIONS ====================

// Fetch container data from Xano API
export async function fetchSTGContainers(): Promise<STGContainer[]> {
  try {
    // Get the bearer token from session storage
    const token = sessionStorage.getItem("authToken") || "";

    // Make a real API call to Xano
    const response = await axios.get(`${API_BASE_URL}/container`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response contains data
    if (!response.data || !Array.isArray(response.data)) {
      console.error("Invalid response format from Xano API:", response.data);
      return [];
    }

    console.log("Xano API Response:", response.data.slice(0, 2)); // Log first 2 items for debugging

    // Map the API response to our STGContainer interface
    const containers: STGContainer[] = response.data.map((item: any) => ({
      id:
        item.id ||
        `stg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      containerNumber: item.containerNumber || "",
      jobNumber: item.jobNumber || "",
      location: item.location || "",
      masterBillNumber: item.masterBillNumber || "",
      vesselName: item.vesselName || "",
      customerReference: item.customerReference || "",
      status: item.status || "Unknown",
      stgReferenceNumber: item.stgReferenceNumber,
      vesselETA: item.vesselETA || "",
      availableAtPier: item.availableAtPier || "",
      appointmentDate: item.appointmentDate || "",
      outgatedDate: item.outgatedDate || "",
      dateIn: item.dateIn || "",
      stripDate: item.stripDate || "",
      availableAtSTG: item.availableAtSTG || "",
      returnEmptyDate: item.returnEmptyDate || "",
      goDate: item.goDate || "",
      cfsLotDetails: item.cfsLotDetails || null,
      containerAttachments: item.containerAttachments || [],
      type: item.type || "Unknown",
      carrier: item.carrier || "Unknown",
      pol: item.pol || "Unknown",
      pod: item.pod || "Unknown",
    }));

    console.log(`Total containers fetched: ${containers.length}`);

    // Return all containers
    return containers;
  } catch (error) {
    console.error("Error fetching container data from Xano API:", error);
    return [];
  }
}

// Fetch CFS Cargo Details by job lot number
export interface CFSCargoDetails {
  cfsStation: string;
  jobNumber: string;
  lotNumber: string;
  container: string;
  masterBillNumber: string;
  amsBillNumber: string;
  houseBillNumber: string;
  customerReference: string;
  trackingNumber: string;
  purchaseOrderNumber: string;
  piecesManifested: string;
  piecesReceived: string;
  palletsReceived: string;
  weightInLBS: string;
  volumeInCBM: string;
  hazmat: string;
  headload: string;
  cargoDescription: string;
  insurance: string;
  totalInsuredValue: string;
  intlTotalInsuredValue: string | null;
  originalCustomer: string;
  cfsType: string;
  stripDate: string;
  freeTimeExpiresDate: string;
  availableAtCFSDate: string;
  originUNLocationCode: string;
  originCity: string;
  originState: string | null;
  originCountry: string | null;
  originISOCountryCode: string;
  cmsLocApiID: string;
  vesselETA: string;
  pickUpRequirements: {
    status: string;
    pickUpNumber: string;
    shippingStatus: string;
    customsReleaseFlag: string;
    customsRelease: string;
    freightRelease: string;
    freighReleaseDate: string;
    deliveryOrder: string;
    deliveryZipcode: string;
    cargoOnHold: string;
    marksHold: string;
    exchangePallet: string;
  };
  shippingInformation: {
    ata: string;
    eta: string;
    pickUpAgent: string;
    pickUpAgentCode: string;
    proNumber: string;
    shipDate: string;
    destination: string;
    itNumber: string;
    loadNumber: string;
    trailerNumber: string;
    releaseNumber: string;
    destinationCFSName: string | null;
    destinationCFSAddress: string | null;
    destinationCFSAddressLine2: string | null;
    destinationCFSCity: string | null;
    destinationCFSState: string | null;
    destinationCFSTelephone: string | null;
    destinationCFSFax: string | null;
    destinationCFSFirmsCode: string | null;
    destinationCFSEmail: string | null;
    destinationTracking: string | null;
  };
  warehouseInformation: {
    cfsCode: string;
    cfsName: string;
    cfsAddress: string;
    cfsCity: string;
    cfsState: string;
    cfsZipcode: string;
    cfsPhone: string;
    cfsEmail: string;
  };
  ipiTrackingInformation: any | null;
  localTrackingInformation: any | null;
  attachments: string[];
  milestones: Array<{
    code: string;
    description: string;
    statusDateTime: string;
    city: string;
    state: string;
  }>;
  doorDeliveryMilestones: {
    apptDate: string;
    dispatchedDate: string;
    deliveredDate: string;
    pickuUpDate: string;
    sentDate204: string;
    receivedDate990: string;
  };
}

export async function fetchCFSCargoDetails(
  jobLotNumber: string,
): Promise<CFSCargoDetails | null> {
  try {
    // Get the bearer token from session storage
    const token = sessionStorage.getItem("authToken") || "";

    // Make API call to Xano
    const response = await axios.get(`${API_BASE_URL}/jobLot/${jobLotNumber}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response contains data
    if (!response.data) {
      console.error("Invalid response format from Xano API:", response.data);
      return null;
    }

    return response.data as CFSCargoDetails;
  } catch (error) {
    console.error(
      `Error fetching CFS cargo details for job lot ${jobLotNumber}:`,
      error,
    );
    return null;
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

// ==================== ZIP CODE LOOKUP API FUNCTIONS ====================

/**
 * Lookup ZIP code information from Xano API
 * @param zipCode - The ZIP code to lookup
 * @param countryCode - The country code (default: "1" for USA)
 * @returns Promise with city, state, latitude, and longitude information
 */
export async function lookupZipCode(
  zipCode: string,
  countryCode: string = "1",
): Promise<ZipCodeLookupResponse | null> {
  try {
    // Get the bearer token from session storage
    const token = sessionStorage.getItem("authToken") || "";

    // Make API call to Xano
    const response = await axios.post(
      `${ZIPCODE_API_BASE_URL}/lookup/zipcode`,
      {
        zip_code: zipCode,
        country_code: countryCode,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Check if the response contains data and was successful
    if (!response.data || response.data.success !== true) {
      console.error(
        "Invalid response from ZIP code lookup API:",
        response.data,
      );
      return null;
    }

    return response.data as ZipCodeLookupResponse;
  } catch (error) {
    console.error("Error looking up ZIP code:", error);
    return null;
  }
}

// ==================== LTL QUOTE API FUNCTIONS ====================

/**
 * Get LTL shipping rate quotes from Xano API
 * @param payload - The request payload containing all quote parameters
 * @returns Promise with carrier quotes and rate information
 */
export async function getLTLQuotes(
  payload: LTLQuoteRequest,
): Promise<LTLQuoteResponse | null> {
  try {
    // Get the bearer token from session storage
    const token = sessionStorage.getItem("authToken") || "";

    // Make API call to Xano
    const response = await axios.post(
      `${API_BASE_URL}/shipping/ltl/quotes`,
      payload,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Check if the response contains data and was successful
    if (!response.data) {
      console.error("Invalid response from LTL quote API:", response.data);
      return null;
    }

    return response.data as LTLQuoteResponse;
  } catch (error) {
    console.error("Error getting LTL quotes:", error);
    throw error;
  }
}
