import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useSiteContent, LoadingPageContent, defaultLoadingPageContent, BrandingContent, defaultBrandingContent } from '@/hooks/useSiteContent';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Loader2, Eye, Save, Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const LoadingPageAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<LoadingPageContent>('loading-page');
  const { data: branding } = useSiteContent<BrandingContent>('branding');
  const [content, setContent] = useState<LoadingPageContent>(defaultLoadingPageContent);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const siteName = branding?.siteName || defaultBrandingContent.siteName;
  const defaultLogoUrl = branding?.logoUrl || '';
  
  // Use custom logo if enabled, otherwise fall back to branding logo
  const displayLogoUrl = content.useCustomLogo && content.customLogoUrl 
    ? content.customLogoUrl 
    : defaultLogoUrl;

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  const handleSave = async () => {
    await updateContent(content);
  };

  const handlePreview = () => {
    setShowPreview(true);
    setTimeout(() => setShowPreview(false), content.duration + 200);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PNG, JPG, SVG, or WebP file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `loading-logo-${Date.now()}.${fileExt}`;
      const filePath = `loading/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setContent({ 
        ...content, 
        customLogoUrl: publicUrl,
        useCustomLogo: true
      });
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = () => {
    setContent({ 
      ...content, 
      customLogoUrl: '',
      useCustomLogo: false
    });
  };

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
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Loading Page</h1>
            <p className="text-muted-foreground mt-1">
              Customize the loading screen that appears during page transitions
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Enable/Disable */}
          <Card>
            <CardHeader>
              <CardTitle>Loading Screen Status</CardTitle>
              <CardDescription>Enable or disable the loading screen on page transitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Enable Loading Screen</Label>
                <Switch
                  id="enabled"
                  checked={content.enabled}
                  onCheckedChange={(checked) => setContent({ ...content, enabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Loading Logo</CardTitle>
              <CardDescription>Upload a custom logo for the loading screen or use your site logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Use Custom Logo</Label>
                  <p className="text-sm text-muted-foreground">Use a different logo than your site logo</p>
                </div>
                <Switch
                  checked={content.useCustomLogo}
                  onCheckedChange={(checked) => setContent({ ...content, useCustomLogo: checked })}
                />
              </div>

              {content.useCustomLogo && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {content.customLogoUrl ? (
                      <div className="relative group">
                        <div className="w-32 h-20 rounded-lg border border-border bg-secondary/50 flex items-center justify-center p-2">
                          <img
                            src={content.customLogoUrl}
                            alt="Custom loading logo"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={handleRemoveLogo}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-32 h-20 rounded-lg border-2 border-dashed border-border bg-secondary/30 flex items-center justify-center">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {content.customLogoUrl ? 'Change Logo' : 'Upload Logo'}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG, SVG or WebP. Max 2MB.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!content.useCustomLogo && defaultLogoUrl && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Using site logo:</p>
                  <img
                    src={defaultLogoUrl}
                    alt="Site logo"
                    className="h-12 max-w-[150px] object-contain"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Display Options */}
          <Card>
            <CardHeader>
              <CardTitle>Display Options</CardTitle>
              <CardDescription>Choose what elements to show on the loading screen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Logo</Label>
                  <p className="text-sm text-muted-foreground">Display your site logo or name</p>
                </div>
                <Switch
                  checked={content.showLogo}
                  onCheckedChange={(checked) => setContent({ ...content, showLogo: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Loading Bar</Label>
                  <p className="text-sm text-muted-foreground">Display animated progress bar</p>
                </div>
                <Switch
                  checked={content.showLoadingBar}
                  onCheckedChange={(checked) => setContent({ ...content, showLoadingBar: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Loading Text</Label>
                  <p className="text-sm text-muted-foreground">Display loading text below the logo</p>
                </div>
                <Switch
                  checked={content.showLoadingText}
                  onCheckedChange={(checked) => setContent({ ...content, showLoadingText: checked })}
                />
              </div>

              {content.showLoadingText && (
                <div className="space-y-2">
                  <Label htmlFor="loadingText">Loading Text</Label>
                  <Input
                    id="loadingText"
                    value={content.loadingText}
                    onChange={(e) => setContent({ ...content, loadingText: e.target.value })}
                    placeholder="Loading..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Animation Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Animation Settings</CardTitle>
              <CardDescription>Configure logo animation and timing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Logo Size</Label>
                <Select
                  value={content.logoSize || 'medium'}
                  onValueChange={(value: 'small' | 'medium' | 'large' | 'xlarge') => 
                    setContent({ ...content, logoSize: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="xlarge">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Logo Animation Type</Label>
                <Select
                  value={content.animationType}
                  onValueChange={(value: 'pulse' | 'float' | 'none') => 
                    setContent({ ...content, animationType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pulse">Pulse (Scale + Glow)</SelectItem>
                    <SelectItem value="float">Float (Up & Down)</SelectItem>
                    <SelectItem value="none">No Animation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Loading Duration</Label>
                  <span className="text-sm text-muted-foreground">{content.duration}ms</span>
                </div>
                <Slider
                  value={[content.duration]}
                  onValueChange={(value) => setContent({ ...content, duration: value[0] })}
                  min={200}
                  max={1000}
                  step={50}
                />
                <p className="text-xs text-muted-foreground">
                  How long the loading screen is visible (200ms - 1000ms)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Colors (Optional)</CardTitle>
              <CardDescription>Override default theme colors for the loading screen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={content.backgroundColor || '#0a0a0a'}
                      onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={content.backgroundColor}
                      onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })}
                      placeholder="Leave empty for default"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="glowColor">Glow Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="glowColor"
                      type="color"
                      value={content.glowColor || '#dc2626'}
                      onChange={(e) => setContent({ ...content, glowColor: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={content.glowColor}
                      onChange={(e) => setContent({ ...content, glowColor: e.target.value })}
                      placeholder="Leave empty for default"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave fields empty to use your theme's default colors
              </p>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your loading screen will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="relative rounded-lg overflow-hidden h-64 flex items-center justify-center"
                style={{ 
                  backgroundColor: content.backgroundColor || 'hsl(var(--background))'
                }}
              >
                <div className="flex flex-col items-center gap-6">
                  {content.showLogo && (
                    <div className="relative">
                      {displayLogoUrl ? (
                        <img
                          src={displayLogoUrl}
                          alt={siteName}
                          className={`object-contain ${
                            content.animationType === 'pulse' ? 'animate-pulse-logo' : 
                            content.animationType === 'float' ? 'animate-logo-float' : ''
                          } ${
                            content.logoSize === 'small' ? 'h-10 max-w-[120px]' :
                            content.logoSize === 'large' ? 'h-20 max-w-[280px]' :
                            content.logoSize === 'xlarge' ? 'h-28 max-w-[360px]' :
                            'h-16 max-w-[200px]'
                          }`}
                        />
                      ) : (
                        <span 
                          className={`font-display font-bold text-gradient ${
                            content.animationType === 'pulse' ? 'animate-pulse-logo' : 
                            content.animationType === 'float' ? 'animate-logo-float' : ''
                          } ${
                            content.logoSize === 'small' ? 'text-2xl' :
                            content.logoSize === 'large' ? 'text-4xl' :
                            content.logoSize === 'xlarge' ? 'text-5xl' :
                            'text-3xl'
                          }`}
                        >
                          {siteName}
                        </span>
                      )}
                      
                      {content.animationType === 'pulse' && (
                        <div 
                          className="absolute inset-0 -z-10 blur-2xl opacity-50"
                          style={{ backgroundColor: content.glowColor || 'hsl(var(--primary) / 0.3)' }}
                        />
                      )}
                    </div>
                  )}

                  {content.showLoadingBar && (
                    <div className="w-32 h-1 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-loading-bar" />
                    </div>
                  )}

                  {content.showLoadingText && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                      {content.loadingText}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Preview Overlay */}
      {showPreview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300"
          style={{ 
            backgroundColor: content.backgroundColor || 'hsl(var(--background))'
          }}
        >
          <div className="flex flex-col items-center gap-6">
            {content.showLogo && (
              <div className="relative">
                {displayLogoUrl ? (
                  <img
                    src={displayLogoUrl}
                    alt={siteName}
                    className={`h-16 sm:h-20 max-w-[200px] object-contain ${
                      content.animationType === 'pulse' ? 'animate-pulse-logo' : 
                      content.animationType === 'float' ? 'animate-logo-float' : ''
                    }`}
                  />
                ) : (
                  <span 
                    className={`text-3xl sm:text-4xl font-display font-bold text-gradient ${
                      content.animationType === 'pulse' ? 'animate-pulse-logo' : 
                      content.animationType === 'float' ? 'animate-logo-float' : ''
                    }`}
                  >
                    {siteName}
                  </span>
                )}
                
                {content.animationType === 'pulse' && (
                  <div className="absolute inset-0 -z-10 blur-2xl opacity-50">
                    <div 
                      className="w-full h-full rounded-full animate-pulse-slow" 
                      style={{ backgroundColor: content.glowColor || 'hsl(var(--primary) / 0.3)' }}
                    />
                  </div>
                )}
              </div>
            )}

            {content.showLoadingBar && (
              <div className="w-32 sm:w-48 h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-loading-bar" />
              </div>
            )}

            {content.showLoadingText && (
              <p className="text-sm text-muted-foreground animate-pulse">
                {content.loadingText}
              </p>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default LoadingPageAdmin;
