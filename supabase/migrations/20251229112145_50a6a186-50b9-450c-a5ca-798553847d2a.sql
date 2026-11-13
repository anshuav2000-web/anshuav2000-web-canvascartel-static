-- Secure the has_role function to prevent unauthorized role lookups
-- Users can only check their own role unless called from a postgres/service role context

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow users to check their own role via RPC
  -- Allow service role / postgres to check any user (for RLS policy evaluation)
  IF _user_id != auth.uid() AND current_setting('role', true) NOT IN ('postgres', 'service_role') THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$;