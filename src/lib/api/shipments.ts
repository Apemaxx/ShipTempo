import { xanoApiClient } from "./index";
import { AUTH_CODE } from "@/config";
import axios from "axios";

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

// Cache para carrier endpoints
let carrierEndpointsCache: CarrierEndpoint[] | null = null;

// Get all carrier endpoints from Xano
export async function getCarrierEndpoints(): Promise<CarrierEndpoint[]> {
  if (carrierEndpointsCache) return carrierEndpointsCache;

  try {
    const data = await xanoApiClient.get("/carrier_endpoints", AUTH_CODE);
    carrierEndpointsCache = data as CarrierEndpoint[];
    return carrierEndpointsCache;
  } catch (error) {
    console.error("Error fetching carrier endpoints:", error);
    return [];
  }
}

// Search shipments by any reference
export async function searchShipments(
  query: string
): Promise<ShipmentSearchResult[]> {
  if (!query || query.length < 3) return [];

  try {
    const data = await xanoApiClient.post(
      "/shipments/search",
      {
        query,
        limit: 10,
      },
      AUTH_CODE
    );

    // Transformar los datos para que coincidan con el formato esperado
    return (data || []).map((item: any) => ({
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
  shipmentDetails: any
): Promise<string> {
  try {
    const endpoints = await getCarrierEndpoints();
    const carrierEndpoint = endpoints.find(
      (endpoint) => endpoint.name === carrierId
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
      config
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
  carrierFormat?: string
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
  proNumber: string
): Promise<boolean> {
  try {
    await xanoApiClient.put(
      `/shipments/${shipmentId}`,
      {
        pro_number: proNumber,
        carrier_id: carrierId,
      },
      AUTH_CODE
    );
    return true;
  } catch (error) {
    console.error("Error storing PRO number:", error);
    return false;
  }
}

// ==================== LTL QUOTE API FUNCTIONS ====================
import { LTLQuoteRequest, LTLQuoteResponse } from "@/types/api";

/**
 * Get LTL shipping rate quotes from Xano API
 * @param payload - The request payload containing all quote parameters
 * @returns Promise with carrier quotes and rate information
 */
export async function getLTLQuotes(
  payload: LTLQuoteRequest
): Promise<LTLQuoteResponse | null> {
  try {
    const data = await xanoApiClient.post(
      "/shipping/ltl/quotes",
      payload,
      AUTH_CODE
    );
    return data as LTLQuoteResponse;
  } catch (error) {
    console.error("Error getting LTL quotes:", error);
    throw error;
  }
}
