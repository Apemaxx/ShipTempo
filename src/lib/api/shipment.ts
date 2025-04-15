import axios from "axios";
import { API_BASE_URL } from "@/config";
import { LTLQuoteRequest, LTLQuoteResponse } from "@/types/api";

/**
 * Create a new shipment from a quote
 * @param quoteId - The ID of the selected quote
 * @param carrierId - The ID of the selected carrier
 * @returns Promise with the created shipment details
 */
export async function createShipmentFromQuote(
  quoteId: string,
  carrierId: string,
) {
  try {
    // Get the bearer token from session storage
    const token = sessionStorage.getItem("authToken") || "";

    // Make API call to Xano
    const response = await axios.post(
      `${API_BASE_URL}/shipping/create_shipment`,
      {
        quote_id: quoteId,
        carrier_id: carrierId,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error creating shipment:", error);
    throw error;
  }
}
