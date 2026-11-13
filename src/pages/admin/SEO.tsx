import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Upload, Image, Globe, Twitter, Building2, Plus, X } from "lucide-react";
import { useSiteContent, SEOContent, defaultSEOContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SEOAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<SEOContent>("seo");

  const [seo, setSeo] = useState<SEOContent>(data || defaultSEOContent);
  const [uploadingOgImage, setUploadingOgImage] = useState<string | null>(null);

  // Update local state when data loads
  useEffect(() => {
    if (data) {
      // Merge with defaults to ensure new fields exist
      setSeo({
        ...defaultSEOContent,
        ...data,
        organizationSchema: {
          ...defaultSEOContent.organizationSchema,
          ...(data.organizationSchema || {}),
        },
        pages: {
          ...defaultSEOContent.pages,
          ...data.pages,
        },
      });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateContent(seo);
      toast.success("SEO settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save SEO settings");
    }
  };

  const updatePageMeta = (page: keyof SEOContent["pages"], field: string, value: string) => {
    setSeo({
      ...seo,
      pages: {
        ...seo.pages,
        [page]: {
          ...seo.pages[page],
          [field]: value,
        },
      },
    });
  };

  const handleOgImageUpload = async (file: File, target: "default" | keyof SEOContent["pages"]) => {
    setUploadingOgImage(target);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `og-${target}-${Date.now()}.${fileExt}`;
      const filePath = `seo/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("site-assets").upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("site-assets").getPublicUrl(filePath);

      if (target === "default") {
        setSeo({ ...seo, defaultOgImage: publicUrl });
      } else {
        updatePageMeta(target, "ogImage", publicUrl);
      }

      toast.success("OG image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingOgImage(null);
    }
  };

  const addSocialLink = () => {
    setSeo({
      ...seo,
      organizationSchema: {
        ...seo.organizationSchema,
        sameAs: [...(seo.organizationSchema?.sameAs || []), ""],
      },
    });
  };

  const updateSocialLink = (index: number, value: string) => {
    const newSameAs = [...(seo.organizationSchema?.sameAs || [])];
    newSameAs[index] = value;
    setSeo({
      ...seo,
      organizationSchema: {
        ...seo.organizationSchema,
        sameAs: newSameAs,
      },
    });
  };

  const removeSocialLink = (index: number) => {
    const newSameAs = [...(seo.organizationSchema?.sameAs || [])];
    newSameAs.splice(index, 1);
    setSeo({
      ...seo,
      organizationSchema: {
        ...seo.organizationSchema,
        sameAs: newSameAs,
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

  const pages = [
    { key: "home" as const, label: "Home", path: "/" },
    { key: "about" as const, label: "About", path: "/about" },
    { key: "services" as const, label: "Services", path: "/services" },
    { key: "projects" as const, label: "Projects", path: "/projects" },
    { key: "contact" as const, label: "Contact", path: "/contact" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">SEO Settings</h1>
            <p className="text-muted-foreground mt-1">Manage meta tags, Open Graph, and structured data</p>
          </div>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Global SEO Settings
            </CardTitle>
            <CardDescription>
              Default settings applied across the site when page-specific settings are not defined.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Site Title</Label>
                <Input
                  value={seo.defaultTitle}
                  onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
                  placeholder="Canvas Cartel"
                />
              </div>
              <div className="space-y-2">
                <Label>Title Template</Label>
                <Input
                  value={seo.titleTemplate}
                  onChange={(e) => setSeo({ ...seo, titleTemplate: e.target.value })}
                  placeholder="%s | Canvas Cartel"
                />
                <p className="text-xs text-muted-foreground">Use %s as placeholder for page title</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site URL</Label>
                <Input
                  value={seo.siteUrl || ""}
                  onChange={(e) => setSeo({ ...seo, siteUrl: e.target.value })}
                  placeholder="https://canvascartel.in"
                />
                <p className="text-xs text-muted-foreground">Used for canonical URLs and OG tags</p>
              </div>
              <div className="space-y-2">
                <Label>Twitter Handle</Label>
                <Input
                  value={seo.twitterHandle || ""}
                  onChange={(e) => setSeo({ ...seo, twitterHandle: e.target.value })}
                  placeholder="@canvascartel"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Google Analytics ID</Label>
                <Input
                  value={seo.googleAnalyticsId || ""}
                  onChange={(e) => setSeo({ ...seo, googleAnalyticsId: e.target.value })}
                  placeholder="G-460XHCDK24"
                />
                <p className="text-xs text-muted-foreground">Your GA4 Measurement ID (starts with G-)</p>
              </div>
              <div className="space-y-2">
                <Label>Google Search Console Verification</Label>
                <Input
                  value={seo.googleSearchConsoleId || ""}
                  onChange={(e) => setSeo({ ...seo, googleSearchConsoleId: e.target.value })}
                  placeholder="verification-code"
                />
                <p className="text-xs text-muted-foreground">HTML tag verification code from Search Console</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Default Description</Label>
              <Textarea
                value={seo.defaultDescription}
                onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
                placeholder="Your site description for search engines..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 150-160 characters • Current: {seo.defaultDescription.length}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Default Keywords</Label>
              <Textarea
                value={seo.defaultKeywords || ""}
                onChange={(e) => setSeo({ ...seo, defaultKeywords: e.target.value })}
                placeholder="creative agency, marketing, design..."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Comma-separated list of keywords</p>
            </div>

            <div className="space-y-2">
              <Label>Default OG Image</Label>
              <div className="flex gap-4 items-start">
                {seo.defaultOgImage && (
                  <img src={seo.defaultOgImage} alt="Default OG" className="w-32 h-20 object-cover rounded border" />
                )}
                <div className="flex-1">
                  <Input
                    value={seo.defaultOgImage || ""}
                    onChange={(e) => setSeo({ ...seo, defaultOgImage: e.target.value })}
                    placeholder="https://..."
                    className="mb-2"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleOgImageUpload(file, "default");
                      }}
                    />
                    <Button variant="outline" size="sm" asChild disabled={uploadingOgImage === "default"}>
                      <span>
                        {uploadingOgImage === "default" ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload Image
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x630px</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Schema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Structured Data
            </CardTitle>
            <CardDescription>Schema.org markup to help search engines understand your organization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input
                  value={seo.organizationSchema?.name || ""}
                  onChange={(e) =>
                    setSeo({
                      ...seo,
                      organizationSchema: { ...seo.organizationSchema, name: e.target.value },
                    })
                  }
                  placeholder="Canvas Cartel"
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={seo.organizationSchema?.logo || ""}
                  onChange={(e) =>
                    setSeo({
                      ...seo,
                      organizationSchema: { ...seo.organizationSchema, logo: e.target.value },
                    })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Organization Description</Label>
              <Textarea
                value={seo.organizationSchema?.description || ""}
                onChange={(e) =>
                  setSeo({
                    ...seo,
                    organizationSchema: { ...seo.organizationSchema, description: e.target.value },
                  })
                }
                placeholder="Brief description of your organization..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Social Profiles (sameAs)</Label>
              <p className="text-xs text-muted-foreground mb-2">Add your social media profile URLs</p>
              {(seo.organizationSchema?.sameAs || []).map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={url}
                    onChange={(e) => updateSocialLink(index, e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeSocialLink(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addSocialLink}>
                <Plus className="h-4 w-4 mr-2" />
                Add Social Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Page-specific Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Page-Specific Meta Tags
            </CardTitle>
            <CardDescription>Customize title, description, keywords, and OG image for each page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="home" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {pages.map((page) => (
                  <TabsTrigger key={page.key} value={page.key}>
                    {page.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {pages.map((page) => (
                <TabsContent key={page.key} value={page.key} className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Page Title</Label>
                    <Input
                      value={seo.pages[page.key]?.title || ""}
                      onChange={(e) => updatePageMeta(page.key, "title", e.target.value)}
                      placeholder={`${page.label} page title`}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 50-60 characters • Current: {(seo.pages[page.key]?.title || "").length}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea
                      value={seo.pages[page.key]?.description || ""}
                      onChange={(e) => updatePageMeta(page.key, "description", e.target.value)}
                      placeholder={`Description for ${page.label} page...`}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 150-160 characters • Current: {(seo.pages[page.key]?.description || "").length}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Keywords (optional)</Label>
                    <Input
                      value={seo.pages[page.key]?.keywords || ""}
                      onChange={(e) => updatePageMeta(page.key, "keywords", e.target.value)}
                      placeholder="page-specific, keywords, here"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>OG Image (optional)</Label>
                    <div className="flex gap-4 items-start">
                      {seo.pages[page.key]?.ogImage && (
                        <img
                          src={seo.pages[page.key].ogImage}
                          alt={`${page.label} OG`}
                          className="w-24 h-14 object-cover rounded border"
                        />
                      )}
                      <div className="flex-1">
                        <Input
                          value={seo.pages[page.key]?.ogImage || ""}
                          onChange={(e) => updatePageMeta(page.key, "ogImage", e.target.value)}
                          placeholder="Leave empty to use default"
                          className="mb-2"
                        />
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleOgImageUpload(file, page.key);
                            }}
                          />
                          <Button variant="outline" size="sm" asChild disabled={uploadingOgImage === page.key}>
                            <span>
                              {uploadingOgImage === page.key ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              Upload
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium mb-2">Search Preview</p>
                    <div className="space-y-1">
                      <p className="text-primary text-lg font-medium truncate">
                        {seo.pages[page.key]?.title || seo.defaultTitle}
                      </p>
                      <p className="text-xs text-green-600">
                        {seo.siteUrl || window.location.origin}
                        {page.path}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {seo.pages[page.key]?.description || seo.defaultDescription}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SEOAdmin;
