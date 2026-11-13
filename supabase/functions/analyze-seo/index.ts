import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PageSEOScore {
  url: string;
  path: string;
  title: string;
  score: number;
  status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  issues: string[];
  suggestions: string[];
  details: {
    titleLength: number;
    titleScore: number;
    descriptionLength: number;
    descriptionScore: number;
    hasH1: boolean;
    hasInternalLinks: boolean;
    hasImages: boolean;
    hasAltTags: boolean;
    contentLength: number;
    contentScore: number;
    urlStructure: number;
    keywordPresence: number;
  };
}

interface InternalLinkSuggestion {
  id: string;
  sourcePage: string;
  sourceTitle: string;
  targetPage: string;
  targetTitle: string;
  anchorText: string;
  relevanceScore: number;
  reason: string;
}

interface SitePageData {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  content?: string;
  type: 'static' | 'service' | 'project';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get site URL
    let siteUrl = 'https://canvascartel.in';
    const { data: sitemapData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'sitemap')
      .maybeSingle();
    
    if (sitemapData?.content) {
      siteUrl = (sitemapData.content as { siteUrl?: string }).siteUrl || siteUrl;
    }

    // Get SEO settings
    const { data: seoData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'seo')
      .maybeSingle();

    const seoSettings = seoData?.content as Record<string, unknown> || {};

    // Get all site pages from various sources
    const pages: SitePageData[] = [];

    // Static pages
    const staticPages = [
      { path: '/', title: 'Home', description: seoSettings.defaultDescription as string || '' },
      { path: '/about', title: 'About', description: '' },
      { path: '/services', title: 'Services', description: '' },
      { path: '/projects', title: 'Projects', description: '' },
      { path: '/contact', title: 'Contact', description: '' },
      { path: '/career', title: 'Career', description: '' },
    ];

    staticPages.forEach(page => {
      const pageSettings = (seoSettings.pages as Record<string, { title?: string; description?: string; keywords?: string }> || {})[page.path.replace('/', '') || 'home'];
      pages.push({
        path: page.path,
        title: pageSettings?.title || page.title,
        description: pageSettings?.description || page.description,
        keywords: pageSettings?.keywords?.split(',').map(k => k.trim()),
        type: 'static',
      });
    });

    // Get services
    const { data: servicesData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'services')
      .maybeSingle();

    if (servicesData?.content) {
      const services = (servicesData.content as { services?: Array<{ id: string; title: string; description: string }> }).services || [];
      services.forEach(service => {
        pages.push({
          path: `/services/${service.id}`,
          title: service.title,
          description: service.description,
          type: 'service',
        });
      });
    }

