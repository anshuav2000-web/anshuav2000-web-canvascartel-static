import { useSiteContent, WebhookSettingsContent, defaultWebhookSettingsContent } from './useSiteContent';
import { supabase } from '@/integrations/supabase/client';

interface WebhookPayload {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message: string;
  [key: string]: unknown;
}

interface WebhookResult {
  success: boolean;
  error?: string;
}

export const useWebhook = () => {
  const { data } = useSiteContent<WebhookSettingsContent>('webhook_settings');
  const settings = data || defaultWebhookSettingsContent;

  // Get webhook URL from environment variable (VITE_N8N_WEBHOOK_URL)
  // Fall back to Supabase function if not set
  const getWebhookUrl = (): string | null => {
    const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    if (envUrl) {
      return envUrl;
    }
    return settings.webhookUrl || null;
  };

  const sendToWebhook = async (
    payload: WebhookPayload,
    pageUrl?: string
  ): Promise<WebhookResult> => {
    const webhookUrl = getWebhookUrl();

    // If no webhook URL is configured, skip silently
    if (!webhookUrl) {
      console.log('Webhook: No URL configured, skipping');
      return { success: true };
    }

    try {
      // Option 1: Direct fetch to webhook URL (preferred for n8n)
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          page_url: pageUrl || window.location.href,
          source: "website_form",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.warn("Webhook returned non-OK status:", response.status);
        return { success: true }; // Consider it successful from our side
      }

      return { success: true };
    } catch (error) {
      console.error("Webhook error:", error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  };

  return { sendToWebhook, webhookConfigured: !!getWebhookUrl() };
};
