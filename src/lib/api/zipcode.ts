import { ZipCodeLookupResponse } from "@/types/api";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Lookup ZIP code information using Supabase Edge Function
 * @param zipCode - The ZIP code to lookup
 * @returns Promise with city, state, latitude, and longitude information
 */
export async function lookupZipCode(
  zipCode: string,
): Promise<ZipCodeLookupResponse | null> {
  try {
    console.log(`Looking up ZIP code: ${zipCode}`);

    // Call the Supabase edge function
    const { data, error } = await supabase.functions.invoke("lookup-zipcode", {
      method: "POST",
      body: { zip: zipCode },
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(`API error: ${error.message}`);
    }

    console.log("ZIP code lookup response:", data);
    return data;
  } catch (error) {
    console.error("Error looking up ZIP code:", error);
    return null;
  }
}
