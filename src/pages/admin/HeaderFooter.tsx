import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, Plus, Trash2, Instagram, Twitter, Linkedin, Facebook, Youtube, Github, Globe, GripVertical } from "lucide-react";
import { 
  useSiteContent, 
  HeaderContent, 
  FooterContent,
  defaultHeaderContent,
  defaultFooterContent,
} from "@/hooks/useSiteContent";
import { toast } from "sonner";

const socialPlatforms = [
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "Twitter", label: "Twitter / X", icon: Twitter },
  { value: "LinkedIn", label: "LinkedIn", icon: Linkedin },
  { value: "Facebook", label: "Facebook", icon: Facebook },
  { value: "Youtube", label: "YouTube", icon: Youtube },
  { value: "Github", label: "GitHub", icon: Github },
  { value: "Website", label: "Website", icon: Globe },
] as const;

interface HeaderFooterContent {
  header: HeaderContent;
  footer: FooterContent;
}

const defaultContent: HeaderFooterContent = {
  header: defaultHeaderContent,
  footer: defaultFooterContent,
};

const HeaderFooterAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<HeaderFooterContent>('header-footer');
  
  const [content, setContent] = useState<HeaderFooterContent>(defaultContent);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Properly sync state when data loads
  useEffect(() => {
    if (data && !hasInitialized) {
      setContent({
        header: data.header || defaultHeaderContent,
        footer: data.footer || defaultFooterContent,
      });
      setHasInitialized(true);
    }
  }, [data, hasInitialized]);

  const handleSave = async () => {
    try {
      await updateContent(content);
      toast.success("Header & Footer settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  // Header functions
  const addNavLink = () => {
    setContent({
      ...content,
      header: {
        ...content.header,
        navLinks: [
          ...content.header.navLinks,
          { id: Date.now().toString(), name: 'New Link', path: '/' },
        ],
      },
    });
  };

  const removeNavLink = (id: string) => {
    setContent({
      ...content,
      header: {
        ...content.header,
        navLinks: content.header.navLinks.filter((l) => l.id !== id),
      },
    });
  };

  const updateNavLink = (id: string, field: 'name' | 'path', value: string) => {
    setContent({
      ...content,
      header: {
        ...content.header,
        navLinks: content.header.navLinks.map((l) =>
          l.id === id ? { ...l, [field]: value } : l
        ),
      },
    });
  };

  // Footer functions
  const addSocialLink = () => {
    setContent({
      ...content,
      footer: {
        ...content.footer,
        socialLinks: [
          ...content.footer.socialLinks,
          { id: Date.now().toString(), platform: 'Instagram', url: '' },
        ],
      },
    });
  };

  const removeSocialLink = (id: string) => {
    setContent({
      ...content,
      footer: {
        ...content.footer,
        socialLinks: content.footer.socialLinks.filter((l) => l.id !== id),
      },
    });
  };

  const updateSocialLink = (id: string, field: 'platform' | 'url', value: string) => {
    setContent({
      ...content,
      footer: {
        ...content.footer,
        socialLinks: content.footer.socialLinks.map((l) =>
          l.id === id ? { ...l, [field]: value } : l
        ),
      },
    });
  };

  const addServiceLink = () => {
    setContent({
      ...content,
      footer: {
        ...content.footer,
        servicesLinks: [...content.footer.servicesLinks, 'New Service'],
      },
    });
  };

  const removeServiceLink = (index: number) => {
    setContent({
      ...content,
      footer: {
        ...content.footer,
        servicesLinks: content.footer.servicesLinks.filter((_, i) => i !== index),
      },
    });
  };

  const updateServiceLink = (index: number, value: string) => {
    setContent({
      ...content,
      footer: {
        ...content.footer,
        servicesLinks: content.footer.servicesLinks.map((s, i) => (i === index ? value : s)),
      },
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
            <h1 className="text-3xl font-display font-bold">Header & Footer</h1>
            <p className="text-muted-foreground mt-1">Manage navigation and footer content</p>
          </div>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {/* Header Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Header Navigation</CardTitle>
            <CardDescription>Manage the main navigation links in the header. Add, edit, or remove menu items.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Navigation Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Navigation Links</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {content.header.navLinks.length} link(s) configured
                  </p>
                </div>
                <Button variant="default" size="sm" onClick={addNavLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Link
                </Button>
              </div>
              
              {content.header.navLinks.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">No navigation links yet. Click "Add Menu Link" to create one.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {content.header.navLinks.map((link, index) => (
                    <div key={link.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Menu Name</Label>
                          <Input
                            value={link.name}
                            onChange={(e) => updateNavLink(link.id, 'name', e.target.value)}
                            placeholder="e.g., About Us"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Path / URL</Label>
                          <Input
                            value={link.path}
                            onChange={(e) => updateNavLink(link.id, 'path', e.target.value)}
                            placeholder="e.g., /about"
                            className="bg-background"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNavLink(link.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* CTA Button */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Button Text</Label>
                <Input
                  value={content.header.ctaText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      header: { ...content.header, ctaText: e.target.value },
                    })
                  }
                  placeholder="Get Started"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Button Link</Label>
                <Input
                  value={content.header.ctaLink}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      header: { ...content.header, ctaLink: e.target.value },
                    })
                  }
                  placeholder="/contact"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Footer Content</CardTitle>
            <CardDescription>Manage footer information and links.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tagline */}
            <div className="space-y-2">
              <Label>Footer Tagline</Label>
              <Textarea
                value={content.footer.tagline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, tagline: e.target.value },
                  })
                }
                rows={2}
              />
            </div>

            <Separator />

            {/* Social Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Social Media Links</Label>
                <Button variant="outline" size="sm" onClick={addSocialLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Social
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Select a platform and provide the full URL to your profile page.
              </p>
              {content.footer.socialLinks.map((link) => {
                const selectedPlatform = socialPlatforms.find(p => p.value === link.platform);
                const IconComponent = selectedPlatform?.icon || Globe;
                return (
                  <div key={link.id} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[180px]">
                      <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                      <Select
                        value={link.platform}
                        onValueChange={(value) => updateSocialLink(link.id, 'platform', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {socialPlatforms.map((platform) => {
                            const PlatformIcon = platform.icon;
                            return (
                              <SelectItem key={platform.value} value={platform.value}>
                                <div className="flex items-center gap-2">
                                  <PlatformIcon className="h-4 w-4" />
                                  <span>{platform.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                      placeholder={`https://${link.platform.toLowerCase()}.com/yourprofile`}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(link.id)}
                      className="text-destructive hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Services Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Services List</Label>
                <Button variant="outline" size="sm" onClick={addServiceLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
              {content.footer.servicesLinks.map((service, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Input
                    value={service}
                    onChange={(e) => updateServiceLink(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeServiceLink(index)}
                    className="text-destructive hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Contact Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={content.footer.contactEmail}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, contactEmail: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={content.footer.contactPhone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, contactPhone: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={content.footer.contactAddress}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, contactAddress: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Copyright */}
            <div className="space-y-2">
              <Label>Copyright Text</Label>
              <Input
                value={content.footer.copyrightText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, copyrightText: e.target.value },
                  })
                }
                placeholder="Company Name. All rights reserved."
              />
              <p className="text-xs text-muted-foreground">The year will be added automatically.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default HeaderFooterAdmin;
