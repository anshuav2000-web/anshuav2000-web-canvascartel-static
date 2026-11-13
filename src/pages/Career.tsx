import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Send, Briefcase, Users, TrendingUp, Heart, MapPin, Clock, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useCareerWebhook } from "@/hooks/useCareerWebhook";

const applicationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone number is required").max(20, "Phone must be less than 20 characters")
    .refine((val) => /^\+91\s?\d{10}$|^\+91\s?\d{5}\s?\d{5}$/.test(val.replace(/\s+/g, ' ').trim()), {
      message: "Please enter a valid 10-digit Indian phone number"
    }),
  position: z.string().min(1, "Please select a position"),
  experience: z.string().max(50, "Experience must be less than 50 characters").optional().or(z.literal("")),
  linkedin_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  portfolio_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  cover_letter: z.string().max(2000, "Cover letter must be less than 2000 characters").optional().or(z.literal("")),
});

interface JobOpening {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  experience: string | null;
  description: string | null;
  requirements: string[] | null;
  responsibilities: string[] | null;
  salary_range: string | null;
  is_active: boolean;
}

const benefits = [
  { icon: Briefcase, title: "Growth Opportunities", description: "Learn and grow with exciting projects" },
  { icon: Users, title: "Creative Team", description: "Work with talented designers & developers" },
  { icon: TrendingUp, title: "Career Development", description: "Regular training and skill enhancement" },
  { icon: Heart, title: "Work-Life Balance", description: "Flexible hours and supportive culture" },
];

const Career = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { sendToWebhook, settings } = useCareerWebhook();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    linkedin_url: "",
    portfolio_url: "",
    cover_letter: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  // Fetch active job openings
  const { data: jobOpenings } = useQuery({
    queryKey: ['job-openings-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as JobOpening[];
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\s+/g, '').trim();
    if (!cleaned) return cleaned;
    
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    cleaned = cleaned.replace(/\D/g, '');
    
    if (cleaned.length <= 5) {
      return `+91 ${cleaned}`;
    } else if (cleaned.length <= 10) {
      return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5, 10)}`;
  };

  const handlePhoneBlur = () => {
    if (formData.phone.trim()) {
      setFormData({ ...formData, phone: formatPhoneNumber(formData.phone) });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Resume must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleApplyClick = (jobTitle: string) => {
    setFormData({ ...formData, position: jobTitle });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (honeypot) {
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      return;
    }
    
    setIsSubmitting(true);

    const validation = applicationSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    let resumeUrl = null;

    // Upload resume if provided
    if (resumeFile) {
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile);

      if (uploadError) {
        toast({
          title: "Upload Error",
          description: "Failed to upload resume. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      resumeUrl = uploadData.path;
    }

    const applicationData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      position: formData.position,
      experience: formData.experience.trim() || null,
      linkedin_url: formData.linkedin_url.trim() || null,
      portfolio_url: formData.portfolio_url.trim() || null,
      cover_letter: formData.cover_letter.trim() || null,
      resume_url: resumeUrl,
    };

    const { error } = await supabase.from("job_applications").insert(applicationData);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });

      // Send data to webhook (n8n) if configured
      sendToWebhook({
        ...applicationData,
        resume_url: resumeUrl,
      }, window.location.href).then((result) => {
        if (!result.success) {
          console.error('Career webhook failed:', result.error);
        }
      });

      // Send email notification if admin email is configured
      if (settings.adminEmail) {
        supabase.functions.invoke('send-application-notification', {
          body: {
            ...applicationData,
            adminEmail: settings.adminEmail,
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
        position: "",
        experience: "",
        linkedin_url: "",
        portfolio_url: "",
        cover_letter: "",
      });
      setResumeFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setIsSubmitting(false);
  };

  // Build position options from job openings + some defaults
  const positionOptions = jobOpenings?.length 
    ? jobOpenings.map(job => ({ value: job.title, label: job.title }))
    : [
        { value: "graphic-designer", label: "Graphic Designer" },
        { value: "ui-ux-designer", label: "UI/UX Designer" },
        { value: "web-developer", label: "Web Developer" },
        { value: "social-media-manager", label: "Social Media Manager" },
        { value: "content-writer", label: "Content Writer" },
        { value: "video-editor", label: "Video Editor" },
        { value: "motion-graphics", label: "Motion Graphics Artist" },
        { value: "marketing-executive", label: "Marketing Executive" },
        { value: "intern", label: "Internship" },
      ];

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
              Join Our Team
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-4 mb-6">
              Build Your <span className="text-gradient">Career</span> With Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're always looking for talented individuals who are passionate about design, 
              creativity, and innovation. Join Canvas Cartel and be part of something extraordinary.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-center mb-12">
            Why Work With Us?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-background border border-border/50 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings Section */}
      {jobOpenings && jobOpenings.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Current <span className="text-gradient">Openings</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our open positions and find the perfect role for your skills and aspirations
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {jobOpenings.map((job) => (
                <div 
                  key={job.id}
                  className="rounded-2xl border border-border/50 bg-gradient-card overflow-hidden"
                >
                  <div 
                    className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          {job.department && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.department}
                            </span>
                          )}
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                          )}
                          {job.type && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.type}
                            </span>
                          )}
                          {job.experience && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                              {job.experience}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight 
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          expandedJob === job.id ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {expandedJob === job.id && (
                    <div className="px-6 pb-6 border-t border-border/50 pt-4">
                      {job.description && (
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                      )}

                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Requirements</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {job.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Responsibilities</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {job.responsibilities.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {job.salary_range && (
                        <p className="text-sm mb-4">
                          <strong>Salary:</strong> {job.salary_range}
                        </p>
                      )}

                      <Button 
                        variant="hero" 
                        onClick={() => handleApplyClick(job.title)}
                      >
                        Apply for this Position
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Application Form */}
      <section className="py-20 bg-secondary/30" ref={formRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Apply Now
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below to apply for a position at Canvas Cartel
              </p>
            </div>

            <div className="p-8 md:p-10 rounded-3xl bg-gradient-card border border-border/50">
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
                    <label className="text-sm font-medium mb-2 block">
                      Full Name *
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
                    <label className="text-sm font-medium mb-2 block">
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
                    <label className="text-sm font-medium mb-2 block">
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
                    <label className="text-sm font-medium mb-2 block">
                      Position Applying For *
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground"
                    >
                      <option value="">Select a position</option>
                      {positionOptions.map((pos) => (
                        <option key={pos.value} value={pos.value}>
                          {pos.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Years of Experience
                    </label>
                    <Input
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g., 2 years"
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Resume/CV *
                    </label>
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="flex items-center gap-2 w-full h-10 px-3 rounded-lg bg-background border border-border text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="truncate text-sm">
                          {resumeFile ? resumeFile.name : "Upload PDF or Word file (max 5MB)"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      LinkedIn Profile
                    </label>
                    <Input
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Portfolio URL
                    </label>
                    <Input
                      name="portfolio_url"
                      value={formData.portfolio_url}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Cover Letter / Why do you want to join us?
                  </label>
                  <Textarea
                    name="cover_letter"
                    value={formData.cover_letter}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and why you'd be a great fit..."
                    rows={5}
                    className="bg-background border-border resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || !resumeFile}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Application
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our{" "}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Career;
