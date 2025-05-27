import { createClient } from "@supabase/supabase-js";
import {
  XanoRateQuoteRequest,
  XanoRateQuoteResponse,
  XanoRateQuoteCarrier,
  LTLQuoteCarrierRate,
} from "@/types/api";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get shipping rate quotes from Xano API via Supabase Edge Function
 * @param payload - The request payload containing all quote parameters
 * @param limit - Maximum number of quotes to return (default: 5)
 * @returns Promise with carrier quotes and rate information
 */
export async function getShippingRateQuotes(
  payload: XanoRateQuoteRequest,
  limit: number = 5,
): Promise<XanoRateQuoteCarrier[]> {
  try {
    console.log("Fetching Xano rate quotes with payload:", payload);

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-get-xano-quotes",
      {
        body: JSON.stringify(payload),
      },
    );

    if (error) {
      console.error("Error invoking edge function:", error);
      throw new Error(`API error: ${error.message || "Failed to get quotes"}`);
    }

    if (!data || !data.quotes || !Array.isArray(data.quotes)) {
      console.error("Invalid response format:", data);
      return [];
    }

    // Sort quotes by total cost (ascending)
    const sortedQuotes = [...data.quotes].sort(
      (a, b) => a.total_cost - b.total_cost,
    );

    // Return limited number of quotes
    return sortedQuotes.slice(0, limit);
  } catch (error) {
    console.error("Error getting Xano rate quotes:", error);
    throw error;
  }
}

/**
 * Get shipping rate quotes from the new Xano API endpoint
 * @param originZip - Origin ZIP code
 * @param originCountry - Origin country code
 * @param destinationZip - Destination ZIP code
 * @param destinationCountry - Destination country code
 * @param commodities - Array of commodity details
 * @param accessorials - Optional array of accessorial codes
 * @param limit - Maximum number of quotes to return (default: 5)
 * @returns Promise with carrier quotes and rate information
 */
export async function getXanoRateQuotes(
  originZip: string,
  originCountry: string,
  destinationZip: string,
  destinationCountry: string,
  commodities: Array<{
    handlingQuantity: number;
    packagingType: number;
    length: number;
    width: number;
    height: number;
    weightTotal: number;
    hazardousMaterial: boolean;
    piecesTotal: number;
    freightClass: string;
    description: string;
  }>,
  accessorials: string[] | null = null,
  limit: number = 5,
): Promise<LTLQuoteCarrierRate[]> {
  try {
    const payload = {
      data: {
        AuthenticationKey: "1a53e00c-4ce6-10ae-c3f3-1acc5d2345fd",
        OriginZipCode: originZip,
        OriginCountry: originCountry,
        DestinationZipCode: destinationZip,
        DestinationCountry: destinationCountry,
        Commodities: commodities.map((c) => ({
          HandlingQuantity: String(c.handlingQuantity),
          PackagingType: c.packagingType,
          Length: String(c.length),
          Width: String(c.width),
          Height: String(c.height),
          WeightTotal: String(c.weightTotal),
          HazardousMaterial: c.hazardousMaterial,
          PiecesTotal: String(c.piecesTotal),
          FreightClass: c.freightClass,
          Description: c.description,
          AdditionalMarkings: "",
          UNNumber: "",
          PackingGroup: 0,
        })),
        WeightUnits: "lb",
        DimensionUnits: "in",
        AccessorialCodes: accessorials,
        LegacySupport: false,
        CustomerReferenceNumber: "XANO-" + new Date().getTime(),
      },
    };

    console.log("Fetching Xano rate quotes with payload:", payload);

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-get-xano-quotes",
      {
        body: JSON.stringify(payload),
      },
    );

    if (error) {
      console.error("Error invoking edge function:", error);
      throw new Error(`API error: ${error.message || "Failed to get quotes"}`);
    }

    if (!data || !data.quotes || !Array.isArray(data.quotes)) {
      console.error("Invalid response format:", data);
      return [];
    }

    // Map the Xano response to the LTLQuoteCarrierRate format
    const mappedQuotes: LTLQuoteCarrierRate[] = data.quotes.map(
      (quote: any) => ({
        carrier_id: quote.carrier_id || String(quote.id) || "",
        carrier_name: quote.carrier_name || "",
        carrier_scac: quote.carrier_scac || "",
        service_level: quote.service_level || "Standard",
        transit_days: quote.transit_days || 0,
        total_cost: quote.total_cost || 0,
        currency: quote.currency || "USD",
        expiration_date:
          quote.expiration_date ||
          new Date(Date.now() + 86400000).toISOString(),
        quote_id: quote.quote_id || String(quote.id) || "",
        price_breakdown: {
          linehaul: quote.price_breakdown?.base_rate || 0,
          fuel_surcharge: quote.price_breakdown?.fuel_surcharge || 0,
          accessorials: quote.price_breakdown?.accessorials || 0,
        },
      }),
    );

    // Sort quotes by total cost (ascending)
    const sortedQuotes = [...mappedQuotes].sort(
      (a, b) => a.total_cost - b.total_cost,
    );

    // Return limited number of quotes
    return sortedQuotes.slice(0, limit);
  } catch (error) {
    console.error("Error getting Xano rate quotes:", error);
    throw error;
  }
}
