import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Workflow,
  Zap,
  RefreshCw,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  ShoppingCart,
  FileText,
  Users,
  BarChart3,
  Check,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";

const workflowExamples = [
  {
    icon: Mail,
    title: "Email Automation",
    description: "Auto-respond to inquiries, send follow-ups, and nurture leads with personalized email sequences.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Sync",
    description: "Sync orders, inventory, and customer data across Shopify, WooCommerce, and your CRM.",
  },
  {
    icon: MessageSquare,
    title: "Social Media Posting",
    description: "Schedule and auto-publish content across Instagram, LinkedIn, Twitter, and Facebook.",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description: "Automate calendar scheduling, reminders, and follow-up communications.",
  },
  {
    icon: Database,
    title: "Data Processing",
    description: "Transform, clean, and migrate data between spreadsheets, databases, and apps.",
  },
  {
    icon: FileText,
    title: "Invoice Generation",
    description: "Auto-generate invoices, send payment reminders, and sync with accounting software.",
  },
];

const integrations = [
  { name: "Google Sheets", category: "Productivity" },
  { name: "Slack", category: "Communication" },
  { name: "Gmail", category: "Email" },
  { name: "WhatsApp", category: "Messaging" },
  { name: "Shopify", category: "E-commerce" },
  { name: "Stripe", category: "Payments" },
  { name: "HubSpot", category: "CRM" },
  { name: "Notion", category: "Productivity" },
  { name: "Airtable", category: "Database" },
  { name: "Telegram", category: "Messaging" },
  { name: "Twilio", category: "SMS" },
  { name: "OpenAI", category: "AI" },
  { name: "Supabase", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "WordPress", category: "CMS" },
  { name: "Calendly", category: "Scheduling" },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "₹30,000",
    description: "Perfect for small businesses getting started with automation",
    features: [
      "Up to 3 workflow automations",
      "Basic integrations setup",
      "Email & form automation",
      "1 month support",
      "Documentation & training",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "₹60,000",
    description: "For growing businesses needing comprehensive automation",
    features: [
      "Up to 8 workflow automations",
      "Advanced integrations",
      "CRM & sales automation",
      "E-commerce sync",
      "3 months support",
      "Priority assistance",
      "Monthly optimization call",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₹1,20,000",
    description: "Full-scale automation for complex business operations",
    features: [
      "Unlimited workflows",
      "Custom API integrations",
      "AI-powered automation",
      "Multi-platform sync",
      "6 months support",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom training sessions",
    ],
    popular: false,
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Save 20+ Hours/Week",
    description: "Automate repetitive tasks and focus on what matters most for your business.",
  },
  {
    icon: Zap,
    title: "Zero Coding Required",
    description: "Visual workflow builder makes automation accessible to everyone on your team.",
  },
  {
    icon: RefreshCw,
    title: "Real-time Sync",
    description: "Keep all your apps and data in perfect sync with instant triggers and actions.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Self-hosted option available for complete data control and privacy.",
  },
];

const N8nAutomation = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-gradient-hero relative noise overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-40 sm:w-52 md:w-64 h-40 sm:h-52 md:h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Workflow className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by n8n</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Automate Your Business with{" "}
              <span className="text-gradient">n8n Workflows</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect your apps, automate repetitive tasks, and build powerful workflows
              that save time and boost productivity. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-5 sm:p-6 bg-gradient-card border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Examples */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider">
              What You Can Automate
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-3 sm:mt-4 mb-4">
              Workflow <span className="text-gradient">Examples</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              From simple email automation to complex multi-step workflows, we build
              solutions that transform how your business operates.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {workflowExamples.map((example, index) => (
              <Card
                key={index}
                className="p-5 sm:p-6 bg-background border-border/50 hover:border-primary/30 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <example.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                  {example.title}
                </h3>
                <p className="text-sm text-muted-foreground">{example.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider">
              400+ Integrations
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-3 sm:mt-4 mb-4">
              Connect Your <span className="text-gradient">Favorite Apps</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              n8n integrates with hundreds of apps and services. Here are some popular
              integrations we set up for our clients.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-full bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
              >
                <span className="text-sm font-medium">{integration.name}</span>
              </div>
            ))}
            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">+ 400 more</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-3 sm:mt-4 mb-4">
              Choose Your <span className="text-gradient">Package</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Transparent pricing with no hidden fees. All packages include setup,
              testing, and documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`p-6 sm:p-8 relative ${
                  tier.popular
                    ? "border-primary bg-gradient-card shadow-lg scale-105"
                    : "border-border/50 bg-background"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-display font-bold mb-2">{tier.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl sm:text-4xl font-display font-bold text-primary">
                      {tier.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.popular ? "hero" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link to="/contact">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Our Process
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-3 sm:mt-4 mb-4">
              How We <span className="text-gradient">Work</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Discovery", description: "We analyze your current workflows and identify automation opportunities." },
              { step: "02", title: "Design", description: "We design custom workflows tailored to your business needs." },
              { step: "03", title: "Build", description: "We build and test your automations with n8n's powerful engine." },
              { step: "04", title: "Deploy", description: "We deploy, monitor, and provide ongoing support for your workflows." },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-bold text-gradient mb-3">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 sm:mb-6">
              Ready to <span className="text-gradient">Automate?</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-2">
              Let's discuss your automation needs and build workflows that save you time
              and grow your business. Free consultation included.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/services">Explore All Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default N8nAutomation;
