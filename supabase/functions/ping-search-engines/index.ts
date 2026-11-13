import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PingResult {
  engine: string;
  url: string;
  status: 'success' | 'failed';
  statusCode?: number;
  message?: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get site URL from sitemap settings
    let siteUrl = 'https://canvascartel.in';
    const { data: sitemapData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'sitemap')
      .maybeSingle();
    
    if (sitemapData?.content) {
      siteUrl = (sitemapData.content as { siteUrl?: string }).siteUrl || siteUrl;
    }

    const sitemapUrl = encodeURIComponent(`${siteUrl}/sitemap.xml`);
    const results: PingResult[] = [];
    const timestamp = new Date().toISOString();

    // Ping Google
    try {
      const googleUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;
      console.log('Pinging Google:', googleUrl);
      
      const googleResponse = await fetch(googleUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'CanvasCartel-SEO-Bot/1.0',
        },
      });
      
      results.push({
        engine: 'Google',
        url: googleUrl,
        status: googleResponse.ok ? 'success' : 'failed',
        statusCode: googleResponse.status,
        message: googleResponse.ok ? 'Sitemap submitted successfully' : `HTTP ${googleResponse.status}`,
        timestamp,
      });
    } catch (error) {
      console.error('Google ping error:', error);
      results.push({
        engine: 'Google',
        url: `https://www.google.com/ping?sitemap=${sitemapUrl}`,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp,
      });
    }

    // Ping Bing
    try {
      const bingUrl = `https://www.bing.com/ping?sitemap=${sitemapUrl}`;
      console.log('Pinging Bing:', bingUrl);
      
      const bingResponse = await fetch(bingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'CanvasCartel-SEO-Bot/1.0',
        },
      });
      
      results.push({
        engine: 'Bing',
        url: bingUrl,
        status: bingResponse.ok ? 'success' : 'failed',
        statusCode: bingResponse.status,
        message: bingResponse.ok ? 'Sitemap submitted successfully' : `HTTP ${bingResponse.status}`,
        timestamp,
      });
    } catch (error) {
      console.error('Bing ping error:', error);
      results.push({
        engine: 'Bing',
        url: `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp,
      });
    }

    // Store ping logs in site_content
    const { data: existingLogs } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'ping_logs')
      .maybeSingle();

    const logs = existingLogs?.content as { logs?: PingResult[] } || { logs: [] };
    const updatedLogs = [...results, ...(logs.logs || [])].slice(0, 100); // Keep last 100 logs

    await supabase
      .from('site_content')
      .upsert({
        section: 'ping_logs',
        content: { logs: updatedLogs },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'section' });

    console.log('Ping results:', results);

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      sitemapUrl: `${siteUrl}/sitemap.xml`,
      timestamp,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error pinging search engines:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
