import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Megaphone,
  Share2,
  Globe,
  Video,
  Camera,
  Target,
  Workflow,
  Check,
  ArrowRight,
  Package,
  LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ServiceOption {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  basePrice: number;
}

const serviceOptions: ServiceOption[] = [
  {
    id: "advertisement",
    icon: Megaphone,
    title: "Advertisement Design",
    description: "Eye-catching ads for print & digital",
    basePrice: 15000,
  },
  {
    id: "social-media",
    icon: Share2,
    title: "Social Media Content",
    description: "Strategic content that connects",
    basePrice: 20000,
  },
  {
    id: "website",
    icon: Globe,
    title: "Website Development",
    description: "Fast, responsive, conversion-focused",
    basePrice: 50000,
  },
  {
    id: "video",
    icon: Video,
    title: "Video Production",
    description: "Compelling brand storytelling",
    basePrice: 25000,
  },
  {
    id: "photo",
    icon: Camera,
    title: "Photo Production",
    description: "Professional brand photography",
    basePrice: 15000,
  },
  {
    id: "marketing",
    icon: Target,
    title: "Marketing Strategy",
    description: "Complete roadmaps for growth",
    basePrice: 35000,
  },
  {
    id: "n8n-automation",
    icon: Workflow,
    title: "n8n Automation",
    description: "Workflow & business automation",
    basePrice: 30000,
  },
];

export const CustomPackageBuilder = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    requirements: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = serviceOptions.find((s) => s.id === serviceId);
      return total + (service?.basePrice || 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedServiceNames = selectedServices
        .map((id) => serviceOptions.find((s) => s.id === id)?.title)
        .filter(Boolean)
        .join(", ");

      const message = `Custom Package Request:\n\nSelected Services: ${selectedServiceNames}\nEstimated Budget: ₹${calculateTotal().toLocaleString("en-IN")}\n\nRequirements:\n${formData.requirements || "No additional requirements specified"}`;

      const { error } = await supabase.from("leads").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          service: "Custom Package",
          message: message,
          budget: `₹${calculateTotal().toLocaleString("en-IN")}`,
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Your custom package request has been submitted!");
    } catch (error) {
      console.error("Error submitting custom package:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-card relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="max-w-2xl mx-auto p-8 sm:p-12 text-center bg-gradient-card border-primary/20">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4">
              Request Submitted!
            </h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your custom package request. Our team will review your
              requirements and get back to you within 24 hours with a detailed quote.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setSelectedServices([]);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  company: "",
                  requirements: "",
                });
              }}
            >
              Build Another Package
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 sm:py-20 md:py-24 bg-card relative overflow-hidden"
      aria-labelledby="custom-package-heading"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-40 sm:w-52 md:w-64 h-40 sm:h-52 md:h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-16 px-2">
          <span className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Build Your Own
          </span>
          <h2
            id="custom-package-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-3 sm:mt-4 mb-4 sm:mb-6"
          >
            Create Your <span className="text-gradient">Custom Package</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Select the services you need and build a tailored package that fits
            your brand's unique requirements. Get an instant estimate and
            personalized quote.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Service Selection */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Select Your Services
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {serviceOptions.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <Card
                    key={service.id}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:border-primary/50 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-gradient-card"
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleService(service.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <service.icon
                            className={`h-4 w-4 ${
                              isSelected ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <span className="font-medium text-sm">
                            {service.title}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {service.description}
                        </p>
                        <span className="text-xs font-medium text-primary">
                          From ₹{service.basePrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Summary & Form */}
          <div>
            <Card className="p-5 sm:p-6 bg-gradient-card border-border/50 sticky top-24">
              <h3 className="text-lg font-display font-semibold mb-4">
                Package Summary
              </h3>

              {selectedServices.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {selectedServices.map((serviceId) => {
                    const service = serviceOptions.find((s) => s.id === serviceId);
                    if (!service) return null;
                    return (
                      <div
                        key={serviceId}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-primary" />
                          {service.title}
                        </span>
                        <span className="text-muted-foreground">
                          ₹{service.basePrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Estimated Total</span>
                      <span className="text-primary">
                        ₹{calculateTotal().toLocaleString("en-IN")}+
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      *Final price based on project scope
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-6 py-4 text-center border border-dashed border-border rounded-lg">
                  Select services to see your package summary
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name" className="text-xs">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="phone" className="text-xs">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-xs">
                      Company
                    </Label>
                    <Input
                      id="company"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="requirements" className="text-xs">
                    Additional Requirements
                  </Label>
                  <Textarea
                    id="requirements"
                    placeholder="Tell us more about your project needs..."
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || selectedServices.length === 0}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Get Custom Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
