-- Drop existing SELECT policy on leads that may be misconfigured
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;

-- Create proper PERMISSIVE policy that only allows authenticated admins to view leads
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));