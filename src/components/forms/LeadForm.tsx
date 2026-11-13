import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle, 
  Loader2, 
  User, 
  Briefcase, 
  TrendingUp, 
  DollarSign,
  Clock,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWebhook } from "@/hooks/useWebhook";

// Zod schema for validation
const leadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[\+]?[\d\s\-]+$/, "Please enter a valid phone number"),
  businessType: z.string()
    .min(1, "Business type is required")
    .max(50, "Business type must be less than 50 characters"),
  service: z.string()
    .min(1, "Service needed is required")
    .max(50, "Service must be less than 50 characters"),
  budget: z.string()
    .min(1, "Budget is required")
    .regex(/^\d+$/, "Budget must contain only numbers")
    .max(15, "Budget is too long"),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

export type LeadFormData = z.infer<typeof leadSchema>;

// Service options for the form
const serviceOptions = [
  { value: "branding", label: "Branding & Graphic Design" },
  { value: "social-media", label: "Social Media Marketing" },
  { value: "website", label: "Website Development" },
  { value: "video", label: "Video Production" },
  { value: "photo", label: "Photography" },
  { value: "marketing", label: "Digital Marketing Strategy (SEO, Campaigns)" },
  { value: "ai-automation", label: "AI & Business Automation" },
];

// Business type options for the form
const businessTypeOptions = [
  { value: "startup", label: "Startup" },
  { value: "sme", label: "SME" },
  { value: "healthcare", label: "Healthcare" },
  { value: "restaurant", label: "Restaurant" },
  { value: "real-estate", label: "Real Estate" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "other", label: "Other" },
];

// Budget options for the form
const budgetOptions = [
  { value: "under-50k", label: "Under ₹50,000" },
  { value: "50k-1L", label: "₹50,000 - ₹1,00,000" },
  { value: "1L-2.5L", label: "₹1,00,000 - ₹2,50,000" },
  { value: "2.5L-5L", label: "₹2,50,000 - ₹5,00,000" },
  { value: "5L-10L", label: "₹5,00,000 - ₹10,00,000" },
  { value: "10L-plus", label: "₹10,00,000+" },
];

export const LeadForm = () => {
  const { toast } = useToast();
  const { webhookUrl } = useWebhook();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
    setError,
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      businessType: "",
      service: "",
      budget: "",
      message: "",
    },
    mode: "onBlur",
  });

  const onSubmit = useCallback(async (data: LeadFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Save to Supabase leads table
      const { error: supabaseError } = await supabase
        .from("leads")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          business_type: data.businessType,
          service_needed: data.service,
          budget: parseInt(data.budget) || 0,
          message: data.message,
          status: "new",
          created_at: new Date().toISOString(),
        });

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw new Error("Failed to save lead. Please try again.");
      }

      // 2. Call webhook for n8n workflow
      if (webhookUrl) {
        try {
          const webhookResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              phone: data.phone,
              business_type: data.businessType,
              service_needed: data.service,
              budget: parseInt(data.budget) || 0,
              message: data.message,
              source: "website_form",
              timestamp: new Date().toISOString(),
            }),
          });

          if (!webhookResponse.ok) {
            console.warn("Webhook returned non-OK status:", webhookResponse.status);
          }
        } catch (webhookError) {
          console.error("Webhook error:", webhookError);
          // Don't throw - webhook failure shouldn't block lead creation
        }
      }

      // 3. Show success toast
      toast({
        title: "Lead submitted successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setIsSuccess(true);
      reset();

      // Reset success after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

    } catch (error) {
      console.error("Submit error:", error);
      setError("Failed to submit. Please try again.");
      toast({
        title: "Error",
        description: "Failed to submit lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [webhookUrl, toast, reset]);

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Thank You!</h3>
            <p className="text-muted-foreground">
              Your message has been sent successfully. We'll get back to you
              within 24 hours.
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              variant="outline"
              className="mt-4"
            >
              Send Another Message
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Form card */}
      <div className="bg-[var(--card)] border border-[var(--border)]/40 rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Main form */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  disabled={isSubmitting}
                  {...register("name")}
                  placeholder="John Doe"
                  className="bg-[var(--background)] border-[var(--border)] focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name?.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  disabled={isSubmitting}
                  {...register("email")}
                  placeholder="john@example.com"
                  className="bg-[var(--background)] border-[var(--border)] focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  disabled={isSubmitting}
                  {...register("phone")}
                  placeholder="+91 98765 43210"
                  className="bg-[var(--background)] border-[var(--border)] focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone?.message}</p>
                )}
              </div>

              {/* Business Type */}
              <div>
                <Label htmlFor="businessType" className="text-sm font-medium mb-2 block">
                  Business Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  disabled={isSubmitting}
                  {...register("businessType")}
                  className="bg-[var(--background)] border-[var(--border)] focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select business type</option>
                  {businessTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
                {errors.businessType && (
                  <p className="mt-1 text-sm text-red-500">{errors.businessType?.message}</p>
                )}
              </div>

              {/* Service Needed */}
              <div>
                <Label htmlFor="service" className="text-sm font-medium mb-2 block">
                  Service Needed <span className="text-red-500">*</span>
                </Label>
                <Select
                  disabled={isSubmitting}
                  {...register("service")}
                  className="bg-[var(--background)] border-[var(--border)] focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select service</option>
                  {serviceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
                {errors.service && (
                  <p className="mt-1 text-sm text-red-500">{errors.service?.message}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <Label htmlFor="budget" className="text-sm font-medium mb-2 block">
                  Budget Range <span className="text-red-500">*</span>
                </Label>
                <Select
                  disabled={isSubmitting}
                  {...register("budget")}
                  className="bg-[var(--background)] border-[var(--border)] focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select budget range</option>
                  {budgetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-500">{errors.budget?.message}</p>
                )}
              </div>
            </div>

            {/* Right column - Message */}
            <div className="lg:col-span-2">
              <Label htmlFor="message" className="text-sm font-medium mb-2 block">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                disabled={isSubmitting}
                {...register("message")}
                placeholder="Tell us about your project, goals, or timeline..."
                className="min-h-[120px] bg-[var(--background)] border-[var(--border)] focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message?.message}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full mt-6 h-12 text-base bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>

          {/* Right column - Quick info cards */}
          <div className="flex flex-col gap-4">
            {/* Response time card */}
            <div className="bg-[var(--background)] border border-[var(--border)]/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Response Time</p>
                  <p className="text-sm font-semibold text-foreground">24 hours</p>
                </div>
              </div>
            </div>

            {/* Budget insight card */}
            <div className="bg-[var(--background)] border border-[var(--border)]/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Budget Insight</p>
                  <p className="text-sm font-semibold text-foreground">
                    ₹50K - ₹10L
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline card */}
            <div className="bg-[var(--background)] border border-[var(--border)]/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p className="text-sm font-semibold text-foreground">
                    4-6 weeks
                  </p>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Free professional consultation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
