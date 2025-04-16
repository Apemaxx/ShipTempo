import { xanoApiClient } from "./index";
import { ZIPCODE_API_BASE_URL } from "@/config";
import { ZipCodeLookupResponse } from "@/types/api";

/**
 * Lookup ZIP code information from Xano API
 * @param zipCode - The ZIP code to lookup
 * @param countryCode - The country code (default: "1" for USA)
 * @returns Promise with city, state, latitude, and longitude information
 */
export async function lookupZipCode(
  zipCode: string,
  countryCode: string = "1"
): Promise<ZipCodeLookupResponse | null> {
  try {
    const response = await xanoApiClient.post(
      "/lookup/zipcode",
      {
        zip_code: zipCode,
        country_code: countryCode,
      },
      ZIPCODE_API_BASE_URL
    );

    // Check if the response contains data and was successful
    if (!response || response.success !== true) {
      console.error("Invalid response from ZIP code lookup API:", response);
      return null;
    }

    return response as ZipCodeLookupResponse;
  } catch (error) {
    console.error("Error looking up ZIP code:", error);
    return null;
  }
}
