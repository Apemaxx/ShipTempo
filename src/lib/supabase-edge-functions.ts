// Supabase edge functions have been removed

// This file is kept as a placeholder to prevent import errors
// Replace with direct API calls or another serverless solution

/**
 * Placeholder for ZIP code lookup functionality
 */
export async function lookupZipCodeEdge(
  zipCode: string,
  countryCode: string = "1",
) {
  console.log("Supabase edge function removed: lookupZipCodeEdge");
  return { success: false, message: "Function removed" };
}

/**
 * Placeholder for LTL quotes functionality
 */
export async function getLTLQuotesEdge(payload: any) {
  console.log("Supabase edge function removed: getLTLQuotesEdge");
  return { success: false, message: "Function removed" };
}

/**
 * Placeholder for create shipment functionality
 */
export async function createShipmentFromQuoteEdge(
  quoteId: string,
  carrierId: string,
) {
  console.log("Supabase edge function removed: createShipmentFromQuoteEdge");
  return { success: false, message: "Function removed" };
}