    // Get projects
    const { data: portfolioData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', 'portfolio')
      .maybeSingle();

    if (portfolioData?.content) {
      const projects = (portfolioData.content as { projects?: Array<{ id: string; title: string; description: string }> }).projects || [];
      projects.forEach(project => {
        pages.push({
          path: `/projects/${project.id}`,
          title: project.title,
          description: project.description,
          type: 'project',
        });
      });
    }

    // Analyze each page
    const pageScores: PageSEOScore[] = pages.map(page => {
      const issues: string[] = [];
      const suggestions: string[] = [];
      
      // Title analysis
      const titleLength = page.title?.length || 0;
      let titleScore = 0;
      if (titleLength === 0) {
        issues.push('Missing page title');
        titleScore = 0;
      } else if (titleLength < 30) {
        suggestions.push('Title is too short (< 30 chars)');
        titleScore = 5;
      } else if (titleLength > 60) {
        suggestions.push('Title is too long (> 60 chars)');
        titleScore = 7;
      } else {
        titleScore = 10;
      }

      // Description analysis
      const descriptionLength = page.description?.length || 0;
      let descriptionScore = 0;
      if (descriptionLength === 0) {
        issues.push('Missing meta description');
        descriptionScore = 0;
      } else if (descriptionLength < 120) {
        suggestions.push('Description is too short (< 120 chars)');
        descriptionScore = 5;
      } else if (descriptionLength > 160) {
        suggestions.push('Description is too long (> 160 chars)');
        descriptionScore = 7;
      } else {
        descriptionScore = 10;
      }

      // URL structure analysis
      let urlScore = 10;
      if (page.path.includes('_')) {
        suggestions.push('Use hyphens instead of underscores in URLs');
        urlScore = 7;
      }
      if (page.path.length > 75) {
        suggestions.push('URL is too long');
        urlScore = 6;
      }
      if (/[A-Z]/.test(page.path)) {
        suggestions.push('Use lowercase URLs');
        urlScore = 7;
      }

      // Keyword analysis
      let keywordScore = 0;
      if (page.keywords && page.keywords.length > 0) {
        keywordScore = Math.min(page.keywords.length * 2, 10);
      } else {
        suggestions.push('Add keywords for better SEO');
      }

      // Content analysis (simulated)
      const contentLength = (page.description?.length || 0) * 5; // Estimate
      let contentScore = 0;
      if (contentLength < 300) {
        suggestions.push('Add more content (minimum 300 words recommended)');
        contentScore = 3;
      } else if (contentLength < 1000) {
        contentScore = 6;
      } else {
        contentScore = 10;
      }

      // Calculate total score
      const totalScore = Math.round(
        (titleScore * 2 + descriptionScore * 2 + urlScore + keywordScore + contentScore) / 8 * 100
      );

      let status: PageSEOScore['status'];
      if (totalScore >= 80) status = 'excellent';
      else if (totalScore >= 60) status = 'good';
      else if (totalScore >= 40) status = 'needs_improvement';
      else status = 'critical';

      return {
        url: `${siteUrl}${page.path}`,
        path: page.path,
        title: page.title,
        score: totalScore,
        status,
        issues,
        suggestions,
        details: {
          titleLength,
          titleScore,
          descriptionLength,
          descriptionScore,
          hasH1: true, // Assumed
          hasInternalLinks: page.type !== 'static' || page.path === '/',
          hasImages: page.type === 'project',
          hasAltTags: true, // Assumed
          contentLength,
          contentScore,
          urlStructure: urlScore,
          keywordPresence: keywordScore,
        },
      };
    });

    // Generate internal link suggestions
    const linkSuggestions: InternalLinkSuggestion[] = [];
    
    // Suggest linking from home to services
    const homeScore = pageScores.find(p => p.path === '/')?.score || 0;
    const servicePages = pages.filter(p => p.type === 'service');
    const projectPages = pages.filter(p => p.type === 'project');

    servicePages.forEach((service, index) => {
      // Suggest linking from blog/about to services
      linkSuggestions.push({
        id: `link-${index}`,
        sourcePage: '/about',
        sourceTitle: 'About Page',
        targetPage: service.path,
        targetTitle: service.title,
        anchorText: service.title.toLowerCase(),
        relevanceScore: 85,
        reason: 'Link from About page to boost service page authority',
      });
    });

    // Suggest cross-linking between services and projects
    projectPages.forEach((project, index) => {
      if (servicePages.length > 0) {
        const relatedService = servicePages[index % servicePages.length];
        linkSuggestions.push({
          id: `cross-${index}`,
          sourcePage: project.path,
          sourceTitle: project.title,
          targetPage: relatedService.path,
          targetTitle: relatedService.title,
          anchorText: `our ${relatedService.title.toLowerCase()} service`,
          relevanceScore: 75,
          reason: 'Cross-link related content for better SEO',
        });
      }
    });

    // Calculate overall site SEO score
    const overallScore = Math.round(
      pageScores.reduce((sum, p) => sum + p.score, 0) / pageScores.length
    );

    // Store analysis results
    await supabase
      .from('site_content')
      .upsert({
        section: 'seo_analysis',
        content: {
          overallScore,
          pageScores,
          linkSuggestions,
          analyzedAt: new Date().toISOString(),
          totalPages: pages.length,
        },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'section' });

    console.log('SEO Analysis complete:', { overallScore, pagesAnalyzed: pages.length });

    return new Response(JSON.stringify({
      success: true,
      overallScore,
      pageScores,
      linkSuggestions,
      analyzedAt: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error analyzing SEO:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
