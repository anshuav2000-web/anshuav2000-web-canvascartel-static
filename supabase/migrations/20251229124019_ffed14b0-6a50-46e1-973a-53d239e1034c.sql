-- Create storage bucket for site logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to site assets
CREATE POLICY "Site assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

-- Allow authenticated admins to upload site assets
CREATE POLICY "Admins can upload site assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-assets' 
  AND auth.uid() IS NOT NULL 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to update site assets
CREATE POLICY "Admins can update site assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-assets' 
  AND auth.uid() IS NOT NULL 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to delete site assets
CREATE POLICY "Admins can delete site assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-assets' 
  AND auth.uid() IS NOT NULL 
  AND public.has_role(auth.uid(), 'admin')
);