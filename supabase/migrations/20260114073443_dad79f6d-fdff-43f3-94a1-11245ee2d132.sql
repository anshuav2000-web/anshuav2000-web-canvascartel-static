-- Create job_openings table for managing current openings
CREATE TABLE public.job_openings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT DEFAULT 'Mumbai, India',
  type TEXT DEFAULT 'Full-time',
  experience TEXT,
  description TEXT,
  requirements TEXT[],
  responsibilities TEXT[],
  salary_range TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active job openings
CREATE POLICY "Anyone can view active job openings" 
ON public.job_openings 
FOR SELECT 
USING (is_active = true);

-- Admins can view all job openings
CREATE POLICY "Admins can view all job openings" 
ON public.job_openings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert job openings
CREATE POLICY "Admins can insert job openings" 
ON public.job_openings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update job openings
CREATE POLICY "Admins can update job openings" 
ON public.job_openings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete job openings
CREATE POLICY "Admins can delete job openings" 
ON public.job_openings 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_job_openings_updated_at
BEFORE UPDATE ON public.job_openings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();