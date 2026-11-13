import { useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Loader2, Upload, Trash2, ImageIcon } from "lucide-react";
import { useSiteContent, BrandingContent, defaultBrandingContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BrandingAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<BrandingContent>('branding');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  
  const [branding, setBranding] = useState<BrandingContent>(data || defaultBrandingContent);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Update local state when data loads
  useState(() => {
    if (data) {
      setBranding(data);
    }
  });

  const handleSave = async () => {
    try {
      await updateContent(branding);
      toast.success("Branding settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save branding settings");
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'favicon'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isLogo = type === 'logo';
    const setUploading = isLogo ? setUploadingLogo : setUploadingFavicon;
    const inputRef = isLogo ? logoInputRef : faviconInputRef;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, SVG, WebP, or ICO image");
      return;
    }

    // Validate file size
    const maxSize = isLogo ? 2 * 1024 * 1024 : 512 * 1024; // 2MB for logo, 512KB for favicon
    if (file.size > maxSize) {
      toast.error(`${isLogo ? 'Logo' : 'Favicon'} file must be less than ${isLogo ? '2MB' : '512KB'}`);
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setBranding({
        ...branding,
        [isLogo ? 'logoUrl' : 'faviconUrl']: publicUrlData.publicUrl,
      });

      toast.success(`${isLogo ? 'Logo' : 'Favicon'} uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${type}`);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = (type: 'logo' | 'favicon') => {
    setBranding({
      ...branding,
      [type === 'logo' ? 'logoUrl' : 'faviconUrl']: '',
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Branding</h1>
            <p className="text-muted-foreground mt-1">Manage your website logo, favicon and brand identity</p>
          </div>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Website Logo</CardTitle>
            <CardDescription>
              Upload your logo to display in the navigation bar and footer. Recommended size: 200x50px. Supports PNG, JPG, SVG, or WebP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Logo Preview */}
            <div className="space-y-2">
              <Label>Current Logo</Label>
              <div className="border border-border rounded-lg p-6 bg-muted/30">
                {branding.logoUrl ? (
                  <div className="flex items-center gap-6">
                    <div className="bg-background p-4 rounded-lg border border-border">
                      <img 
                        src={branding.logoUrl} 
                        alt="Website logo" 
                        className="max-h-16 max-w-[200px] object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Logo is set</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove('logo')}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Logo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm">No logo uploaded</p>
                    <p className="text-xs mt-1">Text logo "{branding.siteName}" will be displayed</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="space-y-2">
              <Label>Upload New Logo</Label>
              <div className="flex items-center gap-4">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                  className="hidden"
                  id="logo-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                >
                  {uploadingLogo ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {uploadingLogo ? "Uploading..." : "Choose File"}
                </Button>
                <p className="text-sm text-muted-foreground">Max file size: 2MB</p>
              </div>
            </div>

            {/* Site Name */}
            <div className="space-y-2">
              <Label>Site Name (Text Fallback)</Label>
              <Input
                value={branding.siteName}
                onChange={(e) => setBranding({ ...branding, siteName: e.target.value })}
                placeholder="Canvas Cartel"
              />
              <p className="text-sm text-muted-foreground">
                This text is used when no logo image is uploaded, and for SEO purposes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Favicon Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Website Favicon</CardTitle>
            <CardDescription>
              Upload a favicon to display in browser tabs. Recommended size: 32x32px or 64x64px. Supports PNG, ICO, SVG, or WebP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Favicon Preview */}
            <div className="space-y-2">
              <Label>Current Favicon</Label>
              <div className="border border-border rounded-lg p-6 bg-muted/30">
                {branding.faviconUrl ? (
                  <div className="flex items-center gap-6">
                    <div className="bg-background p-4 rounded-lg border border-border">
                      <img 
                        src={branding.faviconUrl} 
                        alt="Website favicon" 
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Favicon is set</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove('favicon')}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Favicon
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 mb-3 opacity-50" />
                    <p className="text-sm">No favicon uploaded</p>
                    <p className="text-xs mt-1">Default browser favicon will be used</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="space-y-2">
              <Label>Upload New Favicon</Label>
              <div className="flex items-center gap-4">
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/webp"
                  onChange={(e) => handleFileUpload(e, 'favicon')}
                  className="hidden"
                  id="favicon-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={uploadingFavicon}
                >
                  {uploadingFavicon ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {uploadingFavicon ? "Uploading..." : "Choose File"}
                </Button>
                <p className="text-sm text-muted-foreground">Max file size: 512KB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BrandingAdmin;
