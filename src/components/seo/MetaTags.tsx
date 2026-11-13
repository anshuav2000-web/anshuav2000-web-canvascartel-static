import { useLocation } from "react-router-dom";
import { useSiteContent, SiteContentContent, defaultSiteContentContent } from "@/hooks/useSiteContent";
import { Organization, WebSite, Website } from "schema.org";

export const StructuredData = () => {
  const location = useLocation();
  const { data } = useSiteContent<SiteContentContent>("site_content");
  const siteData = data || defaultSiteContentContent;

  const buildOrganizationSchema = (): Organization => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteData.siteName || "Canvas Cartel",
    url: siteData.siteUrl || "https://canvascartel.in",
    logo: siteData.logoUrl || "",
    description: siteData.description || "Creative design and marketing studio",
    founder: {
      "@type": "Person",
      name: siteData.founderName || "Priyankur",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteData.addressCity || "Mumbai",
      addressCountry: siteData.addressCountry || "India",
      addressRegion: siteData.addressState || "Maharashtra",
    },
    email: siteData.contactEmail || "hello@canvascartel.com",
    telephone: siteData.contactPhone || "+91 99711 93032",
    sameAs: [
      siteData.facebookUrl || "",
      siteData.twitterUrl || "",
      siteData.linkedinUrl || "",
      siteData.instagramUrl || "",
    ].filter(Boolean),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "120",
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    }],
  });

  // Build WebSite schema
  const buildWebSiteSchema = (): WebSite => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteData.siteName || "Canvas Cartel",
    url: siteData.siteUrl || "https://canvascartel.in",
    description: siteData.description || "Creative design and marketing studio",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteData.siteUrl || "https://canvascartel.in"}/search?q={search_term}`,
      },
      query-input: "required name=search_term",
    },
  });

  // Generate structured data based on current route
  let schema: unknown = null;

  if (location.pathname === "/") {
    // Home page
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        buildOrganizationSchema(),
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteData.siteName || "Canvas Cartel",
          url: siteData.siteUrl || "https://canvascartel.in",
          description: siteData.description || "Creative design and marketing studio",
        },
      ],
    };
  } else if (location.pathname.startsWith("/services/")) {
    // Service detail page
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        buildOrganizationSchema(),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: siteData.serviceName || "Branding & Graphic Design",
          provider: {
            "@type": "Organization",
            name: siteData.siteName || "Canvas Cartel",
            url: siteData.siteUrl || "https://canvascartel.in",
          },
          areaServed: siteData.targetAudience || "Startups, SMEs, Healthcare",
          offers: {
            "@type": "Offer",
            priceRange: "$$",
            description: "Custom branding and graphic design services",
          },
        },
      ],
    };
  } else if (location.pathname === "/contact") {
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        buildOrganizationSchema(),
        {
          "@context": "https://schema.org",
          "@type": "ContactPoint",
          telephone: siteData.contactPhone || "+91 99711 93032",
          contactType: "customer service",
          email: siteData.contactEmail || "hello@canvascartel.com",
          availableLanguage: ["English", "Hindi"],
          areaServed: "India",
        },
      ],
    };
  } else if (location.pathname.startsWith("/blog/")) {
    // Blog post page
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        buildOrganizationSchema(),
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: siteData.blogTitle || "Latest News",
          description: siteData.blogDescription || "Creative design and marketing insights",
          author: {
            "@type": "Person",
            name: siteData.founderName || "Priyankur",
          },
          datePublished: siteData.blogDate || new Date().toISOString(),
          image: siteData.blogImage || "",
          publisher: {
            "@type": "Organization",
            name: siteData.siteName || "Canvas Cartel",
          },
        },
      ],
    };
  } else {
    // Default: Organization + WebSite
    schema = {
      "@context": "https://schema.org",
      "@graph": [buildOrganizationSchema(), buildWebSiteSchema()],
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  twitterImage?: string;
  canonical?: string;
  noindex?: boolean;
}

export const MetaTags = ({
  title,
  description,
  keywords,
  ogImage,
  twitterImage,
  canonical,
  noindex = false,
}: MetaTagsProps) => {
  const location = useLocation();
  const { data } = useSiteContent<SiteContentContent>("site_content");
  const siteData = data || defaultSiteContentContent;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>
        {title ? `${title} | ${siteData.siteName || "Canvas Cartel"}` : siteData.siteName || "Canvas Cartel"}
      </title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={siteData.founderName || "Priyankur"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0a0a0a" />
      {noindex && <meta name="robots" content="noindex" />}

      {/* Canonical URL */}
      {canonical || (
        <link
          rel="canonical"
          href={`${location.origin}${location.pathname}`}
        />
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteData.siteName || "Canvas Cartel"} />
      <meta property="og:url" content={`${location.origin}${location.pathname}`} />
      <meta property="og:title" content={title || siteData.siteName || "Canvas Cartel"} />
      <meta
        property="og:description"
        content={description || siteData.description || "Creative design and marketing studio"}
      />
      <meta property="og:image" content={ogImage || siteData.ogImage || siteData.siteUrl + "/og-image.png"} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteData.twitterHandle || "@canvascartel"} />
      <meta name="twitter:title" content={title || siteData.siteName || "Canvas Cartel"} />
      <meta
        name="twitter:description"
        content={description || siteData.description || "Creative design and marketing studio"}
      />
      <meta name="twitter:image" content={twitterImage || ogImage || siteData.ogImage || siteData.siteUrl + "/og-image.png"} />
      <meta name="twitter:creator" content={siteData.twitterHandle || "@canvascartel"} />
    </>
  );
};
