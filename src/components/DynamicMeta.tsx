import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteContent, SEOContent, defaultSEOContent, BrandingContent, ServicesContent, PortfolioContent, defaultServices, defaultPortfolioProjects } from "@/hooks/useSiteContent";

const pathToPageKey: Record<string, keyof SEOContent['pages']> = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/projects': 'projects',
  '/contact': 'contact',
};

// Helper to set or create a meta tag
const setMetaTag = (selector: string, attribute: string, value: string, createAttribute?: string) => {
  let meta = document.querySelector(selector) as HTMLMetaElement;
  if (!meta && value) {
    meta = document.createElement('meta');
    if (createAttribute) {
      meta.setAttribute(createAttribute.split('=')[0], createAttribute.split('=')[1] || attribute.split('=')[1]);
    }
    document.head.appendChild(meta);
  }
  if (meta) {
    meta.content = value;
  }
};

// Helper to set or create a link tag
const setLinkTag = (rel: string, href: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!link && href) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  if (link) {
    link.href = href;
  }
};

// Helper to remove existing schema by type
const removeSchema = (type: string) => {
  const existing = document.querySelector(`script[type="application/ld+json"][data-type="${type}"]`);
  if (existing) existing.remove();
};

// Helper to add schema
const addSchema = (type: string, schema: Record<string, unknown>) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-type', type);
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

