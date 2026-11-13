import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Globe,
  Link2,
  FileSearch,
  TrendingUp,
  Clock,
  ExternalLink,
  ArrowRight,
  Zap,
  Target,
  AlertCircle,
  Check,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import { toast } from "sonner";

interface PingResult {
  engine: string;
  url: string;
  status: 'success' | 'failed';
  statusCode?: number;
  message?: string;
  timestamp: string;
}

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

interface SEOAnalysis {
  overallScore: number;
  pageScores: PageSEOScore[];
  linkSuggestions: InternalLinkSuggestion[];
  analyzedAt: string;
  totalPages: number;
}

interface PingLogs {
  logs: PingResult[];
}

interface GSCIndexingResult {
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

interface GSCIndexingData {
  results: GSCIndexingResult[];
  summary: {
    total: number;
    indexed: number;
    notIndexed: number;
    discovered: number;
    crawled: number;
    unknown: number;
    indexedPercentage: number;
  };
  checkedAt: string;
  siteUrl: string;
}

const SEOTools = () => {
  const [isPinging, setIsPinging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCheckingGSC, setIsCheckingGSC] = useState(false);
  const [pingLogs, setPingLogs] = useState<PingResult[]>([]);
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null);
  const [gscData, setGscData] = useState<GSCIndexingData | null>(null);
  const [gscConfigured, setGscConfigured] = useState<boolean | null>(null);
  
  const { data: pingLogsData } = useSiteContent<PingLogs>('ping_logs');
  const { data: analysisData } = useSiteContent<SEOAnalysis>('seo_analysis');
  const { data: gscCachedData } = useSiteContent<GSCIndexingData>('gsc_indexing_status');

  useEffect(() => {
    if (pingLogsData?.logs) {
      setPingLogs(pingLogsData.logs);
    }
  }, [pingLogsData]);

  useEffect(() => {
    if (analysisData) {
      setSeoAnalysis(analysisData);
    }
  }, [analysisData]);

  useEffect(() => {
    if (gscCachedData) {
      setGscData(gscCachedData);
      setGscConfigured(true);
    }
  }, [gscCachedData]);

  const handlePingSearchEngines = async () => {
    setIsPinging(true);
    try {
      const { data, error } = await supabase.functions.invoke('ping-search-engines');
      
      if (error) throw error;
      
      if (data.success) {
        toast.success('Search engines pinged successfully!');
        setPingLogs(prev => [...data.results, ...prev]);
      } else {
        toast.error(data.error || 'Failed to ping search engines');
      }
    } catch (error) {
      console.error('Ping error:', error);
      toast.error('Failed to ping search engines');
    } finally {
      setIsPinging(false);
    }
  };

  const handleAnalyzeSEO = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-seo');
      
      if (error) throw error;
      
      if (data.success) {
        toast.success('SEO analysis complete!');
        setSeoAnalysis(data);
      } else {
        toast.error(data.error || 'Failed to analyze SEO');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze SEO');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCheckGSCIndexing = async () => {
    setIsCheckingGSC(true);
    try {
      const { data, error } = await supabase.functions.invoke('gsc-indexing-status');
      
      if (error) throw error;
      
      setGscConfigured(data.configured !== false);
      
      if (data.success) {
        toast.success('GSC indexing status fetched!');
        setGscData(data);
      } else {
        if (!data.configured) {
          toast.error('Google Service Account not configured');
        } else {
          toast.error(data.error || 'Failed to fetch indexing status');
        }
      }
    } catch (error) {
      console.error('GSC error:', error);
      toast.error('Failed to fetch GSC indexing status');
    } finally {
      setIsCheckingGSC(false);
    }
  };

