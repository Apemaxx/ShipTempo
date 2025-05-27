// Supabase Edge Function for getting LTL quotes
import { callZipcodeApi } from "@shared/xano-api-client.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  // Support both POST and PUT methods
  if (req.method !== "POST" && req.method !== "PUT") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST or PUT." }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      },
    );
  }

  try {
    const payload = await req.json();

    // Validate the request payload
    if (!payload.data || !payload.data.AuthenticationKey) {
      throw new Error("Invalid request payload");
    }

    console.log("Processing LTL quote request:", JSON.stringify(payload));

    // Call the Xano API using the shared client
    try {
      const data = await callZipcodeApi(
        "/shipping/getRateQuotes",
        "POST",
        payload,
      );

      console.log("LTL quote response received:", JSON.stringify(data));

      // Format the response to match expected structure
      const formattedResponse = {
        success: true,
        quotes: data.quotes || [],
        request_id: data.request_id || `req-${Date.now()}`,
      };

      return new Response(JSON.stringify(formattedResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (apiError) {
      console.error("API error:", apiError);
      throw new Error(`API error: ${apiError.message}`);
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
