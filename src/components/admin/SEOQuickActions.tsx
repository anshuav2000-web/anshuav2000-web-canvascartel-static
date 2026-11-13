import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Globe, 
  Map, 
  BarChart3, 
  Bot, 
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap
} from "lucide-react";
import { useSiteContent, SEOContent, RobotsContent, SitemapContent, defaultSEOContent } from "@/hooks/useSiteContent";

export const SEOQuickActions = () => {
  const { data: seo } = useSiteContent<SEOContent>('seo');
  const { data: robots } = useSiteContent<RobotsContent>('robots');
  const { data: sitemap } = useSiteContent<SitemapContent>('sitemap');

  const seoData = seo || defaultSEOContent;

  // SEO health checks
  const hasGoogleAnalytics = !!seoData.googleAnalyticsId;
  const hasSearchConsole = !!seoData.googleSearchConsoleId;
  const hasOgImage = !!seoData.defaultOgImage;
  const hasSiteUrl = !!seoData.siteUrl;
  const hasOrganizationSchema = !!seoData.organizationSchema?.name;
  const robotsConfigured = !!robots;
  const sitemapConfigured = !!sitemap;

  const seoScore = [
    hasGoogleAnalytics,
    hasSearchConsole,
    hasOgImage,
    hasSiteUrl,
    hasOrganizationSchema,
    robotsConfigured,
    sitemapConfigured
  ].filter(Boolean).length;

  const totalChecks = 7;
  const scorePercentage = Math.round((seoScore / totalChecks) * 100);

  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-500";
    if (scorePercentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadge = () => {
    if (scorePercentage >= 80) return { variant: "default" as const, text: "Good" };
    if (scorePercentage >= 50) return { variant: "secondary" as const, text: "Needs Work" };
    return { variant: "destructive" as const, text: "Poor" };
  };

  const quickLinks = [
    { 
      name: "SEO Command Center", 
      path: "/admin/seo-tools", 
      icon: Zap, 
      description: "Auto-ping, indexing, SEO scores" 
    },
    { 
      name: "SEO Settings", 
      path: "/admin/seo", 
      icon: Search, 
      description: "Meta tags, keywords, Open Graph" 
    },
    { 
      name: "Sitemap & Robots", 
      path: "/admin/sitemap-robots", 
      icon: Map, 
      description: "Configure crawlers & sitemap" 
    },
  ];

  const seoChecklist = [
    { 
      label: "Google Analytics", 
      configured: hasGoogleAnalytics, 
      path: "/admin/seo",
      tip: "Track visitor behavior"
    },
    { 
      label: "Search Console", 
      configured: hasSearchConsole, 
      path: "/admin/seo",
      tip: "Verify site ownership"
    },
    { 
      label: "OG Image", 
      configured: hasOgImage, 
      path: "/admin/seo",
      tip: "Social media previews"
    },
    { 
      label: "Site URL", 
      configured: hasSiteUrl, 
      path: "/admin/seo",
      tip: "Canonical URLs"
    },
    { 
      label: "Organization Schema", 
      configured: hasOrganizationSchema, 
      path: "/admin/seo",
      tip: "Rich search results"
    },
    { 
      label: "Robots.txt", 
      configured: robotsConfigured, 
      path: "/admin/sitemap-robots",
      tip: "Control crawler access"
    },
    { 
      label: "Sitemap", 
      configured: sitemapConfigured, 
      path: "/admin/sitemap-robots",
      tip: "Help search engines find pages"
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              SEO Health
            </CardTitle>
            <CardDescription>Quick overview of your SEO configuration</CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor()}`}>
              {scorePercentage}%
            </div>
            <Badge variant={getScoreBadge().variant}>
              {getScoreBadge().text}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{link.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            );
          })}
        </div>

        {/* SEO Checklist */}
        <div>
          <h4 className="text-sm font-medium mb-3">Configuration Checklist</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {seoChecklist.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors group"
              >
                {item.configured ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm">{item.label}</span>
                  <p className="text-xs text-muted-foreground truncate">{item.tip}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* External Links */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-3">Quick Access</h4>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://dsuvcvbtxdftlbhuvsnv.supabase.co/functions/v1/generate-sitemap" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Map className="h-3 w-3 mr-1" />
                View Sitemap
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://dsuvcvbtxdftlbhuvsnv.supabase.co/functions/v1/generate-robots" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Bot className="h-3 w-3 mr-1" />
                View Robots.txt
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://search.google.com/search-console" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Globe className="h-3 w-3 mr-1" />
                Search Console
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://analytics.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Analytics
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
