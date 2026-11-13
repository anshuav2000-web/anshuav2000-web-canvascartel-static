import { useState, useRef, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Loader2, Upload, Trash2, ImageIcon, Sun, Moon } from "lucide-react";
import { useSiteContent, BrandingContent, defaultBrandingContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LogoAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<BrandingContent>('branding');
  const lightLogoInputRef = useRef<HTMLInputElement>(null);
  const darkLogoInputRef = useRef<HTMLInputElement>(null);
  
  const [branding, setBranding] = useState<BrandingContent>(data || defaultBrandingContent);
  const [uploadingLight, setUploadingLight] = useState(false);
  const [uploadingDark, setUploadingDark] = useState(false);

  useEffect(() => {
    if (data) {
      setBranding(data);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateContent(branding);
      toast.success("Logo saved successfully!");
    } catch (error) {
      toast.error("Failed to save logo");
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    variant: 'light' | 'dark'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, SVG, or WebP image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file must be less than 2MB");
      return;
    }

    const setUploading = variant === 'light' ? setUploadingLight : setUploadingDark;
    const inputRef = variant === 'light' ? lightLogoInputRef : darkLogoInputRef;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${variant}-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setBranding({
        ...branding,
        [variant === 'light' ? 'logoUrl' : 'logoUrlDark']: publicUrlData.publicUrl,
      });

      toast.success(`${variant === 'light' ? 'Light' : 'Dark'} mode logo uploaded!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = (variant: 'light' | 'dark') => {
    setBranding({
      ...branding,
      [variant === 'light' ? 'logoUrl' : 'logoUrlDark']: '',
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

  const LogoUploadSection = ({ 
    variant, 
    logoUrl, 
    uploading, 
    inputRef 
  }: { 
    variant: 'light' | 'dark'; 
    logoUrl: string; 
    uploading: boolean; 
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {variant === 'light' ? (
          <Sun className="h-4 w-4 text-amber-500" />
        ) : (
          <Moon className="h-4 w-4 text-blue-400" />
        )}
        <Label className="text-base font-medium">
          {variant === 'light' ? 'Light Mode Logo' : 'Dark Mode Logo'}
        </Label>
      </div>
      
      <div className={`border border-border rounded-lg p-4 ${variant === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}>
        {logoUrl ? (
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg border ${variant === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}>
              <img 
                src={logoUrl} 
                alt={`${variant} mode logo`} 
                className="max-h-12 max-w-[160px] object-contain"
              />
            </div>
            <div className="flex-1">
              <p className={`text-sm mb-2 ${variant === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
                Logo set for {variant} mode
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveLogo(variant)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center py-6 ${variant === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>
            <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">No {variant} mode logo</p>
            <p className="text-xs mt-1">
              {variant === 'dark' ? 'Will use light logo if not set' : 'Upload a logo for light backgrounds'}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={(e) => handleFileUpload(e, variant)}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {uploading ? "Uploading..." : "Upload Logo"}
        </Button>
        <p className="text-sm text-muted-foreground">PNG, JPG, SVG, or WebP. Max 2MB.</p>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Site Logo</h1>
            <p className="text-muted-foreground mt-1">
              Upload different logos for light and dark themes
            </p>
          </div>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {/* Logo Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Logo Variants</CardTitle>
            <CardDescription>
              Upload separate logos for light and dark mode. The appropriate logo will be shown based on the user's theme preference.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <LogoUploadSection 
              variant="light" 
              logoUrl={branding.logoUrl} 
              uploading={uploadingLight}
              inputRef={lightLogoInputRef}
            />
            
            <div className="border-t border-border" />
            
            <LogoUploadSection 
              variant="dark" 
              logoUrl={branding.logoUrlDark || ''} 
              uploading={uploadingDark}
              inputRef={darkLogoInputRef}
            />
          </CardContent>
        </Card>

        {/* Site Name Fallback */}
        <Card>
          <CardHeader>
            <CardTitle>Site Name</CardTitle>
            <CardDescription>
              This text is displayed when no logo image is uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={branding.siteName}
              onChange={(e) => setBranding({ ...branding, siteName: e.target.value })}
              placeholder="Your Site Name"
            />
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See how your logos will appear in different themes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Light Mode Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <Label className="text-xs text-muted-foreground">Light Mode</Label>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  {branding.logoUrl ? (
                    <img 
                      src={branding.logoUrl} 
                      alt={branding.siteName} 
                      className="h-8 max-w-[150px] object-contain"
                    />
                  ) : (
                    <span className="font-display font-bold text-xl text-gray-900">
                      {branding.siteName}
                    </span>
                  )}
                </div>
              </div>

              {/* Dark Mode Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-blue-400" />
                  <Label className="text-xs text-muted-foreground">Dark Mode</Label>
                </div>
                <div className="border border-zinc-700 rounded-lg p-4 bg-zinc-900">
                  {(branding.logoUrlDark || branding.logoUrl) ? (
                    <img 
                      src={branding.logoUrlDark || branding.logoUrl} 
                      alt={branding.siteName} 
                      className="h-8 max-w-[150px] object-contain"
                    />
                  ) : (
                    <span className="font-display font-bold text-xl text-white">
                      {branding.siteName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default LogoAdmin;
