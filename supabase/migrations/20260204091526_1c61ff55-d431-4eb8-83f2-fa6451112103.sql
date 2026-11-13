-- Update the favicon URL in branding to the correct one
UPDATE site_content 
SET content = jsonb_set(content, '{faviconUrl}', '"https://dsuvcvbtxdftlbhuvsnv.supabase.co/storage/v1/object/public/site-assets/favicons/favicon-1767178932656.png"'),
    updated_at = now()
WHERE section = 'branding';