// Supabase Edge Function for creating a shipment from a quote
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callXanoApi } from "../shared/xano-api-client.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { quote_id, carrier_id } = await req.json();

    if (!quote_id || !carrier_id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Quote ID and carrier ID are required",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Call Xano API to create shipment
    const data = await callXanoApi("/shipping/create_shipment", "POST", {
      quote_id,
      carrier_id,
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating shipment:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to create shipment",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
