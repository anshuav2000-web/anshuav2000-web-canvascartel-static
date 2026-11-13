import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import { DynamicMeta } from "@/components/DynamicMeta";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageLoader } from "@/components/PageLoader";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import N8nAutomation from "./pages/N8nAutomation";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import Leads from "./pages/admin/Leads";
import Content from "./pages/admin/Content";
import ProjectsAdmin from "./pages/admin/Projects";
import HomepageAdmin from "./pages/admin/Homepage";
import AboutAdmin from "./pages/admin/About";
import ServicesAdmin from "./pages/admin/Services";
import ContactAdmin from "./pages/admin/Contact";
import BrandingAdmin from "./pages/admin/Branding";
import SEOAdmin from "./pages/admin/SEO";
import SEOToolsAdmin from "./pages/admin/SEOTools";
import HeaderFooterAdmin from "./pages/admin/HeaderFooter";
import PopupOffersAdmin from "./pages/admin/PopupOffers";
import LoadingPageAdmin from "./pages/admin/LoadingPage";
import LogoAdmin from "./pages/admin/Logo";
import WebhookSettingsAdmin from "./pages/admin/WebhookSettings";
import SitemapRobotsAdmin from "./pages/admin/SitemapRobots";
import ApplicationsAdmin from "./pages/admin/Applications";
import CareerSettingsAdmin from "./pages/admin/CareerSettings";
import JobOpeningsAdmin from "./pages/admin/JobOpenings";
import NotFound from "./pages/NotFound";

// Configure QueryClient with aggressive cache invalidation for instant admin updates
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always consider data stale to fetch fresh content
      gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      refetchOnMount: true, // Always refetch on component mount
      retry: 1, // Retry once on failure
    },
  },
});
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DynamicFavicon />
        <BrowserRouter>
          <ScrollToTop />
          <PageLoader />
          <DynamicMeta />
          <GoogleAnalytics />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/n8n-automation" element={<N8nAutomation />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/n8n-automation" element={<N8nAutomation />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/career" element={<Career />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads"
              element={
                <ProtectedRoute requireAdmin>
                  <Leads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/branding"
              element={
                <ProtectedRoute requireAdmin>
                  <BrandingAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/seo"
              element={
                <ProtectedRoute requireAdmin>
                  <SEOAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/header-footer"
              element={
                <ProtectedRoute requireAdmin>
                  <HeaderFooterAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/homepage"
              element={
                <ProtectedRoute requireAdmin>
                  <HomepageAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/about"
              element={
                <ProtectedRoute requireAdmin>
                  <AboutAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute requireAdmin>
                  <ServicesAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contact"
              element={
                <ProtectedRoute requireAdmin>
                  <ContactAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute requireAdmin>
                  <Content />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute requireAdmin>
                  <ProjectsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/popup-offers"
              element={
                <ProtectedRoute requireAdmin>
                  <PopupOffersAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/loading-page"
              element={
                <ProtectedRoute requireAdmin>
                  <LoadingPageAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logo"
              element={
                <ProtectedRoute requireAdmin>
                  <LogoAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/webhook-settings"
              element={
                <ProtectedRoute requireAdmin>
                  <WebhookSettingsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sitemap-robots"
              element={
                <ProtectedRoute requireAdmin>
                  <SitemapRobotsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/seo-tools"
              element={
                <ProtectedRoute requireAdmin>
                  <SEOToolsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute requireAdmin>
                  <ApplicationsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/career-settings"
              element={
                <ProtectedRoute requireAdmin>
                  <CareerSettingsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/job-openings"
              element={
                <ProtectedRoute requireAdmin>
                  <JobOpeningsAdmin />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
