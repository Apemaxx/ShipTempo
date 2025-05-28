import {
  LTLQuoteRequest,
  LTLQuoteCarrierRate,
  LTLQuoteResponse,
} from "@/types/api";

// Supabase client initialization removed

/**
 * Get LTL shipping rate quotes from Supabase Edge Function
 * @param payload - The request payload containing all quote parameters
 * @param limit - Maximum number of quotes to return (default: 5)
 * @returns Promise with carrier quotes and rate information
 */
export async function getLTLQuotes(
  payload: LTLQuoteRequest,
  limit: number = 5,
): Promise<LTLQuoteCarrierRate[]> {
  try {
    console.log("Fetching LTL quotes with payload:", payload);

    // Supabase Edge Function call removed
    console.log("Direct API call would be implemented here");

    // Placeholder response
    const data = { quotes: [] };

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
    console.error("Error getting LTL quotes:", error);
    throw error;
  }
}

/**
 * Save quote to database for future reference
 * @param quoteData - The quote data to save
 * @param userId - The user ID associated with the quote
 * @returns Promise with the saved quote ID
 */
export async function saveQuote(
  quoteData: LTLQuoteResponse,
  userId: string,
): Promise<string> {
  try {
    // Supabase database operation removed
    console.log("Quote saving functionality removed");

    // Return a placeholder ID
    return "quote-" + Date.now();
  } catch (error) {
    console.error("Error saving quote:", error);
    throw error;
  }
}

/**
 * Get saved quotes for a user
 * @param userId - The user ID to get quotes for
 * @param limit - Maximum number of quotes to return
 * @returns Promise with the user's saved quotes
 */
export async function getUserQuotes(
  userId: string,
  limit: number = 10,
): Promise<any[]> {
  try {
    // Supabase database query removed
    console.log("Quote fetching functionality removed");

    // Return an empty array as placeholder
    return [];
  } catch (error) {
    console.error("Error fetching user quotes:", error);
    throw error;
  }
}
