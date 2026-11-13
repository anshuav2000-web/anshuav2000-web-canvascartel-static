import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, Bot, Map, Plus, Trash2, ExternalLink, Copy, Check } from "lucide-react";
import { 
  useSiteContent, 
  RobotsContent, 
  SitemapContent, 
  SitemapPageConfig,
  defaultRobotsContent, 
  defaultSitemapContent 
} from "@/hooks/useSiteContent";
import { toast } from "sonner";

const SitemapRobotsAdmin = () => {
  const { data: robotsData, isLoading: robotsLoading, updateContent: updateRobots, isUpdating: robotsUpdating } = useSiteContent<RobotsContent>('robots');
  const { data: sitemapData, isLoading: sitemapLoading, updateContent: updateSitemap, isUpdating: sitemapUpdating } = useSiteContent<SitemapContent>('sitemap');
  
  const [robots, setRobots] = useState<RobotsContent>(robotsData || defaultRobotsContent);
  const [sitemap, setSitemap] = useState<SitemapContent>(sitemapData || defaultSitemapContent);
  const [newPath, setNewPath] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (robotsData) {
      setRobots({ ...defaultRobotsContent, ...robotsData });
    }
  }, [robotsData]);

  useEffect(() => {
    if (sitemapData) {
      setSitemap({ ...defaultSitemapContent, ...sitemapData });
    }
  }, [sitemapData]);

  const handleSaveRobots = async () => {
    try {
      await updateRobots(robots);
      toast.success("Robots.txt settings saved!");
    } catch {
      toast.error("Failed to save robots.txt settings");
    }
  };

  const handleSaveSitemap = async () => {
    try {
      await updateSitemap(sitemap);
      toast.success("Sitemap settings saved!");
    } catch {
      toast.error("Failed to save sitemap settings");
    }
  };

  const addDisallowedPath = () => {
    if (newPath && !robots.disallowedPaths.includes(newPath)) {
      setRobots({
        ...robots,
        disallowedPaths: [...robots.disallowedPaths, newPath],
      });
      setNewPath("");
    }
  };

  const removeDisallowedPath = (path: string) => {
    setRobots({
      ...robots,
      disallowedPaths: robots.disallowedPaths.filter((p) => p !== path),
    });
  };

  const addSitemapPage = () => {
    const newPage: SitemapPageConfig = {
      path: '/new-page',
      priority: '0.5',
      changefreq: 'monthly',
      enabled: true,
    };
    setSitemap({
      ...sitemap,
      pages: [...sitemap.pages, newPage],
    });
  };

  const updateSitemapPage = (index: number, field: keyof SitemapPageConfig, value: string | boolean) => {
    const newPages = [...sitemap.pages];
    newPages[index] = { ...newPages[index], [field]: value };
    setSitemap({ ...sitemap, pages: newPages });
  };

  const removeSitemapPage = (index: number) => {
    const newPages = sitemap.pages.filter((_, i) => i !== index);
    setSitemap({ ...sitemap, pages: newPages });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copied to clipboard!");
  };

  // Generate robots.txt preview
  const generateRobotsPreview = () => {
    let content = "# Robots.txt\n\n";
    
    if (robots.allowAllCrawlers) {
      content += "User-agent: *\nAllow: /\n";
      robots.disallowedPaths.forEach((path) => {
        content += `Disallow: ${path}\n`;
      });
      content += "\n";
    }

    if (robots.allowGooglebot) {
      content += "User-agent: Googlebot\nAllow: /\n\n";
    }
    if (robots.allowBingbot) {
      content += "User-agent: Bingbot\nAllow: /\n\n";
    }
    if (robots.allowTwitterbot) {
      content += "User-agent: Twitterbot\nAllow: /\n\n";
    }
    if (robots.allowFacebookbot) {
      content += "User-agent: facebookexternalhit\nAllow: /\n\n";
    }
    if (robots.allowGPTBot) {
      content += "User-agent: GPTBot\nAllow: /\n\n";
    }
    if (robots.allowPerplexityBot) {
      content += "User-agent: PerplexityBot\nAllow: /\n\n";
    }
    if (robots.allowClaudeBot) {
      content += "User-agent: Claude-Web\nAllow: /\n\nUser-agent: Anthropic-AI\nAllow: /\n\n";
    }

    if (robots.customRules) {
      content += `# Custom Rules\n${robots.customRules}\n\n`;
    }

    content += `# Sitemap\nSitemap: ${sitemap.siteUrl}/sitemap.xml`;
    
    return content;
  };

  const isLoading = robotsLoading || sitemapLoading;
  const isUpdating = robotsUpdating || sitemapUpdating;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Sitemap & Robots</h1>
          <p className="text-muted-foreground mt-1">Configure sitemap.xml and robots.txt for search engines</p>
        </div>

        <Tabs defaultValue="robots" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="robots" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Robots.txt
            </TabsTrigger>
            <TabsTrigger value="sitemap" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Sitemap
            </TabsTrigger>
          </TabsList>

          {/* Robots.txt Tab */}
          <TabsContent value="robots" className="space-y-6 mt-6">
            <div className="flex justify-end">
              <Button onClick={handleSaveRobots} disabled={isUpdating}>
                {robotsUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Robots Settings
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Crawler Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Engine Crawlers</CardTitle>
                  <CardDescription>Control which crawlers can access your site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowAll">Allow All Crawlers</Label>
                    <Switch
                      id="allowAll"
                      checked={robots.allowAllCrawlers}
                      onCheckedChange={(checked) => setRobots({ ...robots, allowAllCrawlers: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="googlebot">Googlebot</Label>
                    <Switch
                      id="googlebot"
                      checked={robots.allowGooglebot}
                      onCheckedChange={(checked) => setRobots({ ...robots, allowGooglebot: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bingbot">Bingbot</Label>
                    <Switch
                      id="bingbot"
                      checked={robots.allowBingbot}
                      onCheckedChange={(checked) => setRobots({ ...robots, allowBingbot: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twitterbot">Twitterbot</Label>
                    <Switch
                      id="twitterbot"
                      checked={robots.allowTwitterbot}
                      onCheckedChange={(checked) => setRobots({ ...robots, allowTwitterbot: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="facebookbot">Facebook Bot</Label>
                    <Switch
                      id="facebookbot"
                      checked={robots.allowFacebookbot}
                      onCheckedChange={(checked) => setRobots({ ...robots, allowFacebookbot: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* AI Crawlers */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Crawlers</CardTitle>
                  <CardDescription>Allow AI bots to index your content for visibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="gptbot">GPTBot (OpenAI)</Label>
                      <p className="text-xs text-muted-foreground">Used for ChatGPT training</p>
                    </div>
                    <Switch
                      id="gptbot"
                      checked={robots.allowGPTBot}
                      onCheckedChange={(checked) => setRobots({ ...robots, allowGPTBot: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="perplexitybot">PerplexityBot</Label>
                      <p className="text-xs text-muted-foreground">Perplexity AI search</p>
                    </div>
                    <Switch
                      id="perplexitybot"
                      checked={robots.allowPerplexityBot}
                      onCheckedChange={(checked) => setRobots({ ...robots, allowPerplexityBot: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="claudebot">Claude (Anthropic)</Label>
                      <p className="text-xs text-muted-foreground">Anthropic AI crawler</p>
                    </div>
                    <Switch
                      id="claudebot"
                      checked={robots.allowClaudeBot}
                      onCheckedChange={(checked) => setRobots({ ...robots, allowClaudeBot: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Disallowed Paths */}
              <Card>
                <CardHeader>
                  <CardTitle>Disallowed Paths</CardTitle>
                  <CardDescription>Paths that crawlers should not access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newPath}
                      onChange={(e) => setNewPath(e.target.value)}
                      placeholder="/admin/"
                      onKeyDown={(e) => e.key === 'Enter' && addDisallowedPath()}
                    />
                    <Button onClick={addDisallowedPath} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {robots.disallowedPaths.map((path) => (
                      <div key={path} className="flex items-center justify-between p-2 bg-muted rounded">
                        <code className="text-sm">{path}</code>
                        <Button variant="ghost" size="icon" onClick={() => removeDisallowedPath(path)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Rules */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom Rules</CardTitle>
                  <CardDescription>Add additional robots.txt directives</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={robots.customRules}
                    onChange={(e) => setRobots({ ...robots, customRules: e.target.value })}
                    placeholder="User-agent: CustomBot&#10;Disallow: /private/"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Robots.txt Preview</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateRobotsPreview(), 'robots')}
                  >
                    {copied === 'robots' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                  {generateRobotsPreview()}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sitemap Tab */}
          <TabsContent value="sitemap" className="space-y-6 mt-6">
            <div className="flex justify-end">
              <Button onClick={handleSaveSitemap} disabled={isUpdating}>
                {sitemapUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Sitemap Settings
              </Button>
            </div>

            {/* Sitemap Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Configuration</CardTitle>
                <CardDescription>Configure your XML sitemap for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Site URL</Label>
                    <Input
                      value={sitemap.siteUrl}
                      onChange={(e) => setSitemap({ ...sitemap, siteUrl: e.target.value })}
                      placeholder="https://canvascartel.in"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dynamic Sitemap URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={`https://dsuvcvbtxdftlbhuvsnv.supabase.co/functions/v1/generate-sitemap`}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open('https://dsuvcvbtxdftlbhuvsnv.supabase.co/functions/v1/generate-sitemap', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Include Service Pages</Label>
                      <p className="text-xs text-muted-foreground">Auto-include /services/:id pages</p>
                    </div>
                    <Switch
                      checked={sitemap.includeServices}
                      onCheckedChange={(checked) => setSitemap({ ...sitemap, includeServices: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Include Project Pages</Label>
                      <p className="text-xs text-muted-foreground">Auto-include /projects/:id pages</p>
                    </div>
                    <Switch
                      checked={sitemap.includeProjects}
                      onCheckedChange={(checked) => setSitemap({ ...sitemap, includeProjects: checked })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Service Pages Priority</Label>
                    <Select
                      value={sitemap.servicePriority}
                      onValueChange={(value) => setSitemap({ ...sitemap, servicePriority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Project Pages Priority</Label>
                    <Select
                      value={sitemap.projectPriority}
                      onValueChange={(value) => setSitemap({ ...sitemap, projectPriority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Static Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Static Pages</span>
                  <Button variant="outline" size="sm" onClick={addSitemapPage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Page
                  </Button>
                </CardTitle>
                <CardDescription>Configure which pages to include in the sitemap</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sitemap.pages.map((page, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Switch
                        checked={page.enabled}
                        onCheckedChange={(checked) => updateSitemapPage(index, 'enabled', checked)}
                      />
                      <Input
                        value={page.path}
                        onChange={(e) => updateSitemapPage(index, 'path', e.target.value)}
                        className="flex-1 max-w-[200px]"
                        placeholder="/page"
                      />
                      <Select
                        value={page.priority}
                        onValueChange={(value) => updateSitemapPage(index, 'priority', value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={page.changefreq}
                        onValueChange={(value) => updateSitemapPage(index, 'changefreq', value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map((f) => (
                            <SelectItem key={f} value={f}>{f}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSitemapPage(index)}
                        disabled={sitemap.pages.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your dynamic sitemap is generated automatically and includes all configured pages, 
                  services, and projects. Access it at:
                </p>
                <div className="flex gap-2">
                  <Input
                    value={`https://dsuvcvbtxdftlbhuvsnv.supabase.co/functions/v1/generate-sitemap`}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard('https://dsuvcvbtxdftlbhuvsnv.supabase.co/functions/v1/generate-sitemap', 'sitemap')}
                  >
                    {copied === 'sitemap' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Submit this URL to Google Search Console and Bing Webmaster Tools for indexing.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SitemapRobotsAdmin;