  const getIndexingStatusBadge = (status: GSCIndexingResult['indexingStatus']) => {
    switch (status) {
      case 'INDEXED':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Indexed</Badge>;
      case 'DISCOVERED':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Discovered</Badge>;
      case 'CRAWLED':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Crawled</Badge>;
      case 'NOT_INDEXED':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Not Indexed</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStatusBadge = (status: PageSEOScore['status']) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Good</Badge>;
      case 'needs_improvement':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Needs Work</Badge>;
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Critical</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">SEO Command Center</h1>
            <p className="text-muted-foreground mt-1">Comprehensive SEO automation and monitoring</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAnalyzeSEO} disabled={isAnalyzing} variant="outline">
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileSearch className="h-4 w-4 mr-2" />
              )}
              Analyze SEO
            </Button>
            <Button onClick={handlePingSearchEngines} disabled={isPinging}>
              {isPinging ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Ping Search Engines
            </Button>
          </div>
        </div>

        {/* Overall Score Card */}
        {seoAnalysis && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className={`text-5xl font-bold ${getScoreColor(seoAnalysis.overallScore)}`}>
                      {seoAnalysis.overallScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="h-16 w-px bg-border" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{seoAnalysis.totalPages} pages analyzed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Last analyzed: {new Date(seoAnalysis.analyzedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{seoAnalysis.linkSuggestions.length} link suggestions</span>
                    </div>
                  </div>
                </div>
                <div className="w-48">
                  <Progress value={seoAnalysis.overallScore} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="indexing" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="indexing" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Indexing
            </TabsTrigger>
            <TabsTrigger value="scores" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Page Scores
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Internal Links
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Ping Logs
            </TabsTrigger>
          </TabsList>

          {/* Indexing Status Tab */}
          <TabsContent value="indexing" className="space-y-6 mt-6">
            {/* GSC Integration Banner */}
            <Card className={gscConfigured === false ? "border-yellow-500/30 bg-yellow-500/5" : "border-green-500/30 bg-green-500/5"}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Google Search Console Integration
                    </CardTitle>
                    <CardDescription>
                      {gscConfigured === false 
                        ? "Service account not configured. Add GOOGLE_SERVICE_ACCOUNT_JSON secret."
                        : "Real-time indexing status from Google Search Console API"
                      }
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleCheckGSCIndexing} 
                    disabled={isCheckingGSC}
                    size="sm"
                  >
                    {isCheckingGSC ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Check Status
                  </Button>
                </div>
              </CardHeader>
              {gscData && (
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-background border">
                      <div className="text-2xl font-bold text-green-500">{gscData.summary.indexed}</div>
                      <div className="text-xs text-muted-foreground">Indexed</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background border">
                      <div className="text-2xl font-bold text-blue-500">{gscData.summary.discovered}</div>
                      <div className="text-xs text-muted-foreground">Discovered</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background border">
                      <div className="text-2xl font-bold text-yellow-500">{gscData.summary.crawled}</div>
                      <div className="text-xs text-muted-foreground">Crawled</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background border">
                      <div className="text-2xl font-bold text-red-500">{gscData.summary.notIndexed}</div>
                      <div className="text-xs text-muted-foreground">Not Indexed</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background border">
                      <div className="text-2xl font-bold">{gscData.summary.indexedPercentage}%</div>
                      <div className="text-xs text-muted-foreground">Coverage</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last checked: {new Date(gscData.checkedAt).toLocaleString()}
                  </div>
                </CardContent>
              )}
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Sitemap Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{seoAnalysis?.totalPages || 0}</div>
                      <div className="text-xs text-muted-foreground">Pages in sitemap</div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a 
                        href="https://dsuvcvbtxdftlbhuvsnv.supabase.co/functions/v1/generate-sitemap" 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Last Ping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      {pingLogs.length > 0 ? (
                        <>
                          <div className="text-2xl font-bold flex items-center gap-2">
                            {pingLogs[0].status === 'success' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            {pingLogs[0].engine}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(pingLogs[0].timestamp).toLocaleString()}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">--</div>
                          <div className="text-xs text-muted-foreground">No pings yet</div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    Robots.txt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        Active
                      </div>
                      <div className="text-xs text-muted-foreground">Crawlers configured</div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a 
                        href="https://dsuvcvbtxdftlbhuvsnv.supabase.co/functions/v1/generate-robots" 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* GSC URL Details */}
            {gscData && gscData.results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>URL Indexing Details</CardTitle>
                  <CardDescription>Detailed indexing status from Google Search Console</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {gscData.results.map((result, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <a 
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium hover:text-primary truncate block"
                            >
                              {result.url.replace(gscData.siteUrl, '')}
                              <ExternalLink className="h-3 w-3 inline ml-1" />
                            </a>
                            {result.lastCrawlTime && (
                              <div className="text-xs text-muted-foreground">
                                Last crawled: {new Date(result.lastCrawlTime).toLocaleString()}
                              </div>
                            )}
                            {result.coverage && (
                              <div className="text-xs text-muted-foreground">
                                {result.coverage}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            {getIndexingStatusBadge(result.indexingStatus)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common SEO tasks and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Button 
                    onClick={handleCheckGSCIndexing}
                    disabled={isCheckingGSC}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                  >
                    {isCheckingGSC ? <Loader2 className="h-6 w-6 animate-spin" /> : <FileSearch className="h-6 w-6" />}
                    <span>Check GSC Status</span>
                  </Button>
                  <Button 
                    onClick={handlePingSearchEngines} 
                    disabled={isPinging}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                  >
                    {isPinging ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                    <span>Ping Google & Bing</span>
                  </Button>
                  <Button 
                    onClick={handleAnalyzeSEO}
                    disabled={isAnalyzing}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                  >
                    {isAnalyzing ? <Loader2 className="h-6 w-6 animate-spin" /> : <FileSearch className="h-6 w-6" />}
                    <span>Run SEO Analysis</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    asChild
                  >
                    <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                      <Globe className="h-6 w-6" />
                      <span>Search Console</span>
                    </a>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    asChild
                  >
                    <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer">
                      <Globe className="h-6 w-6" />
                      <span>Bing Webmaster</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page Scores Tab */}
          <TabsContent value="scores" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>On-Page SEO Scores</CardTitle>
                <CardDescription>Individual page SEO analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {seoAnalysis?.pageScores && seoAnalysis.pageScores.length > 0 ? (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {seoAnalysis.pageScores.map((page, index) => (
                        <div 
                          key={index} 
                          className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{page.title}</h4>
                                {getStatusBadge(page.status)}
                              </div>
                              <a 
                                href={page.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                              >
                                {page.path}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(page.score)}`}>
                                {page.score}
                              </div>
                              <div className="text-xs text-muted-foreground">Score</div>
                            </div>
                          </div>

                          {/* Progress bars for details */}
                          <div className="grid grid-cols-4 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Title</div>
                              <Progress value={page.details.titleScore * 10} className="h-2" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Description</div>
                              <Progress value={page.details.descriptionScore * 10} className="h-2" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">URL</div>
                              <Progress value={page.details.urlStructure * 10} className="h-2" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Content</div>
                              <Progress value={page.details.contentScore * 10} className="h-2" />
                            </div>
                          </div>

                          {/* Issues and Suggestions */}
                          {(page.issues.length > 0 || page.suggestions.length > 0) && (
                            <div className="space-y-2 pt-3 border-t">
                              {page.issues.map((issue, i) => (
                                <div key={`issue-${i}`} className="flex items-center gap-2 text-sm text-red-500">
                                  <AlertCircle className="h-4 w-4 shrink-0" />
                                  {issue}
                                </div>
                              ))}
                              {page.suggestions.map((suggestion, i) => (
                                <div key={`suggestion-${i}`} className="flex items-center gap-2 text-sm text-yellow-500">
                                  <AlertTriangle className="h-4 w-4 shrink-0" />
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No SEO analysis data yet.</p>
                    <Button onClick={handleAnalyzeSEO} className="mt-4" disabled={isAnalyzing}>
                      {isAnalyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Run Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Internal Links Tab */}
          <TabsContent value="links" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Internal Link Suggestions</CardTitle>
                <CardDescription>AI-powered suggestions to improve your internal linking structure</CardDescription>
              </CardHeader>
              <CardContent>
                {seoAnalysis?.linkSuggestions && seoAnalysis.linkSuggestions.length > 0 ? (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {seoAnalysis.linkSuggestions.map((suggestion) => (
                        <div 
                          key={suggestion.id}
                          className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {suggestion.relevanceScore}% Match
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm mb-2">
                                <span className="font-medium">{suggestion.sourceTitle}</span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-primary">{suggestion.targetTitle}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">
                                <code className="bg-muted px-2 py-1 rounded">{suggestion.sourcePage}</code>
                                {" → "}
                                <code className="bg-muted px-2 py-1 rounded">{suggestion.targetPage}</code>
                              </div>
                              <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-muted/50 p-2 rounded text-sm">
                            <span className="text-muted-foreground">Suggested anchor: </span>
                            <span className="text-primary font-medium">"{suggestion.anchorText}"</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No link suggestions yet.</p>
                    <Button onClick={handleAnalyzeSEO} className="mt-4" disabled={isAnalyzing}>
                      {isAnalyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Generate Suggestions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ping Logs Tab */}
          <TabsContent value="logs" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Engine Ping History</CardTitle>
                <CardDescription>Log of all sitemap submissions to search engines</CardDescription>
              </CardHeader>
              <CardContent>
                {pingLogs.length > 0 ? (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {pingLogs.map((log, index) => (
                        <div 
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            log.status === 'success' 
                              ? 'bg-green-500/5 border-green-500/20' 
                              : 'bg-red-500/5 border-red-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {log.status === 'success' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              <div className="font-medium">{log.engine}</div>
                              <div className="text-xs text-muted-foreground">{log.message}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">
                              {log.statusCode && (
                                <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                                  HTTP {log.statusCode}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No ping history yet.</p>
                    <Button onClick={handlePingSearchEngines} className="mt-4" disabled={isPinging}>
                      {isPinging ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Ping Search Engines
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SEOTools;
