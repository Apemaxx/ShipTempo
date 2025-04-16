// Xano API client for Supabase Edge Functions

const XANO_API_BASE_URL = "https://xceb-j0mf-bxn3.n7d.xano.io/api:pRlqrAzC";
const XANO_ZIPCODE_API_BASE_URL =
  "https://xceb-j0mf-bxn3.n7d.xano.io/api:FghXk8hb";

/**
 * Base function to make requests to Xano API
 */
async function callXanoApi(
  endpoint: string,
  method: string,
  data?: any,
  apiKey?: string
) {
  const url = `${XANO_API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add API key if provided
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Xano API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Call Zipcode API
 */
async function callZipcodeApi(
  endpoint: string,
  method: string,
  data?: any,
  apiKey?: string
) {
  const url = `${XANO_ZIPCODE_API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add API key if provided
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Xano Zipcode API error (${response.status}): ${errorText}`
    );
  }

  return response.json();
}

export { callXanoApi, callZipcodeApi };
