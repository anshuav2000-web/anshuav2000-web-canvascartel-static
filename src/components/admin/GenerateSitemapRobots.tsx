import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileCode, Map, Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSidebar } from "@/components/ui/sidebar";

interface GenerationResult {
  type: 'sitemap' | 'robots';
  success: boolean;
  message: string;
  url?: string;
}

export function GenerateSitemapRobots() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const generateFiles = async () => {
    setIsGenerating(true);
    setResults([]);
    
    const newResults: GenerationResult[] = [];

    try {
      // Generate Sitemap
      const sitemapResponse = await supabase.functions.invoke('generate-sitemap');
      
      if (sitemapResponse.error) {
        newResults.push({
          type: 'sitemap',
          success: false,
          message: sitemapResponse.error.message || 'Failed to generate sitemap',
        });
      } else {
        newResults.push({
          type: 'sitemap',
          success: true,
          message: 'Sitemap generated successfully',
          url: 'https://dsuvcvbtxdftlbhuvsnv.supabase.co/functions/v1/generate-sitemap',
        });
      }
    } catch (error) {
      newResults.push({
        type: 'sitemap',
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate sitemap',
      });
    }

    try {
      // Generate Robots.txt
      const robotsResponse = await supabase.functions.invoke('generate-robots');
      
      if (robotsResponse.error) {
        newResults.push({
          type: 'robots',
          success: false,
          message: robotsResponse.error.message || 'Failed to generate robots.txt',
        });
      } else {
        newResults.push({
          type: 'robots',
          success: true,
          message: 'Robots.txt generated successfully',
          url: 'https://dsuvcvbtxdftlbhuvsnv.supabase.co/functions/v1/generate-robots',
        });
      }
    } catch (error) {
      newResults.push({
        type: 'robots',
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate robots.txt',
      });
    }

    setResults(newResults);
    setIsGenerating(false);

    const allSuccess = newResults.every(r => r.success);
    if (allSuccess) {
      toast.success("Sitemap & Robots.txt generated successfully!");
    } else {
      toast.error("Some files failed to generate. Check details.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <RefreshCw className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Generate Files</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border">
        <DialogHeader>
          <DialogTitle>Generate Sitemap & Robots.txt</DialogTitle>
          <DialogDescription>
            Regenerate your sitemap.xml and robots.txt files with the latest content from your website.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Map className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium">Sitemap.xml</span>
              <span className="text-xs text-muted-foreground">All pages & URLs</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <FileCode className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium">Robots.txt</span>
              <span className="text-xs text-muted-foreground">Crawler rules</span>
            </div>
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    result.success ? 'bg-primary/10 border border-primary/20' : 'bg-destructive/10 border border-destructive/20'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">{result.type}</p>
                    <p className="text-xs text-muted-foreground">{result.message}</p>
                  </div>
                  {result.success && result.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(result.url, '_blank')}
                    >
                      View
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={generateFiles}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Updated Files
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            These files are dynamically generated from your database settings. 
            Use the links in SEO settings to submit to search engines.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
