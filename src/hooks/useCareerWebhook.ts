import { useSiteContent, CareerSettingsContent, defaultCareerSettingsContent } from './useSiteContent';
import { supabase } from '@/integrations/supabase/client';

interface CareerWebhookPayload {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  cover_letter?: string | null;
  resume_url?: string | null;
  [key: string]: unknown;
}

interface WebhookResult {
  success: boolean;
  error?: string;
}

export const useCareerWebhook = () => {
  const { data } = useSiteContent<CareerSettingsContent>('career_settings');
  const settings = data || defaultCareerSettingsContent;

  const sendToWebhook = async (
    payload: CareerWebhookPayload,
    pageUrl?: string
  ): Promise<WebhookResult> => {
    // If no webhook URL is configured, skip silently
    if (!settings.webhookUrl) {
      console.log('Career Webhook: No URL configured, skipping');
      return { success: true };
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-webhook', {
        body: {
          payload: {
            ...payload,
            type: 'job_application',
            page_url: pageUrl || window.location.href,
          },
          webhookUrl: settings.webhookUrl,
          httpMethod: settings.httpMethod,
        },
      });

      if (error) {
        console.error('Career webhook edge function error:', error);
        return { success: false, error: error.message };
      }

      return { success: data?.success ?? false, error: data?.error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Career webhook error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return { 
    sendToWebhook, 
    webhookConfigured: !!settings.webhookUrl,
    settings 
  };
};
