import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Webhook, Mail, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteContent, CareerSettingsContent, defaultCareerSettingsContent } from '@/hooks/useSiteContent';

export default function CareerSettings() {
  const { data, updateContent, isLoading } = useSiteContent<CareerSettingsContent>('career_settings');
  const [content, setContent] = useState<CareerSettingsContent>(defaultCareerSettingsContent);
  const [isSaving, setIsSaving] = useState(false);
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  const validateUrl = (url: string): boolean => {
    if (!url) {
      setUrlError('');
      return true; // URL is optional
    }
    try {
      new URL(url);
      setUrlError('');
      return true;
    } catch {
      setUrlError('Please enter a valid URL');
      return false;
    }
  };

  const handleSave = async () => {
    if (content.webhookUrl && !validateUrl(content.webhookUrl)) {
      toast.error('Invalid webhook URL');
      return;
    }

    setIsSaving(true);
    try {
      await updateContent(content);
      toast.success('Career settings saved successfully');
    } catch (error) {
      toast.error('Failed to save career settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!content.webhookUrl) {
      toast.error('Please enter a webhook URL first');
      return;
    }

    if (!validateUrl(content.webhookUrl)) {
      toast.error('Please enter a valid webhook URL first');
      return;
    }

    toast.info('Sending test webhook...');
    
    const testPayload = {
      name: 'Test Applicant',
      email: 'test@example.com',
      phone: '+91 12345 67890',
      position: 'Test Position',
      experience: '2 years',
      linkedin_url: 'https://linkedin.com/in/test',
      portfolio_url: 'https://example.com',
      cover_letter: 'This is a test application from the career settings page.',
      type: 'job_application',
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      is_test: true,
    };

    try {
      let response: Response;
      
      if (content.httpMethod === 'GET') {
        const params = new URLSearchParams();
        Object.entries(testPayload).forEach(([key, value]) => {
          params.append(key, String(value));
        });
        response = await fetch(`${content.webhookUrl}?${params.toString()}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
      } else {
        response = await fetch(content.webhookUrl, {
          method: content.httpMethod,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testPayload),
        });
      }

      if (response.ok) {
        toast.success('Test webhook sent successfully!');
      } else {
        toast.error(`Webhook test failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Webhook test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient">Career Settings</h1>
            <p className="text-muted-foreground mt-1">Configure email notifications and webhook for job applications</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Configure email notifications for new job applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">HR/Admin Email *</label>
              <Input
                type="email"
                value={content.adminEmail}
                onChange={(e) => setContent({ ...content, adminEmail: e.target.value })}
                placeholder="hr@company.com"
              />
              <p className="text-xs text-muted-foreground">
                This email will receive notifications for all new job applications
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhook Configuration
            </CardTitle>
            <CardDescription>
              Configure webhook integration for job applications (optional). Works the same as contact form webhooks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Webhook URL</label>
                <Input
                  value={content.webhookUrl}
                  onChange={(e) => {
                    setContent({ ...content, webhookUrl: e.target.value });
                    validateUrl(e.target.value);
                  }}
                  placeholder="https://your-n8n-instance.com/webhook/..."
                  className={urlError ? 'border-destructive' : ''}
                />
                {urlError && <p className="text-xs text-destructive">{urlError}</p>}
                <p className="text-xs text-muted-foreground">
                  Enter your n8n or webhook URL. All job application data will be sent to this endpoint.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">HTTP Method</label>
                <Select
                  value={content.httpMethod}
                  onValueChange={(value: 'GET' | 'POST' | 'PUT') => setContent({ ...content, httpMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={handleTestWebhook} 
                  className="w-full"
                  disabled={!content.webhookUrl}
                >
                  <Webhook className="h-4 w-4 mr-2" />
                  Test Webhook
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-medium mb-2">Data Sent to Webhook</h4>
              <p className="text-sm text-muted-foreground mb-2">The following fields are sent with each application:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['name', 'email', 'phone', 'position', 'experience', 'linkedin_url', 'portfolio_url', 'cover_letter', 'resume_url', 'type', 'page_url', 'timestamp'].map((field) => (
                  <span key={field} className="px-2 py-1 rounded bg-secondary text-secondary-foreground">{field}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