export const DynamicMeta = () => {
  const location = useLocation();
  const { data: seo } = useSiteContent<SEOContent>('seo');
  const { data: branding } = useSiteContent<BrandingContent>('branding');
  const { data: servicesData } = useSiteContent<ServicesContent>('services');
  const { data: portfolioData } = useSiteContent<PortfolioContent>('portfolio');

  useEffect(() => {
    const content = seo ? { ...defaultSEOContent, ...seo } : defaultSEOContent;
    const siteUrl = (content.siteUrl || 'https://canvascartel.in').replace(/\/$/, '');
    
    // CRITICAL FIX: Self-referencing canonical for each page
    // Normalize path - remove trailing slash for consistency, but keep root as /
    const currentPath = location.pathname;
    const normalizedPath = currentPath === '/' ? '' : currentPath.replace(/\/$/, '');
    
    // Each page gets its own unique canonical URL (self-referencing)
    const canonicalUrl = `${siteUrl}${normalizedPath || '/'}`;
    
    let title = content.defaultTitle;
    let description = content.defaultDescription;
    // PRIORITY: Use SEO defaultOgImage first, then branding favicon/logo, never fall back to old URLs
    let ogImage = content.defaultOgImage || branding?.faviconUrl || branding?.logoUrl || '';
    let keywords = content.defaultKeywords || '';

    // Check for static pages
    const pageKey = pathToPageKey[currentPath];
    if (pageKey) {
      const pageMeta = content.pages[pageKey];
      title = pageMeta?.title || content.defaultTitle;
      description = pageMeta?.description || content.defaultDescription;
      ogImage = pageMeta?.ogImage || ogImage;
      keywords = pageMeta?.keywords || keywords;
    }
    
    // Check for service detail pages
    const serviceMatch = currentPath.match(/^\/services\/(.+)$/);
    if (serviceMatch) {
      const serviceId = serviceMatch[1];
      const services = servicesData?.services || defaultServices;
      const service = services.find(s => s.id === serviceId);
      if (service) {
        title = `${service.title} Services | Canvas Cartel India`;
        description = service.description.substring(0, 155) + '...';
        keywords = `${service.title}, ${service.features.slice(0, 3).join(', ')}, creative agency India, Canvas Cartel`;
        if (service.gallery && service.gallery.length > 0) {
          ogImage = service.gallery[0];
        }
      }
    }
    
    // Check for project detail pages
    const projectMatch = currentPath.match(/^\/projects\/(.+)$/);
    if (projectMatch) {
      const projectId = projectMatch[1];
      const projects = portfolioData?.projects || defaultPortfolioProjects;
      const project = projects.find(p => p.id === projectId);
      if (project) {
        title = `${project.title} - Case Study | Canvas Cartel`;
        description = (project.fullDescription || project.description).substring(0, 155) + '...';
        keywords = `${project.title}, ${project.category}, portfolio, case study, Canvas Cartel India`;
        if (project.imageUrl) {
          ogImage = project.imageUrl;
        } else if (project.gallery && project.gallery.length > 0) {
          ogImage = project.gallery[0];
        }
      }
    }

    // Title
    document.title = title;

    // Meta description
    setMetaTag('meta[name="description"]', 'name="description"', description, 'name=description');

    // Keywords - include primary keywords across all important pages
    const enhancedKeywords = keywords || 'creative agency, marketing studio, advertisement design, social media marketing, website development, video production, branding, digital marketing, India, Mumbai';
    setMetaTag('meta[name="keywords"]', 'name="keywords"', enhancedKeywords, 'name=keywords');

    // CRITICAL: Self-referencing canonical URL for each page
    setLinkTag('canonical', canonicalUrl);

    // Open Graph tags
    setMetaTag('meta[property="og:title"]', 'property="og:title"', title, 'property=og:title');
    setMetaTag('meta[property="og:description"]', 'property="og:description"', description, 'property=og:description');
    setMetaTag('meta[property="og:url"]', 'property="og:url"', canonicalUrl, 'property=og:url');
    setMetaTag('meta[property="og:type"]', 'property="og:type"', 'website', 'property=og:type');
    setMetaTag('meta[property="og:site_name"]', 'property="og:site_name"', 'Canvas Cartel', 'property=og:site_name');
    setMetaTag('meta[property="og:locale"]', 'property="og:locale"', 'en_IN', 'property=og:locale');

    // OG Image
    if (ogImage) {
      setMetaTag('meta[property="og:image"]', 'property="og:image"', ogImage, 'property=og:image');
      setMetaTag('meta[property="og:image:width"]', 'property="og:image:width"', '1200', 'property=og:image:width');
      setMetaTag('meta[property="og:image:height"]', 'property="og:image:height"', '630', 'property=og:image:height');
      setMetaTag('meta[property="og:image:alt"]', 'property="og:image:alt"', title, 'property=og:image:alt');
    }

    // Twitter Card tags
    setMetaTag('meta[name="twitter:card"]', 'name="twitter:card"', 'summary_large_image', 'name=twitter:card');
    setMetaTag('meta[name="twitter:title"]', 'name="twitter:title"', title, 'name=twitter:title');
    setMetaTag('meta[name="twitter:description"]', 'name="twitter:description"', description, 'name=twitter:description');
    
    if (content.twitterHandle) {
      setMetaTag('meta[name="twitter:site"]', 'name="twitter:site"', content.twitterHandle, 'name=twitter:site');
      setMetaTag('meta[name="twitter:creator"]', 'name="twitter:creator"', content.twitterHandle, 'name=twitter:creator');
    }
    
    if (ogImage) {
      setMetaTag('meta[name="twitter:image"]', 'name="twitter:image"', ogImage, 'name=twitter:image');
      setMetaTag('meta[name="twitter:image:alt"]', 'name="twitter:image:alt"', title, 'name=twitter:image:alt');
    }

    // Robots meta - ensure pages are indexable
    setMetaTag('meta[name="robots"]', 'name="robots"', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', 'name=robots');
    setMetaTag('meta[name="googlebot"]', 'name="googlebot"', 'index, follow', 'name=googlebot');
    setMetaTag('meta[name="author"]', 'name="author"', 'Canvas Cartel', 'name=author');

    // Remove all existing schemas before adding new ones
    removeSchema('organization');
    removeSchema('localbusiness');
    removeSchema('website');
    removeSchema('webpage');
    removeSchema('service');
    removeSchema('project');
    removeSchema('breadcrumb');

    // Organization Schema (JSON-LD)
    if (content.organizationSchema?.name) {
      const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": content.organizationSchema.name,
        "description": content.organizationSchema.description || content.defaultDescription,
        "url": siteUrl,
        ...(content.organizationSchema.logo && { 
          "logo": {
            "@type": "ImageObject",
            "url": content.organizationSchema.logo,
            "width": 512,
            "height": 512
          }
        }),
        ...(content.organizationSchema.sameAs?.length && { 
          "sameAs": content.organizationSchema.sameAs.filter(Boolean) 
        }),
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Mumbai",
          "addressRegion": "Maharashtra",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["English", "Hindi"]
        }
      };
      addSchema('organization', orgSchema);
    }

    // LocalBusiness Schema for better local SEO
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      "name": content.organizationSchema?.name || "Canvas Cartel",
      "description": "Creative design and marketing studio offering advertisement design, social media content, website development, video production, and marketing strategy services in India.",
      "url": siteUrl,
      "image": ogImage || content.organizationSchema?.logo,
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mumbai",
        "addressRegion": "Maharashtra",
        "postalCode": "400001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "19.0760",
        "longitude": "72.8777"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "50"
      }
    };
    addSchema('localbusiness', localBusinessSchema);

    // WebSite Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "name": content.organizationSchema?.name || "Canvas Cartel",
      "url": siteUrl,
      "description": content.defaultDescription,
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/services?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    addSchema('website', websiteSchema);

    // WebPage Schema for current page
    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}/#webpage`,
      "name": title,
      "description": description,
      "url": canonicalUrl,
      "isPartOf": {
        "@id": `${siteUrl}/#website`
      },
      "about": {
        "@id": `${siteUrl}/#organization`
      },
      "inLanguage": "en-IN",
      "dateModified": new Date().toISOString().split('T')[0]
    };
    addSchema('webpage', webPageSchema);

    // BreadcrumbList Schema for navigation
    const pathSegments = currentPath.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const breadcrumbItems = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        }
      ];
      
      let currentUrl = siteUrl;
      pathSegments.forEach((segment, index) => {
        currentUrl += `/${segment}`;
        breadcrumbItems.push({
          "@type": "ListItem",
          "position": index + 2,
          "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          "item": currentUrl
        });
      });

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
      };
      addSchema('breadcrumb', breadcrumbSchema);
    }

    // Service Schema for service detail pages
    if (serviceMatch) {
      const serviceId = serviceMatch[1];
      const services = servicesData?.services || defaultServices;
      const service = services.find(s => s.id === serviceId);
      
      if (service) {
        const serviceSchema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${canonicalUrl}/#service`,
          "name": service.title,
          "description": service.fullDescription || service.description,
          "url": canonicalUrl,
          "provider": {
            "@id": `${siteUrl}/#organization`
          },
          "areaServed": {
            "@type": "Country",
            "name": "India"
          },
          "offers": {
            "@type": "Offer",
            "description": service.pricing,
            "priceCurrency": "INR"
          },
          "serviceType": service.title
        };
        addSchema('service', serviceSchema);
      }
    }

    // CreativeWork Schema for project detail pages
    if (projectMatch) {
      const projectId = projectMatch[1];
      const projects = portfolioData?.projects || defaultPortfolioProjects;
      const project = projects.find(p => p.id === projectId);
      
      if (project) {
        const projectSchema = {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "@id": `${canonicalUrl}/#creativework`,
          "name": project.title,
          "description": project.fullDescription || project.description,
          "url": canonicalUrl,
          "creator": {
            "@id": `${siteUrl}/#organization`
          },
          ...(project.imageUrl && { "image": project.imageUrl }),
          ...(project.year && { "dateCreated": project.year }),
          ...(project.client && { "about": project.client }),
          "genre": project.category
        };
        addSchema('project', projectSchema);
      }
    }

  }, [location.pathname, seo, branding, servicesData, portfolioData]);

  return null;
};
