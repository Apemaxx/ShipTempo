// Supabase Edge Function for ZIP code lookup

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Xano API constants
const XANO_API_BASE_URL = "https://xceb-j0mf-bxn3.n7d.xano.io/api:FghXk8hb";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const { zip } = await req.json();

    if (!zip) {
      return new Response(
        JSON.stringify({ success: false, message: "ZIP code is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Call the Xano API directly
    const response = await fetch(
      `${XANO_API_BASE_URL}/zipcode/lookup?zip=${zip}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("ZIP code lookup error:", error);
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
