-- Delete the old favicon file from storage
DELETE FROM storage.objects 
WHERE bucket_id = 'site-assets' 
AND name = 'favicons/favicon-1769426291241.png';