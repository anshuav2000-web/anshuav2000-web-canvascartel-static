import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  pricing: string;
  fullDescription?: string;
  gallery?: string[];
  videos?: string[];
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  description: string;
}

export interface HeroContent {
  tagline: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  gradient: string;
  client?: string;
  year?: string;
  fullDescription?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  gallery?: string[];
}

export interface PortfolioContent {
  projects: PortfolioProject[];
  categories: string[];
}

export interface HomepageHeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  stats: { number: string; label: string }[];
}

export interface HomepageCTAContent {
  title: string;
  titleHighlight: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface HomepageContent {
  hero: HomepageHeroContent;
  cta: HomepageCTAContent;
}

export interface AboutValue {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutHeroContent {
  tagline: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface AboutMainContent {
  title: string;
  titleHighlight: string;
  paragraphs: string[];
  brandName: string;
  brandTagline: string;
  establishedYear: string;
}

export interface AboutPhilosophyContent {
  tagline: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface AboutCardContent {
  title: string;
  description: string;
  highlight: string;
}

export interface AboutCTAContent {
  title: string;
  titleHighlight: string;
  description: string;
  buttonText: string;
}

export interface AboutContent {
  hero: AboutHeroContent;
  main: AboutMainContent;
  philosophy: AboutPhilosophyContent;
  values: AboutValue[];
  stats: { number: string; label: string }[];
  creatorsCard: AboutCardContent;
  brandsCard: AboutCardContent;
  cta: AboutCTAContent;
}

export interface ContactInfoItem {
  id: string;
  icon: string;
  title: string;
  value: string;
}

export interface ContactWhyChooseItem {
  id: string;
  text: string;
}

export interface ContactServiceOption {
  value: string;
  label: string;
}

export interface ContactHeroContent {
  tagline: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface ContactContent {
  hero: ContactHeroContent;
  infoTitle: string;
  infoDescription: string;
  contactInfo: ContactInfoItem[];
  whyChooseTitle: string;
  whyChooseItems: ContactWhyChooseItem[];
  formTitle: string;
  serviceOptions: ContactServiceOption[];
  adminNotificationEmail: string;
}

export interface ServicesContent {
  services: ServiceItem[];
  hero: HeroContent;
  process: ProcessStep[];
}

export interface PopupOfferContent {
  enabled: boolean;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  backgroundColor: string;
  showOnPages: string[];
  delaySeconds: number;
  showOncePerSession: boolean;
  discountCode: string;
  expiryDate: string;
}

export const defaultPopupOfferContent: PopupOfferContent = {
  enabled: false,
  title: 'Special Offer!',
  subtitle: 'Limited Time Only',
  description: 'Get 20% off on all our services. Use the code below at checkout.',
  buttonText: 'Claim Offer',
  buttonLink: '/contact',
  imageUrl: '',
  backgroundColor: '',
  showOnPages: ['/', '/services', '/contact'],
  delaySeconds: 3,
  showOncePerSession: true,
  discountCode: 'SAVE20',
  expiryDate: '',
};

export interface LoadingPageContent {
  enabled: boolean;
  showLogo: boolean;
  customLogoUrl: string;
  useCustomLogo: boolean;
  showLoadingBar: boolean;
  showLoadingText: boolean;
  loadingText: string;
  animationType: 'pulse' | 'float' | 'none';
  backgroundColor: string;
  glowColor: string;
  duration: number;
  logoSize: 'small' | 'medium' | 'large' | 'xlarge';
}

export const defaultLoadingPageContent: LoadingPageContent = {
  enabled: true,
  showLogo: true,
  customLogoUrl: '',
  useCustomLogo: false,
  showLoadingBar: true,
  showLoadingText: true,
  loadingText: 'Loading...',
  animationType: 'pulse',
  backgroundColor: '',
  glowColor: '',
  duration: 400,
  logoSize: 'medium',
};

export interface BrandingContent {
  logoUrl: string;
  logoUrlDark: string;
  siteName: string;
  faviconUrl: string;
}

export const defaultBrandingContent: BrandingContent = {
  logoUrl: '',
  logoUrlDark: '',
  siteName: 'Canvas Cartel',
  faviconUrl: '',
};

export interface SEOPageMeta {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string;
}

export interface SEOContent {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  siteUrl: string;
  defaultOgImage: string;
  defaultKeywords: string;
  twitterHandle: string;
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
  organizationSchema: {
    name: string;
    description: string;
    logo: string;
    sameAs: string[];
  };
  pages: {
    home: SEOPageMeta;
    about: SEOPageMeta;
    services: SEOPageMeta;
    projects: SEOPageMeta;
    contact: SEOPageMeta;
  };
}

export const defaultSEOContent: SEOContent = {
  defaultTitle: 'Canvas Cartel | Creative Design & Digital Marketing Agency India',
  titleTemplate: '%s | Canvas Cartel',
  defaultDescription: 'Canvas Cartel is India\'s premier creative design and marketing studio offering advertisement design, social media marketing, website development, video production, and brand strategy services. Transform your brand with data-driven creativity.',
  siteUrl: 'https://canvascartel.in',
  defaultOgImage: '',
  defaultKeywords: 'creative agency India, marketing studio Mumbai, advertisement design, social media marketing, website development, video production, branding agency, digital marketing India, brand strategy, creative design studio',
  twitterHandle: '@canvascartel',
  googleAnalyticsId: '',
  googleSearchConsoleId: '',
  organizationSchema: {
    name: 'Canvas Cartel',
    description: 'Creative design and marketing studio in India specializing in advertisement design, social media marketing, website development, and video production.',
    logo: '',
    sameAs: [],
  },
  pages: {
    home: { 
      title: 'Canvas Cartel | Creative Design & Marketing Agency India', 
      description: 'India\'s leading creative design and marketing studio. Expert advertisement design, social media marketing, website development, video production & brand strategy services in Mumbai.', 
      ogImage: '', 
      keywords: 'creative agency India, marketing studio, advertisement design, social media marketing, website development, video production, Mumbai' 
    },
    about: { 
      title: 'About Canvas Cartel - Creative Marketing Agency Story | India', 
      description: 'Discover Canvas Cartel - a creative community of skilled designers and marketers in India. We transform brands through strategic creativity and meaningful collaboration.', 
      ogImage: '', 
      keywords: 'about canvas cartel, creative agency story, marketing team India, brand designers Mumbai' 
    },
    services: { 
      title: 'Creative & Marketing Services - Advertisement, Web, Video | Canvas Cartel', 
      description: 'Explore our creative services: advertisement design, social media content, website development, video production, photo production & marketing strategy. Get a free quote today!', 
      ogImage: '', 
      keywords: 'advertisement design services, social media marketing, website development India, video production, marketing strategy' 
    },
    projects: { 
      title: 'Portfolio & Case Studies - Creative Work | Canvas Cartel India', 
      description: 'View our portfolio of successful projects across branding, web design, social media, video production & print. See how we transform brands with creative solutions.', 
      ogImage: '', 
      keywords: 'creative portfolio, case studies, branding projects, web design work, video production portfolio' 
    },
    contact: { 
      title: 'Contact Canvas Cartel - Get a Free Quote | Mumbai, India', 
      description: 'Ready to transform your brand? Contact Canvas Cartel for creative design and marketing services. Get a free consultation and quote for your project today!', 
      ogImage: '', 
      keywords: 'contact creative agency, get quote, hire marketing agency, Mumbai creative studio' 
    },
  },
};

export interface WebhookSettingsContent {
  webhookUrl: string;
  httpMethod: 'GET' | 'POST' | 'PUT';
}

export const defaultWebhookSettingsContent: WebhookSettingsContent = {
  webhookUrl: 'https://auxilytic-kaci-frictionlessly.ngrok-free.dev/webhook/156326c9-c90d-4b69-a017-e258a5fa0d29',
  httpMethod: 'GET',
};

export interface CareerSettingsContent {
  adminEmail: string;
  webhookUrl: string;
  httpMethod: 'GET' | 'POST' | 'PUT';
}

export const defaultCareerSettingsContent: CareerSettingsContent = {
  adminEmail: '',
  webhookUrl: '',
  httpMethod: 'POST',
};

export interface RobotsContent {
  allowAllCrawlers: boolean;
  allowGooglebot: boolean;
  allowBingbot: boolean;
  allowTwitterbot: boolean;
  allowFacebookbot: boolean;
  allowGPTBot: boolean;
  allowPerplexityBot: boolean;
  allowClaudeBot: boolean;
  disallowedPaths: string[];
  customRules: string;
}

export interface SitemapPageConfig {
  path: string;
  priority: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  enabled: boolean;
}

export interface SitemapContent {
  siteUrl: string;
  includeServices: boolean;
  includeProjects: boolean;
  servicePriority: string;
  projectPriority: string;
  pages: SitemapPageConfig[];
}

export const defaultRobotsContent: RobotsContent = {
  allowAllCrawlers: true,
  allowGooglebot: true,
  allowBingbot: true,
  allowTwitterbot: true,
  allowFacebookbot: true,
  allowGPTBot: true,
  allowPerplexityBot: true,
  allowClaudeBot: true,
  disallowedPaths: ['/admin/', '/auth'],
  customRules: '',
};

export const defaultSitemapContent: SitemapContent = {
  siteUrl: 'https://canvascartel.in',
  includeServices: true,
  includeProjects: true,
  servicePriority: '0.7',
  projectPriority: '0.6',
  pages: [
    { path: '/', priority: '1.0', changefreq: 'weekly', enabled: true },
    { path: '/about', priority: '0.8', changefreq: 'monthly', enabled: true },
    { path: '/services', priority: '0.8', changefreq: 'weekly', enabled: true },
    { path: '/projects', priority: '0.8', changefreq: 'weekly', enabled: true },
    { path: '/contact', priority: '0.8', changefreq: 'monthly', enabled: true },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly', enabled: true },
    { path: '/terms', priority: '0.3', changefreq: 'yearly', enabled: true },
  ],
};

export interface NavLink {
  id: string;
  name: string;
  path: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface HeaderContent {
  navLinks: NavLink[];
  ctaText: string;
  ctaLink: string;
}

export interface FooterContent {
  tagline: string;
  socialLinks: SocialLink[];
  servicesLinks: string[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  copyrightText: string;
}

export const defaultHeaderContent: HeaderContent = {
  navLinks: [
    { id: '1', name: 'Home', path: '/' },
    { id: '2', name: 'About', path: '/about' },
    { id: '3', name: 'Services', path: '/services' },
    { id: '4', name: 'Projects', path: '/projects' },
    { id: '5', name: 'Career', path: '/career' },
    { id: '6', name: 'Contact', path: '/contact' },
  ],
  ctaText: 'Get Started',
  ctaLink: '/contact',
};

export const defaultFooterContent: FooterContent = {
  tagline: 'Where skills become strategy. Where creativity becomes community. Where brands are built with purpose.',
  socialLinks: [
    { id: '1', platform: 'Instagram', url: '#' },
    { id: '2', platform: 'Twitter', url: '#' },
    { id: '3', platform: 'LinkedIn', url: '#' },
  ],
  servicesLinks: [
    'Advertisement Design',
    'Social Media Content',
    'Website Development',
    'Video Production',
    'Marketing Strategy',
  ],
  contactEmail: 'hello@canvascartel.com',
  contactPhone: '+91 99711 93032',
  contactAddress: 'Creative Hub, Mumbai, India',
  copyrightText: 'Canvas Cartel. All rights reserved.',
};

// Default services data for initial seeding
export const defaultServices: ServiceItem[] = [
  {
    id: '1',
    icon: 'Megaphone',
    title: 'Advertisement Design',
    description: 'Eye-catching advertisements that communicate clearly and convert. We create visuals that stop the scroll and drive action across all platforms.',
    features: ['Print & Digital Advertisements', 'Banner & Display Ads', 'Outdoor Advertising Design', 'Brand Campaign Creatives', 'A/B Testing Variants'],
    pricing: 'Starting from ₹15,000',
  },
  {
    id: '2',
    icon: 'Share2',
    title: 'Social Media Content',
    description: 'Content that connects, not just posts. Strategic social media presence that builds community and drives meaningful engagement with your audience.',
    features: ['Content Strategy & Calendar', 'Post Design & Copywriting', 'Story & Reel Creation', 'Community Management', 'Analytics & Reporting'],
    pricing: 'Starting from ₹20,000/month',
  },
  {
    id: '3',
    icon: 'Globe',
    title: 'Website Development',
    description: 'Websites that blend stunning design with peak performance. Fast, responsive, and built for results that convert visitors into customers.',
    features: ['Custom Website Design', 'E-commerce Solutions', 'Landing Page Development', 'SEO Optimization', 'Maintenance & Support'],
    pricing: 'Starting from ₹50,000',
  },
  {
    id: '4',
    icon: 'Video',
    title: 'Video Production',
    description: 'Compelling video content that tells your brand story. From concept to final cut, we bring your vision to life with professional production quality.',
    features: ['Brand Films & Commercials', 'Product Showcase Videos', 'Social Media Videos', 'Event Coverage', 'Animation & Motion Graphics'],
    pricing: 'Starting from ₹25,000',
  },
  {
    id: '5',
    icon: 'Camera',
    title: 'Photo Production',
    description: 'Professional photography that captures your brand essence. High-quality visuals that make a lasting impact and elevate your brand image.',
    features: ['Product Photography', 'Corporate Headshots', 'Event Photography', 'Lifestyle Shoots', 'Photo Editing & Retouching'],
    pricing: 'Starting from ₹15,000',
  },
  {
    id: '6',
    icon: 'Target',
    title: 'Marketing Strategy',
    description: 'Complete marketing plans built around insight, creativity, and execution. Strategic roadmaps designed to drive measurable business growth.',
    features: ['Market Research & Analysis', 'Brand Positioning', 'Go-to-Market Strategy', 'Digital Marketing Strategy', 'Performance Tracking'],
    pricing: 'Starting from ₹35,000',
  },
  {
    id: '7',
    icon: 'Workflow',
    title: 'n8n Automation',
    description: 'Streamline your business with powerful workflow automation using n8n. Connect apps, automate repetitive tasks, and boost productivity effortlessly.',
    features: ['Workflow Design & Setup', 'API Integrations', 'CRM & Email Automation', 'Data Sync & Processing', 'Custom Triggers & Actions'],
    pricing: 'Starting from ₹30,000',
  },
];

export const defaultHero: HeroContent = {
  tagline: 'Our Services',
  title: 'Services Tailored for',
  titleHighlight: 'Impact',
  description: 'We partner with brands to build strong visual identities and smart marketing systems. Every solution is tailored, strategic, and driven by skill—not templates.',
};

export const defaultProcess: ProcessStep[] = [
  { id: '1', step: '01', title: 'Discovery', description: 'Understanding your brand, goals, and vision' },
  { id: '2', step: '02', title: 'Strategy', description: 'Developing a tailored plan for success' },
  { id: '3', step: '03', title: 'Creation', description: 'Bringing ideas to life with expert execution' },
  { id: '4', step: '04', title: 'Delivery', description: 'Launching and optimizing for results' },
];

export const defaultCategories = ['Branding', 'Web', 'Social', 'Video', 'Print'];

export const defaultPortfolioProjects: PortfolioProject[] = [
  { id: '1', title: 'TechFlow Rebrand', category: 'Branding', description: 'Complete brand identity redesign for a SaaS startup', imageUrl: '', gradient: 'linear-gradient(135deg, hsl(200, 80%, 50%) 0%, hsl(180, 80%, 40%) 100%)', client: 'TechFlow Inc.', year: '2024', fullDescription: 'A comprehensive rebranding project that transformed TechFlow from a generic SaaS company into a distinctive market leader.', challenge: 'TechFlow needed to differentiate themselves in a crowded market while maintaining trust with existing customers.', solution: 'We developed a fresh, modern brand identity that communicated innovation while preserving brand equity.', results: '45% increase in brand recognition and 30% boost in qualified leads within 6 months.', gallery: [] },
  { id: '2', title: 'Bloom E-commerce', category: 'Web', description: 'Modern e-commerce platform for a boutique flower shop', imageUrl: '', gradient: 'linear-gradient(135deg, hsl(340, 80%, 60%) 0%, hsl(320, 80%, 50%) 100%)', client: 'Bloom Florals', year: '2024', fullDescription: 'A beautiful, conversion-focused e-commerce experience that captures the elegance of fresh flowers.', challenge: 'Creating an online shopping experience that could convey the beauty and freshness of flowers.', solution: 'We built a visually stunning platform with intuitive navigation and seamless checkout.', results: '200% increase in online sales and 60% reduction in cart abandonment.', gallery: [] },
  { id: '3', title: 'Urban Café Campaign', category: 'Social', description: 'Social media strategy and content for café launch', imageUrl: '', gradient: 'linear-gradient(135deg, hsl(30, 80%, 50%) 0%, hsl(45, 80%, 55%) 100%)', client: 'Urban Café', year: '2023', fullDescription: 'A comprehensive social media campaign that built anticipation and drove foot traffic for a new café launch.', challenge: 'Building brand awareness from scratch in a competitive local market.', solution: 'We created a pre-launch buzz campaign with engaging content and influencer partnerships.', results: 'Sold out opening week with 500+ customers and 10K social media followers.', gallery: [] },
  { id: '4', title: 'Fitness Pro Video', category: 'Video', description: 'Brand film for premium fitness equipment company', imageUrl: '', gradient: 'linear-gradient(135deg, hsl(0, 80%, 50%) 0%, hsl(330, 80%, 50%) 100%)', client: 'Fitness Pro', year: '2024', fullDescription: 'A high-energy brand film showcasing the power and precision of premium fitness equipment.', challenge: 'Communicating product quality and inspiring action in a saturated fitness market.', solution: 'We produced a cinematic brand film featuring real athletes and powerful storytelling.', results: '2M views across platforms and 150% increase in website traffic.', gallery: [] },
  { id: '5', title: 'Artisan Print Series', category: 'Print', description: 'Print advertising campaign for luxury watches', imageUrl: '', gradient: 'linear-gradient(135deg, hsl(270, 80%, 50%) 0%, hsl(290, 80%, 60%) 100%)', client: 'Artisan Timepieces', year: '2023', fullDescription: 'An elegant print campaign that captured the craftsmanship and heritage of luxury watchmaking.', challenge: 'Standing out in luxury print advertising while honoring traditional craftsmanship.', solution: 'We created a series of minimalist, sophisticated ads highlighting intricate details.', results: 'Featured in 15 major publications with 25% increase in showroom visits.', gallery: [] },
  { id: '6', title: 'GreenLeaf Identity', category: 'Branding', description: 'Eco-friendly brand identity for organic products', imageUrl: '', gradient: 'linear-gradient(135deg, hsl(120, 60%, 40%) 0%, hsl(150, 60%, 50%) 100%)', client: 'GreenLeaf Organics', year: '2024', fullDescription: 'A nature-inspired brand identity that communicates sustainability and premium quality.', challenge: 'Creating an eco-friendly brand that feels premium rather than rustic.', solution: 'We developed a modern, clean visual identity with sustainable packaging solutions.', results: '40% increase in retail partnerships and recognition as a top sustainable brand.', gallery: [] },
];

export const defaultHomepageHero: HomepageHeroContent = {
  badge: 'Creative Design & Marketing Studio',
  title: 'Where Skills Become',
  titleHighlight: 'Strategy',
  description: 'We turn creativity into impact and collaboration into growth. From eye-catching advertisements to complete marketing plans—we help brands show up with clarity, confidence, and consistency.',
  primaryButtonText: 'Start Your Project',
  primaryButtonLink: '/contact',
  secondaryButtonText: 'View Our Work',
  secondaryButtonLink: '/projects',
  stats: [
    { number: '50+', label: 'Projects Delivered' },
    { number: '30+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
  ],
};

export const defaultHomepageCTA: HomepageCTAContent = {
  title: 'Ready to Build Your',
  titleHighlight: "Brand's Future?",
  description: "For our clients, we're not just an agency—we're a creative partner. We listen, understand your vision, and build marketing tools that help your brand stand out in a crowded world.",
  primaryButtonText: "Let's Talk",
  primaryButtonLink: '/contact',
  secondaryButtonText: 'Explore Services',
  secondaryButtonLink: '/services',
};

export const defaultAboutContent: AboutContent = {
  hero: {
    tagline: 'About Canvas Cartel',
    title: 'Where Creativity Becomes',
    titleHighlight: 'Community',
    description: 'Canvas Cartel is a creative design and marketing studio built on one powerful belief: great brands are created by great people.',
  },
  main: {
    title: 'More Than a Service Provider—',
    titleHighlight: 'A Creative Partner',
    paragraphs: [
      'We exist to turn skill into strategy, creativity into impact, and collaboration into growth. From eye-catching advertisements and scroll-stopping social media content to website development, video and photo production, and complete marketing plans—we help brands show up with clarity, confidence, and consistency.',
      "But Canvas Cartel is more than a service provider. It's a creative community where skilled, curious, and ambitious creatives come together to do meaningful work.",
      "For our clients, we're not just an agency—we're a creative partner. We listen, understand your vision, and build marketing tools that help your brand stand out in a crowded world.",
    ],
    brandName: 'Canvas Cartel',
    brandTagline: 'CC',
    establishedYear: 'Est. 2020',
  },
  philosophy: {
    tagline: 'Our Philosophy',
    title: 'People Are Our',
    titleHighlight: 'Superpower',
    description: "Our strongest USP isn't software, equipment, or trends—it's people. Every designer, marketer, developer, strategist, photographer, and filmmaker who joins Canvas Cartel brings a unique edge.",
  },
  values: [
    { id: '1', icon: 'Heart', title: 'People First', description: 'We invest deeply in the skills, ideas, and growth of our team. Every person brings a unique edge—and we treat that edge as the main ingredient for success.' },
    { id: '2', icon: 'Target', title: 'Strategic Excellence', description: 'Every solution is tailored, strategic, and driven by skill—not templates. We create value for our clients and meaning for our team.' },
    { id: '3', icon: 'Zap', title: 'Creative Impact', description: 'When skilled people are supported, trusted, and challenged, exceptional work naturally follows. That\'s how we create lasting impact.' },
    { id: '4', icon: 'Users', title: 'Collaborative Growth', description: 'We\'re building a space where ideas are shared, talents are sharpened, and collaboration fuels growth for everyone involved.' },
  ],
  stats: [
    { number: '50+', label: 'Projects Completed' },
    { number: '30+', label: 'Happy Clients' },
    { number: '15+', label: 'Team Members' },
    { number: '5+', label: 'Years Experience' },
  ],
  creatorsCard: {
    title: 'A Place for Creators',
    description: "Canvas Cartel welcomes skilled, curious, and ambitious creatives who want more than just a job. We're building a space where ideas are shared, talents are sharpened, and collaboration fuels growth.",
    highlight: 'If you believe your skill deserves a platform—and your work deserves impact—you belong here.',
  },
  brandsCard: {
    title: 'A Partner for Brands',
    description: "For our clients, we're not just an agency—we're a creative partner. We listen, understand your vision, and build marketing tools that help your brand stand out in a crowded world.",
    highlight: 'When you work with Canvas Cartel, you\'re backed by a team that genuinely cares about your success.',
  },
  cta: {
    title: 'Ready to',
    titleHighlight: 'Collaborate?',
    description: "Whether you're a brand looking for a creative partner or a creator seeking a platform—let's connect and build something amazing.",
    buttonText: 'Get in Touch',
  },
};

export const defaultContactContent: ContactContent = {
  hero: {
    tagline: 'Get in Touch',
    title: "Let's Build Something",
    titleHighlight: 'Amazing',
    description: "Ready to take your brand to the next level? We'd love to hear from you. Reach out and let's start a conversation.",
  },
  infoTitle: 'Contact Information',
  infoDescription: "Reach out to us through any of these channels. We're here to help and typically respond within 24 hours.",
  contactInfo: [
    { id: '1', icon: 'Mail', title: 'Email', value: 'hello@canvascartel.com' },
    { id: '2', icon: 'Phone', title: 'Phone', value: '+91 98765 43210' },
    { id: '3', icon: 'MapPin', title: 'Location', value: 'Creative Hub, Mumbai, India' },
    { id: '4', icon: 'MessageSquare', title: 'Social Media', value: '@canvascartel' },
  ],
  whyChooseTitle: 'Why Choose Us?',
  whyChooseItems: [
    { id: '1', text: 'Response within 24 hours' },
    { id: '2', text: 'Free initial consultation' },
    { id: '3', text: 'Tailored solutions, not templates' },
  ],
  formTitle: 'Send Us a Message',
  serviceOptions: [
    { value: 'advertisement', label: 'Advertisement Design' },
    { value: 'social-media', label: 'Social Media Content' },
    { value: 'website', label: 'Website Development' },
    { value: 'video', label: 'Video Production' },
    { value: 'photo', label: 'Photo Production' },
    { value: 'marketing', label: 'Marketing Strategy' },
    { value: 'other', label: 'Other' },
  ],
  adminNotificationEmail: '',
};

// Helper to get default content based on section
const getDefaultContent = (section: string): unknown => {
  const defaults: Record<string, unknown> = {
    'branding': defaultBrandingContent,
    'homepage': { hero: defaultHomepageHero, cta: defaultHomepageCTA },
    'services': { services: defaultServices, hero: defaultHero, process: defaultProcess },
    'about': defaultAboutContent,
    'contact': defaultContactContent,
    'portfolio': { projects: defaultPortfolioProjects, categories: defaultCategories },
    'seo': defaultSEOContent,
    'header-footer': { header: defaultHeaderContent, footer: defaultFooterContent },
    'popup-offer': defaultPopupOfferContent,
    'loading-page': defaultLoadingPageContent,
    'webhook_settings': defaultWebhookSettingsContent,
    'career_settings': defaultCareerSettingsContent,
    'robots': defaultRobotsContent,
    'sitemap': defaultSitemapContent,
  };
  return defaults[section] || null;
};

export function useSiteContent<T>(section: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['site-content', section],
    queryFn: async (): Promise<T | null> => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('section', section)
          .maybeSingle();

        if (error) {
          console.warn('Supabase fetch error:', error.message);
          return getDefaultContent(section) as T | null;
        }

        if (data?.content) {
          return data.content as T;
        }

        return getDefaultContent(section) as T | null;
      } catch (error) {
        console.warn('Supabase fetch failed, using defaults:', error);
        return getDefaultContent(section) as T | null;
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const updateMutation = useMutation({
    mutationFn: async (content: T) => {
      // Check if content exists
      const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('section', section)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('site_content')
          .update({ content: JSON.parse(JSON.stringify(content)), updated_at: new Date().toISOString() })
          .eq('section', section);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('site_content')
          .insert([{ section, content: JSON.parse(JSON.stringify(content)) }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch all site-content queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      queryClient.refetchQueries({ queryKey: ['site-content', section] });
      toast.success('Content saved successfully');
    },
    onError: (error) => {
      console.error('Failed to save content:', error);
      toast.error('Failed to save content');
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateContent: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    refetch: query.refetch,
  };
}
