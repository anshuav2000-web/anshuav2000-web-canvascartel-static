import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Webhook, Trash2, RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteContent, WebhookSettingsContent, defaultWebhookSettingsContent } from '@/hooks/useSiteContent';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

interface WebhookLog {
  id: string;
  webhook_url: string;
  http_method: string;
  payload: Record<string, unknown>;
  response_status: number | null;
  response_body: string | null;
  success: boolean;
  error_message: string | null;
  page_url: string | null;
  created_at: string;
}

export default function WebhookSettings() {
  const { data, updateContent, isLoading } = useSiteContent<WebhookSettingsContent>('webhook_settings');
  const [content, setContent] = useState<WebhookSettingsContent>(defaultWebhookSettingsContent);
  const [isSaving, setIsSaving] = useState(false);
  const [urlError, setUrlError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  // Fetch webhook logs
  const { data: logs, isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['webhook-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as WebhookLog[];
    },
  });

  const validateUrl = (url: string): boolean => {
    if (!url) {
      setUrlError('Webhook URL is required');
      return false;
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
    if (!validateUrl(content.webhookUrl)) {
      toast.error('Invalid webhook URL');
      return;
    }

    setIsSaving(true);
    try {
      await updateContent(content);
      toast.success('Webhook settings saved successfully');
    } catch (error) {
      toast.error('Failed to save webhook settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    const { error } = await supabase
      .from('webhook_logs')
      .delete()
      .eq('id', logId);

    if (error) {
      toast.error('Failed to delete log');
    } else {
      toast.success('Log deleted');
      refetchLogs();
    }
  };

  const handleClearAllLogs = async () => {
    const { error } = await supabase
      .from('webhook_logs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      toast.error('Failed to clear logs');
    } else {
      toast.success('All logs cleared');
      refetchLogs();
    }
  };

  const handleTestWebhook = async () => {
    if (!validateUrl(content.webhookUrl)) {
      toast.error('Please enter a valid webhook URL first');
      return;
    }

    toast.info('Sending test webhook...');
    
    const testPayload = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+91 12345 67890',
      company: 'Test Company',
      service: 'Test Service',
      message: 'This is a test message from the webhook settings page.',
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
            <h1 className="text-3xl font-display font-bold text-gradient">Webhook Settings</h1>
            <p className="text-muted-foreground mt-1">Configure n8n webhook integration for contact forms</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhook Configuration
            </CardTitle>
            <CardDescription>
              Configure the n8n webhook URL and HTTP method. All contact form submissions will be sent to this webhook.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Webhook URL *</label>
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
                  Enter your n8n webhook URL. All form data will be sent to this endpoint.
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
                <p className="text-xs text-muted-foreground">
                  GET: Data sent as URL parameters. POST/PUT: Data sent as JSON body.
                </p>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={handleTestWebhook} className="w-full">
                  <Webhook className="h-4 w-4 mr-2" />
                  Test Webhook
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-medium mb-2">Data Sent to Webhook</h4>
              <p className="text-sm text-muted-foreground mb-2">The following fields are sent with each form submission:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <Badge variant="secondary">name</Badge>
                <Badge variant="secondary">email</Badge>
                <Badge variant="secondary">phone</Badge>
                <Badge variant="secondary">company</Badge>
                <Badge variant="secondary">service</Badge>
                <Badge variant="secondary">message</Badge>
                <Badge variant="secondary">page_url</Badge>
                <Badge variant="secondary">timestamp</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Webhook Logs</CardTitle>
                <CardDescription>
                  Recent webhook calls and their status. Showing last 50 entries.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => refetchLogs()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                {logs && logs.length > 0 && (
                  <Button variant="destructive" size="sm" onClick={handleClearAllLogs}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !logs || logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>No webhook logs yet</p>
                <p className="text-xs">Logs will appear here after form submissions</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Response</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {log.success ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.http_method}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {log.page_url || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(log.created_at), 'MMM d, HH:mm')}
                        </TableCell>
                        <TableCell>
                          {log.success ? (
                            <span className="text-sm text-green-600">{log.response_status}</span>
                          ) : (
                            <span className="text-sm text-destructive" title={log.error_message || ''}>
                              {log.error_message?.slice(0, 30) || 'Failed'}...
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLog(log.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}