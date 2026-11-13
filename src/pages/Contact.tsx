import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useSiteContent, ContactContent, defaultContactContent } from "@/hooks/useSiteContent";
import { useWebhook } from "@/hooks/useWebhook";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone number is required").max(20, "Phone must be less than 20 characters")
    .refine((val) => /^\+91\s?\d{10}$|^\+91\s?\d{5}\s?\d{5}$/.test(val.replace(/\s+/g, ' ').trim()), {
      message: "Please enter a valid 10-digit Indian phone number"
    }),
  company: z.string().max(100, "Company must be less than 100 characters").optional().or(z.literal("")),
  service: z.string().max(50, "Service must be less than 50 characters").optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
};

const Contact = () => {
  const { toast } = useToast();
  const { data: contentData } = useSiteContent<ContactContent>('contact');
  const { sendToWebhook } = useWebhook();
  const content = contentData || defaultContactContent;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all spaces and clean the number
    let cleaned = phone.replace(/\s+/g, '').trim();
    
    // If empty, return as is
    if (!cleaned) return cleaned;
    
    // Remove +91 if present to work with raw number
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // Keep only digits
    cleaned = cleaned.replace(/\D/g, '');
    
    // Format as +91 XXXXX XXXXX
    if (cleaned.length <= 5) {
      return `+91 ${cleaned}`;
    } else if (cleaned.length <= 10) {
      return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }
    // Limit to 10 digits
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5, 10)}`;
  };

  const handlePhoneBlur = () => {
    if (formData.phone.trim()) {
      setFormData({ ...formData, phone: formatPhoneNumber(formData.phone) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (honeypot) {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      return;
    }
    
    const now = Date.now();
    if (lastSubmitTime && now - lastSubmitTime < 5000) {
      toast({
        title: "Please wait",
        description: "You can submit another message in a few seconds.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const leadData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      company: formData.company.trim() || null,
      service: formData.service || null,
      message: formData.message.trim(),
    };

    const { error } = await supabase.from("leads").insert(leadData);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      setLastSubmitTime(Date.now());
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      // Send data to webhook (n8n)
      sendToWebhook(leadData, window.location.href).then((result) => {
        if (!result.success) {
          console.error('Webhook failed:', result.error);
        }
      });

      // Send email notification if admin email is configured
      if (content.adminNotificationEmail) {
        supabase.functions.invoke('send-lead-notification', {
          body: {
            ...leadData,
            adminEmail: content.adminNotificationEmail,
          },
        }).then((response) => {
          if (response.error) {
            console.error('Email notification failed:', response.error);
          } else {
            console.log('Email notifications sent successfully');
          }
        });
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: "",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero relative noise">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              {content.hero.tagline}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-4 mb-6">
              {content.hero.title}{" "}
              <span className="text-gradient">{content.hero.titleHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">
                  {content.infoTitle}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {content.infoDescription}
                </p>
              </div>

              <div className="space-y-6">
                {content.contactInfo.map((item) => {
                  const IconComponent = iconMap[item.icon] || Mail;
                  return (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-muted-foreground">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="pt-8 border-t border-border">
                <h4 className="font-display font-semibold mb-4">{content.whyChooseTitle}</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {content.whyChooseItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="p-8 md:p-10 rounded-3xl bg-gradient-card border border-border/50 hover-lift transition-all duration-300">
                <h3 className="text-xl font-display font-bold mb-6">
                  {content.formTitle}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-muted-foreground">
                        Your Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-muted-foreground">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-muted-foreground">
                        Phone Number *
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handlePhoneBlur}
                        placeholder="+91 98765 43210"
                        required
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-muted-foreground">
                        Company Name
                      </label>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Service Interested In
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground"
                    >
                      <option value="">Select a service</option>
                      {content.serviceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Your Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      rows={5}
                      required
                      className="bg-background border-border resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
