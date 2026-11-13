import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RobotsContent {
  allowAllCrawlers: boolean;
  allowGooglebot: boolean;
  allowBingbot: boolean;
  allowTwitterbot: boolean;
  allowFacebookbot: boolean;
  allowGPTBot: boolean;
  allowPerplexityBot: boolean;
  allowClaudeBot: boolean;
  disallowedPaths: string[];
  customRules: string;
}

interface SitemapContent {
  siteUrl: string;
}

const defaultRobotsContent: RobotsContent = {
  allowAllCrawlers: true,
  allowGooglebot: true,
  allowBingbot: true,
  allowTwitterbot: true,
  allowFacebookbot: true,
  allowGPTBot: true,
  allowPerplexityBot: true,
  allowClaudeBot: true,
  disallowedPaths: ['/admin/', '/auth'],
  customRules: '',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch robots settings from database
    let robotsConfig = defaultRobotsContent;
    const { data: robotsData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'robots')
      .single();
    
    if (robotsData?.content) {
      robotsConfig = { ...defaultRobotsContent, ...robotsData.content as RobotsContent };
    }

    // Fetch sitemap settings for site URL
    let siteUrl = 'https://canvascartel.in';
    const { data: sitemapData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'sitemap')
      .single();
    
    if (sitemapData?.content) {
      siteUrl = (sitemapData.content as SitemapContent).siteUrl || siteUrl;
    }

    // Build robots.txt content
    let content = "# Robots.txt - Generated dynamically\n\n";
    
    if (robotsConfig.allowAllCrawlers) {
      content += "User-agent: *\nAllow: /\n";
      robotsConfig.disallowedPaths.forEach((path) => {
        content += `Disallow: ${path}\n`;
      });
      content += "\n";
    }

    if (robotsConfig.allowGooglebot) {
      content += "User-agent: Googlebot\nAllow: /\n\n";
    }
    if (robotsConfig.allowBingbot) {
      content += "User-agent: Bingbot\nAllow: /\n\n";
    }
    if (robotsConfig.allowTwitterbot) {
      content += "User-agent: Twitterbot\nAllow: /\n\n";
    }
    if (robotsConfig.allowFacebookbot) {
      content += "User-agent: facebookexternalhit\nAllow: /\n\n";
    }
    if (robotsConfig.allowGPTBot) {
      content += "User-agent: GPTBot\nAllow: /\n\n";
    }
    if (robotsConfig.allowPerplexityBot) {
      content += "User-agent: PerplexityBot\nAllow: /\n\n";
    }
    if (robotsConfig.allowClaudeBot) {
      content += "User-agent: Claude-Web\nAllow: /\n\nUser-agent: Anthropic-AI\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\n";
    }

    if (robotsConfig.customRules) {
      content += `# Custom Rules\n${robotsConfig.customRules}\n\n`;
    }

    content += `# Sitemap\nSitemap: ${siteUrl}/sitemap.xml`;

    return new Response(content, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error: unknown) {
    console.error('Error generating robots.txt:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
