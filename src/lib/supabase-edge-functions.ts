import { supabase } from "./api";

/**
 * Call the ZIP code lookup edge function
 */
export async function lookupZipCodeEdge(
  zipCode: string,
  countryCode: string = "1",
) {
  try {
    const { data, error } = await supabase.functions.invoke("lookup-zipcode", {
      body: { zip_code: zipCode, country_code: countryCode },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error calling ZIP code lookup edge function:", error);
    throw error;
  }
}

/**
 * Call the LTL quotes edge function
 */
export async function getLTLQuotesEdge(payload: any) {
  try {
    const { data, error } = await supabase.functions.invoke("get-ltl-quotes", {
      body: payload,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error calling LTL quotes edge function:", error);
    throw error;
  }
}

/**
 * Call the create shipment edge function
 */
export async function createShipmentFromQuoteEdge(
  quoteId: string,
  carrierId: string,
) {
  try {
    const { data, error } = await supabase.functions.invoke("create-shipment", {
      body: { quote_id: quoteId, carrier_id: carrierId },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error calling create shipment edge function:", error);
    throw error;
  }
}
