-- Create webhook_logs table to track webhook calls
CREATE TABLE public.webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_url TEXT NOT NULL,
  http_method TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all logs
CREATE POLICY "Admins can view webhook logs"
ON public.webhook_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for inserting logs (anyone can insert - triggered by form submissions)
CREATE POLICY "Anyone can insert webhook logs"
ON public.webhook_logs
FOR INSERT
WITH CHECK (true);

-- Create policy for admins to delete logs
CREATE POLICY "Admins can delete webhook logs"
ON public.webhook_logs
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));