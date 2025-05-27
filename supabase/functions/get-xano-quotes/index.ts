import { corsHeaders } from "../_shared/cors.ts";

const XANO_API_BASE_URL = "https://xceb-j0mf-bxn3.n7d.xano.io/api:FghXk8hb";
const XANO_API_TOKEN = "1a53e00c-4ce6-10ae-c3f3-1acc5d2345fd"; // Authentication key for LTL quotes

// Direct XANO API request format for LTL quotes
interface XanoLTLQuoteRequest {
  data: {
    AuthenticationKey: string;
    OriginZipCode: string;
    OriginCountry: string;
    DestinationZipCode: string;
    DestinationCountry: string;
    Commodities: Array<{
      HandlingQuantity: string;
      PackagingType: number;
      Length: string;
      Width: string;
      Height: string;
      WeightTotal: string;
      HazardousMaterial: boolean;
      PiecesTotal: string;
      FreightClass: string;
      NMFC?: string;
      Description: string;
      AdditionalMarkings?: string;
      UNNumber?: string;
      PackingGroup?: number;
    }>;
    WeightUnits: string;
    DimensionUnits: string;
    AccessorialCodes: string[] | null;
    LegacySupport: boolean;
    CustomerReferenceNumber: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    console.log("Received request data:", requestData);

    // Validate that the request follows the expected format
    if (!requestData.data || !requestData.data.AuthenticationKey) {
      throw new Error("Invalid request format: Missing required fields");
    }

    // Call Xano API to get rate quotes with increased timeout (60 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

    try {
      console.log(
        "Sending request to XANO API with payload:",
        JSON.stringify(requestData),
      );

      // Set up fetch with a longer timeout (60 seconds)
      const response = await fetch(
        `${XANO_API_BASE_URL}/shipping/getRateQuotes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestData),
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Xano API error:", errorText);
        clearTimeout(timeoutId);
        return new Response(
          JSON.stringify({
            success: false,
            error: `Xano API error: ${response.status} ${errorText}`,
            quotes: [],
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      }

      const data = await response.json();
      console.log("Xano API response:", data);

      // Clear the timeout since we got a response
      clearTimeout(timeoutId);

      // Format the response to match the expected structure
      const formattedResponse = {
        success: true,
        quotes: data.quotes || [],
        request_id: data.request_id || `req-${Date.now()}`,
      };

      return new Response(JSON.stringify(formattedResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (fetchError) {
      // Handle timeout or other fetch errors
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Fetch error: ${fetchError.message || "Request timed out or failed"}`,
          quotes: [],
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
        quotes: [],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Return 200 with error in body for better client handling
      },
    );
  }
});
