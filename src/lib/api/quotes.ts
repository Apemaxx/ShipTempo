import { createClient } from "@supabase/supabase-js";
import {
  LTLQuoteRequest,
  LTLQuoteCarrierRate,
  LTLQuoteResponse,
} from "@/types/api";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("get-ltl-quotes", {
      body: JSON.stringify(payload),
    });

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
    const { data, error } = await supabase
      .from("ltl_quotes")
      .insert({
        user_id: userId,
        origin_zip: quoteData.request_id, // This should be updated with actual origin zip
        destination_zip: quoteData.request_id, // This should be updated with actual destination zip
        response_payload: quoteData,
        status: "completed",
      })
      .select("id");

    if (error) {
      console.error("Error saving quote:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    return data?.[0]?.id || "";
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
    const { data, error } = await supabase
      .from("ltl_quotes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching user quotes:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching user quotes:", error);
    throw error;
  }
}
