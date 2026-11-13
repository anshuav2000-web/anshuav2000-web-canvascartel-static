import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SitemapPageConfig {
  path: string;
  priority: string;
  changefreq: string;
  enabled: boolean;
}

interface SitemapContent {
  siteUrl: string;
  includeServices: boolean;
  includeProjects: boolean;
  servicePriority: string;
  projectPriority: string;
  pages: SitemapPageConfig[];
}

const defaultSitemapContent: SitemapContent = {
  siteUrl: 'https://canvascartel.in',
  includeServices: true,
  includeProjects: true,
  servicePriority: '0.7',
  projectPriority: '0.6',
  pages: [
    { path: '/', priority: '1.0', changefreq: 'weekly', enabled: true },
    { path: '/about', priority: '0.8', changefreq: 'monthly', enabled: true },
    { path: '/services', priority: '0.8', changefreq: 'weekly', enabled: true },
    { path: '/projects', priority: '0.8', changefreq: 'weekly', enabled: true },
    { path: '/contact', priority: '0.8', changefreq: 'monthly', enabled: true },
    { path: '/career', priority: '0.7', changefreq: 'weekly', enabled: true },
    { path: '/n8n-automation', priority: '0.7', changefreq: 'monthly', enabled: true },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly', enabled: true },
    { path: '/terms', priority: '0.3', changefreq: 'yearly', enabled: true },
  ],
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

    const today = new Date().toISOString().split('T')[0];
    
    // Fetch sitemap settings from database
    let sitemapConfig = defaultSitemapContent;
    const { data: sitemapData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'sitemap')
      .single();
    
    if (sitemapData?.content) {
      sitemapConfig = { ...defaultSitemapContent, ...sitemapData.content as SitemapContent };
    }

    const SITE_URL = sitemapConfig.siteUrl;
    
    // Fetch services from site_content
    let services: Array<{ id: string }> = [];
    let servicesLastmod = today;
    
    if (sitemapConfig.includeServices) {
      const { data: servicesContent } = await supabase
        .from('site_content')
        .select('content, updated_at')
        .eq('section', 'services')
        .single();
      
      if (servicesContent) {
        servicesLastmod = servicesContent.updated_at?.split('T')[0] || today;
        const content = servicesContent.content as { services?: Array<{ id: string }> };
        services = content?.services || [];
      }
    }

    // Fetch projects from site_content
    let projects: Array<{ id: string }> = [];
    let projectsLastmod = today;
    
    if (sitemapConfig.includeProjects) {
      const { data: portfolioContent } = await supabase
        .from('site_content')
        .select('content, updated_at')
        .eq('section', 'portfolio')
        .single();
      
      if (portfolioContent) {
        projectsLastmod = portfolioContent.updated_at?.split('T')[0] || today;
        const content = portfolioContent.content as { projects?: Array<{ id: string }> };
        projects = content?.projects || [];
      }
    }

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages from config
    for (const page of sitemapConfig.pages) {
      if (page.enabled) {
        sitemap += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      }
    }

    // Add service detail pages
    for (const service of services) {
      sitemap += `  <url>
    <loc>${SITE_URL}/services/${service.id}</loc>
    <lastmod>${servicesLastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${sitemapConfig.servicePriority}</priority>
  </url>
`;
    }

    // Add project detail pages
    for (const project of projects) {
      sitemap += `  <url>
    <loc>${SITE_URL}/projects/${project.id}</loc>
    <lastmod>${projectsLastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${sitemapConfig.projectPriority}</priority>
  </url>
`;
    }

    sitemap += `</urlset>`;

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error: unknown) {
    console.error('Error generating sitemap:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
