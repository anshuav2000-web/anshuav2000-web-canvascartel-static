import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface URLInspectionResult {
  url: string;
  indexingStatus: 'INDEXED' | 'NOT_INDEXED' | 'DISCOVERED' | 'CRAWLED' | 'UNKNOWN';
  lastCrawlTime?: string;
  coverage?: string;
  verdict?: string;
  pageFetchState?: string;
  robotsTxtState?: string;
  indexingState?: string;
  crawledAs?: string;
  error?: string;
}

interface GSCServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// Generate JWT for Google API authentication
async function generateGoogleJWT(serviceAccount: GSCServiceAccount): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const signatureInput = `${headerB64}.${payloadB64}`;
  
  // Import the private key
  const pemContents = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');
  
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(signatureInput)
  );
  
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  return `${signatureInput}.${signatureB64}`;
}

// Get access token from Google
async function getAccessToken(serviceAccount: GSCServiceAccount): Promise<string> {
  const jwt = await generateGoogleJWT(serviceAccount);
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Token error:', error);
    throw new Error(`Failed to get access token: ${error}`);
  }
  
  const data = await response.json();
  return data.access_token;
}

// Inspect a single URL using the URL Inspection API
async function inspectURL(url: string, siteUrl: string, accessToken: string): Promise<URLInspectionResult> {
  try {
    const response = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl: siteUrl,
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`URL Inspection error for ${url}:`, error);
      return {
        url,
        indexingStatus: 'UNKNOWN',
        error: `API error: ${response.status}`,
      };
    }
    
    const data = await response.json();
    const inspectionResult = data.inspectionResult;
    const indexStatusResult = inspectionResult?.indexStatusResult;
    
    // Map the verdict to our simplified status
    let indexingStatus: URLInspectionResult['indexingStatus'] = 'UNKNOWN';
    const verdict = indexStatusResult?.verdict;
    
    if (verdict === 'PASS') {
      indexingStatus = 'INDEXED';
    } else if (verdict === 'NEUTRAL' || verdict === 'PARTIAL') {
      indexingStatus = 'DISCOVERED';
    } else if (verdict === 'FAIL') {
      const coverageState = indexStatusResult?.coverageState;
      if (coverageState === 'Discovered - currently not indexed') {
        indexingStatus = 'DISCOVERED';
      } else if (coverageState === 'Crawled - currently not indexed') {
        indexingStatus = 'CRAWLED';
      } else {
        indexingStatus = 'NOT_INDEXED';
      }
    }
    
    return {
      url,
      indexingStatus,
      lastCrawlTime: indexStatusResult?.lastCrawlTime,
      coverage: indexStatusResult?.coverageState,
      verdict: indexStatusResult?.verdict,
      pageFetchState: indexStatusResult?.pageFetchState,
      robotsTxtState: indexStatusResult?.robotsTxtState,
      indexingState: indexStatusResult?.indexingState,
      crawledAs: indexStatusResult?.crawledAs,
    };
  } catch (error) {
    console.error(`Error inspecting ${url}:`, error);
    return {
      url,
      indexingStatus: 'UNKNOWN',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the service account JSON from environment
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
    if (!serviceAccountJson) {
      console.error('GOOGLE_SERVICE_ACCOUNT_JSON not configured');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Google Service Account not configured. Please add GOOGLE_SERVICE_ACCOUNT_JSON secret.',
        configured: false,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let serviceAccount: GSCServiceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (e) {
      console.error('Invalid service account JSON:', e);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid service account JSON format',
        configured: false,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Supabase client to fetch site data
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get site URL from SEO settings
    let siteUrl = 'https://canvascartel.in';
    const { data: seoData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'seo')
      .maybeSingle();
    
    if (seoData?.content) {
      const content = seoData.content as { siteUrl?: string };
      siteUrl = content.siteUrl || siteUrl;
    }

    // Parse request body for specific URLs to check
    let urlsToCheck: string[] = [];
    try {
      const body = await req.json();
      if (body.urls && Array.isArray(body.urls)) {
        urlsToCheck = body.urls;
      }
    } catch {
      // No body provided, will fetch default URLs
    }

    // If no specific URLs, get all pages from sitemap data
    if (urlsToCheck.length === 0) {
      // Get services
      const { data: servicesData } = await supabase
        .from('site_content')
        .select('content')
        .eq('section', 'services')
        .maybeSingle();
      
      // Get projects
      const { data: portfolioData } = await supabase
        .from('site_content')
        .select('content')
        .eq('section', 'portfolio')
        .maybeSingle();
      
      // Build list of URLs to check
      const staticPages = [
        '',
        '/about',
        '/services',
        '/projects',
        '/contact',
        '/career',
      ];
      
      urlsToCheck = staticPages.map(path => `${siteUrl}${path}`);
      
      // Add service pages
      if (servicesData?.content) {
        const services = (servicesData.content as { services?: { id: string; title: string }[] }).services || [];
        services.forEach(service => {
          const slug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          urlsToCheck.push(`${siteUrl}/services/${slug}`);
        });
      }
      
      // Add project pages
      if (portfolioData?.content) {
        const projects = (portfolioData.content as { projects?: { id: string; title: string }[] }).projects || [];
        projects.forEach(project => {
          const slug = project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          urlsToCheck.push(`${siteUrl}/projects/${slug}`);
        });
      }
    }

    console.log(`Checking ${urlsToCheck.length} URLs for indexing status`);

    // Get access token
    const accessToken = await getAccessToken(serviceAccount);
    console.log('Successfully obtained access token');

    // Check each URL (with rate limiting - 2 per second max)
    const results: URLInspectionResult[] = [];
    const batchSize = 5;
    
    for (let i = 0; i < urlsToCheck.length; i += batchSize) {
      const batch = urlsToCheck.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => inspectURL(url, siteUrl, accessToken))
      );
      results.push(...batchResults);
      
      // Rate limiting - wait 1 second between batches
      if (i + batchSize < urlsToCheck.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Calculate summary stats
    const indexed = results.filter(r => r.indexingStatus === 'INDEXED').length;
    const notIndexed = results.filter(r => r.indexingStatus === 'NOT_INDEXED').length;
    const discovered = results.filter(r => r.indexingStatus === 'DISCOVERED').length;
    const crawled = results.filter(r => r.indexingStatus === 'CRAWLED').length;
    const unknown = results.filter(r => r.indexingStatus === 'UNKNOWN').length;

    const summary = {
      total: results.length,
      indexed,
      notIndexed,
      discovered,
      crawled,
      unknown,
      indexedPercentage: Math.round((indexed / results.length) * 100),
    };

    // Store results in site_content for caching
    await supabase
      .from('site_content')
      .upsert({
        section: 'gsc_indexing_status',
        content: {
          results,
          summary,
          checkedAt: new Date().toISOString(),
          siteUrl,
        },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'section' });

    console.log('GSC indexing status check complete:', summary);

    return new Response(JSON.stringify({
      success: true,
      configured: true,
      results,
      summary,
      checkedAt: new Date().toISOString(),
      siteUrl,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error fetching GSC indexing status:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      success: false, 
      error: message,
      configured: true,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
