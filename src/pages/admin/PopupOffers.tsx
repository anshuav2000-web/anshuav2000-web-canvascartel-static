import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSiteContent, PopupOfferContent, defaultPopupOfferContent } from '@/hooks/useSiteContent';
import { useState, useEffect } from 'react';
import { Save, Upload, X, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const availablePages = [
  { value: '/', label: 'Home' },
  { value: '/about', label: 'About' },
  { value: '/services', label: 'Services' },
  { value: '/projects', label: 'Projects' },
  { value: '/contact', label: 'Contact' },
  { value: '*', label: 'All Pages' },
];

const PopupOffersAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<PopupOfferContent>('popup-offer');
  const [content, setContent] = useState<PopupOfferContent>(defaultPopupOfferContent);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  const handleSave = () => {
    updateContent(content);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `popup-offer-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file);

    if (uploadError) {
      toast.error('Failed to upload image');
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);

    setContent({ ...content, imageUrl: publicUrl.publicUrl });
    setUploading(false);
    toast.success('Image uploaded');
  };

  const togglePage = (page: string) => {
    const currentPages = content.showOnPages || [];
    if (currentPages.includes(page)) {
      setContent({ ...content, showOnPages: currentPages.filter(p => p !== page) });
    } else {
      setContent({ ...content, showOnPages: [...currentPages, page] });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Popup Offers</h1>
            <p className="text-muted-foreground mt-1">Manage promotional popup offers</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Enable/Disable Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Popup Status</CardTitle>
            <CardDescription>Enable or disable the popup offer on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Popup Offer</p>
                <p className="text-sm text-muted-foreground">
                  {content.enabled ? 'Popup is active and will show to visitors' : 'Popup is disabled'}
                </p>
              </div>
              <Switch
                checked={content.enabled}
                onCheckedChange={(checked) => setContent({ ...content, enabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Popup Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  placeholder="Special Offer!"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subtitle</label>
                <Input
                  value={content.subtitle}
                  onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                  placeholder="Limited Time Only"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={content.description}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                placeholder="Describe your offer..."
                rows={3}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Button Text</label>
                <Input
                  value={content.buttonText}
                  onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                  placeholder="Claim Offer"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Button Link</label>
                <Input
                  value={content.buttonLink}
                  onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
                  placeholder="/contact"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Discount Code (Optional)</label>
              <Input
                value={content.discountCode}
                onChange={(e) => setContent({ ...content, discountCode: e.target.value })}
                placeholder="SAVE20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to hide the discount code section
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Popup Image</CardTitle>
            <CardDescription>Optional image to display alongside the offer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.imageUrl && (
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-border">
                <img
                  src={content.imageUrl}
                  alt="Popup"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setContent({ ...content, imageUrl: '' })}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button variant="outline" disabled={uploading} asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Show on Pages</label>
              <div className="flex flex-wrap gap-2">
                {availablePages.map((page) => (
                  <Button
                    key={page.value}
                    variant={content.showOnPages?.includes(page.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePage(page.value)}
                  >
                    {page.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Delay (Seconds)</label>
                <Input
                  type="number"
                  min="0"
                  value={content.delaySeconds}
                  onChange={(e) => setContent({ ...content, delaySeconds: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Time before popup appears after page load
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Expiry Date (Optional)</label>
                <Input
                  type="date"
                  value={content.expiryDate}
                  onChange={(e) => setContent({ ...content, expiryDate: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Popup won't show after this date
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="font-medium">Show Once Per Session</p>
                <p className="text-sm text-muted-foreground">
                  Only show popup once per browser session
                </p>
              </div>
              <Switch
                checked={content.showOncePerSession}
                onCheckedChange={(checked) => setContent({ ...content, showOncePerSession: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Styling */}
        <Card>
          <CardHeader>
            <CardTitle>Styling</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium mb-2 block">Background Color (Optional)</label>
              <div className="flex gap-3">
                <Input
                  value={content.backgroundColor}
                  onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })}
                  placeholder="Leave empty for default theme color"
                />
                <input
                  type="color"
                  value={content.backgroundColor || '#1a1a2e'}
                  onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: content.backgroundColor || 'hsl(var(--card))' }}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col md:flex-row">
              {content.imageUrl && (
                <div className="md:w-2/5 h-48 md:h-auto">
                  <img src={content.imageUrl} alt="Offer" className="w-full h-full object-cover" />
                </div>
              )}
              <div className={`p-8 ${content.imageUrl ? 'md:w-3/5' : 'w-full'} flex flex-col items-center text-center`}>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-3xl">🎁</span>
                </div>
                {content.subtitle && (
                  <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">
                    {content.subtitle}
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">{content.title}</h2>
                <p className="text-muted-foreground mb-6">{content.description}</p>
                {content.discountCode && (
                  <div className="w-full mb-6">
                    <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary/10 border-2 border-dashed border-primary/30">
                      <span className="text-xl font-mono font-bold text-primary tracking-wider">
                        {content.discountCode}
                      </span>
                    </div>
                  </div>
                )}
                <Button variant="hero" size="lg" className="w-full">{content.buttonText}</Button>
                <button className="mt-4 text-sm text-muted-foreground">No thanks, I'll pass</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default PopupOffersAdmin;
