import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Save, Loader2, Plus, Trash2, Upload, X, Image as ImageIcon, Video, ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { IconBrowser } from "@/components/admin/IconBrowser";
import { 
  useSiteContent, 
  ServicesContent,
  defaultServices,
  defaultHero,
  defaultProcess,
} from "@/hooks/useSiteContent";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ServicesAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<ServicesContent>('services');
  
  const [hero, setHero] = useState(data?.hero || defaultHero);
  const [services, setServices] = useState(data?.services || defaultServices);
  const [process, setProcess] = useState(data?.process || defaultProcess);
  const [uploadingServiceId, setUploadingServiceId] = useState<string | null>(null);
  const [uploadingVideoServiceId, setUploadingVideoServiceId] = useState<string | null>(null);
  const [openServices, setOpenServices] = useState<string[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Properly sync state when data loads
  useEffect(() => {
    if (data && !hasInitialized) {
      setHero(data.hero || defaultHero);
      setServices(data.services || defaultServices);
      setProcess(data.process || defaultProcess);
      setHasInitialized(true);
    }
  }, [data, hasInitialized]);

  const handleSave = async () => {
    try {
      await updateContent({
        hero,
        services,
        process,
      });
      toast.success("Services page content saved successfully!");
    } catch (error) {
      toast.error("Failed to save content");
    }
  };

  const addService = () => {
    setServices([
      ...services,
      {
        id: Date.now().toString(),
        icon: "Briefcase",
        title: "New Service",
        description: "Service description",
        features: ["Feature 1"],
        pricing: "Starting from ₹10,000",
        fullDescription: "",
        gallery: [],
      },
    ]);
  };

  const removeService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const updateService = (id: string, field: string, value: string | string[]) => {
    setServices(services.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addFeature = (serviceId: string) => {
    setServices(
      services.map((s) =>
        s.id === serviceId ? { ...s, features: [...s.features, "New feature"] } : s
      )
    );
  };

  const removeFeature = (serviceId: string, index: number) => {
    setServices(
      services.map((s) =>
        s.id === serviceId
          ? { ...s, features: s.features.filter((_, i) => i !== index) }
          : s
      )
    );
  };

  const updateFeature = (serviceId: string, index: number, value: string) => {
    setServices(
      services.map((s) =>
        s.id === serviceId
          ? { ...s, features: s.features.map((f, i) => (i === index ? value : f)) }
          : s
      )
    );
  };

  const addProcessStep = () => {
    const stepNumber = (process.length + 1).toString().padStart(2, "0");
    setProcess([
      ...process,
      {
        id: Date.now().toString(),
        step: stepNumber,
        title: "New Step",
        description: "Step description",
      },
    ]);
  };

  const removeProcessStep = (id: string) => {
    setProcess(process.filter((p) => p.id !== id));
  };

  const updateProcessStep = (id: string, field: string, value: string) => {
    setProcess(process.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleImageUpload = async (serviceId: string, files: FileList) => {
    if (!files.length) return;
    
    setUploadingServiceId(serviceId);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `services/${serviceId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName);
          
        uploadedUrls.push(urlData.publicUrl);
      }
      
      setServices(
        services.map((s) =>
          s.id === serviceId
            ? { ...s, gallery: [...(s.gallery || []), ...uploadedUrls] }
            : s
        )
      );
      
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error: unknown) {
      toast.error("Failed to upload images: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setUploadingServiceId(null);
    }
  };

  const removeImage = (serviceId: string, imageUrl: string) => {
    setServices(
      services.map((s) =>
        s.id === serviceId
          ? { ...s, gallery: (s.gallery || []).filter((img) => img !== imageUrl) }
          : s
      )
    );
  };

  const addVideo = (serviceId: string) => {
    setServices(
      services.map((s) =>
        s.id === serviceId
          ? { ...s, videos: [...(s.videos || []), ""] }
          : s
      )
    );
  };

  const removeVideo = (serviceId: string, index: number) => {
    setServices(
      services.map((s) =>
        s.id === serviceId
          ? { ...s, videos: (s.videos || []).filter((_, i) => i !== index) }
          : s
      )
    );
  };

  const updateVideo = (serviceId: string, index: number, value: string) => {
    setServices(
      services.map((s) =>
        s.id === serviceId
          ? { ...s, videos: (s.videos || []).map((v, i) => (i === index ? value : v)) }
          : s
      )
    );
  };

  const handleVideoUpload = async (serviceId: string, files: FileList) => {
    if (!files.length) return;
    
    setUploadingVideoServiceId(serviceId);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('video/')) {
          toast.error(`${file.name} is not a valid video file`);
          continue;
        }
        
        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 100MB`);
          continue;
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `services/${serviceId}/videos/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName);
          
        uploadedUrls.push(urlData.publicUrl);
      }
      
      if (uploadedUrls.length > 0) {
        setServices(
          services.map((s) =>
            s.id === serviceId
              ? { ...s, videos: [...(s.videos || []), ...uploadedUrls] }
              : s
          )
        );
        
        toast.success(`${uploadedUrls.length} video(s) uploaded successfully!`);
      }
    } catch (error: unknown) {
      toast.error("Failed to upload video: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setUploadingVideoServiceId(null);
    }
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
            <h1 className="text-3xl font-display font-bold">Services Page</h1>
            <p className="text-muted-foreground mt-1">Manage your services page content</p>
          </div>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input
                  value={hero.tagline}
                  onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Title Highlight</Label>
                <Input
                  value={hero.titleHighlight}
                  onChange={(e) => setHero({ ...hero, titleHighlight: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={hero.description}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Services</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {services.length} service(s) configured. Click on a service to expand and edit.
              </p>
            </div>
            <Button variant="default" size="sm" onClick={addService}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No services yet. Click "Add Service" to create one.</p>
              </div>
            ) : (
              services.map((service, index) => {
                const isOpen = openServices.includes(service.id);
                return (
                  <Collapsible
                    key={service.id}
                    open={isOpen}
                    onOpenChange={(open) => {
                      if (open) {
                        setOpenServices([...openServices, service.id]);
                      } else {
                        setOpenServices(openServices.filter(id => id !== service.id));
                      }
                    }}
                    className="border rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{service.title || 'Untitled Service'}</h4>
                            <p className="text-sm text-muted-foreground">{service.features.length} features • {service.gallery?.length || 0} images</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeService(service.id);
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {isOpen ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 space-y-4 bg-background border-t">
                        {/* Basic Info */}
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Icon Name</Label>
                            <div className="flex gap-2">
                              <Input
                                value={service.icon}
                                onChange={(e) => updateService(service.id, "icon", e.target.value)}
                                placeholder="e.g., Megaphone"
                                className="flex-1"
                              />
                              <IconBrowser 
                                currentIcon={service.icon}
                                onSelectIcon={(iconName) => updateService(service.id, "icon", iconName)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={service.title}
                              onChange={(e) => updateService(service.id, "title", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Pricing</Label>
                            <Input
                              value={service.pricing}
                              onChange={(e) => updateService(service.id, "pricing", e.target.value)}
                            />
                          </div>
                        </div>
                        
                        {/* Descriptions */}
                        <div className="space-y-2">
                          <Label>Short Description</Label>
                          <Textarea
                            value={service.description}
                            onChange={(e) => updateService(service.id, "description", e.target.value)}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Full Description (for detail page)</Label>
                          <Textarea
                            value={service.fullDescription || ""}
                            onChange={(e) => updateService(service.id, "fullDescription", e.target.value)}
                            rows={3}
                            placeholder="Detailed description shown on the service detail page..."
                          />
                        </div>
                        
                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Features</Label>
                            <Button variant="outline" size="sm" onClick={() => addFeature(service.id)}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add Feature
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {service.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2">
                                <Input
                                  value={feature}
                                  onChange={(e) => updateFeature(service.id, featureIndex, e.target.value)}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFeature(service.id, featureIndex)}
                                  className="text-destructive hover:text-destructive flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Gallery Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Gallery Images</Label>
                            <label className="cursor-pointer">
                              <Input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => e.target.files && handleImageUpload(service.id, e.target.files)}
                                disabled={uploadingServiceId === service.id}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                disabled={uploadingServiceId === service.id}
                              >
                                <span>
                                  {uploadingServiceId === service.id ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <Upload className="h-4 w-4 mr-2" />
                                  )}
                                  Upload Images
                                </span>
                              </Button>
                            </label>
                          </div>
                          
                          {service.gallery && service.gallery.length > 0 ? (
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                              {service.gallery.map((image, imgIndex) => (
                                <div key={imgIndex} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                                  <img
                                    src={image}
                                    alt={`Gallery ${imgIndex + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    onClick={() => removeImage(service.id, image)}
                                    className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                              <ImageIcon className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                              <p className="text-xs text-muted-foreground">No images uploaded</p>
                            </div>
                          )}
                        </div>

                        {/* Videos Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <Label>Videos</Label>
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer">
                                <Input
                                  type="file"
                                  accept="video/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => e.target.files && handleVideoUpload(service.id, e.target.files)}
                                  disabled={uploadingVideoServiceId === service.id}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  disabled={uploadingVideoServiceId === service.id}
                                >
                                  <span>
                                    {uploadingVideoServiceId === service.id ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Upload className="h-4 w-4 mr-2" />
                                    )}
                                    Upload
                                  </span>
                                </Button>
                              </label>
                              <Button variant="outline" size="sm" onClick={() => addVideo(service.id)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add URL
                              </Button>
                            </div>
                          </div>
                          
                          {service.videos && service.videos.length > 0 ? (
                            <div className="space-y-2">
                              {service.videos.map((video, videoIndex) => {
                                const isUploadedVideo = video.includes('supabase') && (video.endsWith('.mp4') || video.endsWith('.webm') || video.endsWith('.mov') || video.endsWith('.avi'));
                                
                                return (
                                  <div key={videoIndex} className="flex items-center gap-2">
                                    <Input
                                      value={video}
                                      onChange={(e) => updateVideo(service.id, videoIndex, e.target.value)}
                                      placeholder="https://youtube.com/watch?v=..."
                                      readOnly={isUploadedVideo}
                                      className={isUploadedVideo ? "bg-muted text-sm" : "text-sm"}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeVideo(service.id, videoIndex)}
                                      className="text-destructive hover:text-destructive flex-shrink-0"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                              <Video className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                              <p className="text-xs text-muted-foreground">No videos added</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Process Steps */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Process Steps</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {process.length} step(s) to show how you work
              </p>
            </div>
            <Button variant="default" size="sm" onClick={addProcessStep}>
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {process.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No process steps yet. Click "Add Step" to create one.</p>
              </div>
            ) : (
              process.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {step.step || index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      value={step.step}
                      onChange={(e) => updateProcessStep(step.id, "step", e.target.value)}
                      placeholder="01"
                      className="bg-background w-20"
                    />
                    <Input
                      value={step.title}
                      onChange={(e) => updateProcessStep(step.id, "title", e.target.value)}
                      placeholder="Step Title"
                      className="bg-background"
                    />
                    <Input
                      value={step.description}
                      onChange={(e) => updateProcessStep(step.id, "description", e.target.value)}
                      placeholder="Step Description"
                      className="bg-background"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProcessStep(step.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ServicesAdmin;
