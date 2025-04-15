// Supabase Edge Function for ZIP code lookup
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callZipcodeApi } from "../shared/xano-api-client.ts";

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
    const { zip_code, country_code } = await req.json();

    if (!zip_code) {
      return new Response(
        JSON.stringify({ success: false, message: "ZIP code is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Call Xano API to lookup ZIP code
    const data = await callZipcodeApi("/lookup/zipcode", "POST", {
      zip_code,
      country_code: country_code || "1",
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ZIP code lookup:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to lookup ZIP code",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
