import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message: string;
  page_url?: string;
  is_test?: boolean;
  [key: string]: unknown;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { payload, webhookUrl, httpMethod } = await req.json() as {
      payload: WebhookPayload;
      webhookUrl: string;
      httpMethod: string;
    };

    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "No webhook URL provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fullPayload = {
      ...payload,
      timestamp: new Date().toISOString(),
    };

    let response: Response;
    let responseStatus: number | null = null;
    let responseBody: string | null = null;
    let success = false;
    let errorMessage: string | null = null;

    try {
      // Always send as POST with JSON body for reliable delivery
      const method = httpMethod === "GET" ? "GET" : httpMethod;
      
      console.log("Sending webhook request:", {
        url: webhookUrl,
        method: method,
        payload: fullPayload
      });

      if (method === "GET") {
        // For GET requests, encode data as URL parameters
        const params = new URLSearchParams();
        Object.entries(fullPayload).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.append(key, String(value));
          }
        });

        response = await fetch(`${webhookUrl}?${params.toString()}`, {
          method: "GET",
          headers: { 
            "Accept": "application/json",
            "User-Agent": "CanvasCartel-Webhook/1.0"
          },
        });
      } else {
        // For POST/PUT requests, send data as JSON body
        response = await fetch(webhookUrl, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "CanvasCartel-Webhook/1.0"
          },
          body: JSON.stringify(fullPayload),
        });
      }
      
      console.log("Webhook response status:", response.status);

      responseStatus = response.status;

      try {
        responseBody = await response.text();
      } catch {
        responseBody = null;
      }

      success = response.ok;

      if (!success) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Webhook error:", errorMessage);
    }

    // Log the webhook call to database
    try {
      await supabase.from("webhook_logs").insert({
        webhook_url: webhookUrl,
        http_method: httpMethod,
        payload: fullPayload,
        response_status: responseStatus,
        response_body: responseBody?.slice(0, 1000),
        success,
        error_message: errorMessage,
        page_url: fullPayload.page_url || null,
      });
    } catch (logError) {
      console.error("Failed to log webhook call:", logError);
    }

    return new Response(
      JSON.stringify({ success, error: errorMessage }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
