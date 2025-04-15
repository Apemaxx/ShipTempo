// Supabase Edge Function for getting LTL quotes
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
    const payload = await req.json();

    if (!payload || !payload.data) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid request payload" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Call Xano API to get LTL quotes
    const data = await callXanoApi("/shipping/ltl/quotes", "POST", payload);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting LTL quotes:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to get LTL quotes",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
