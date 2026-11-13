import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useSiteContent, BrandingContent, defaultBrandingContent } from '@/hooks/useSiteContent';
import { GenerateSitemapRobots } from '@/components/admin/GenerateSitemapRobots';
import { 
  LayoutDashboard, 
  Users, 
  LogOut,
  ChevronLeft,
  FileText,
  Image,
  Home,
  Info,
  Mail,
  Briefcase,
  UserPlus,
  Palette,
  Search,
  PanelTop,
  Gift,
  Loader,
  ImageIcon,
  Webhook,
  Map,
  Settings,
  Zap
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

// Main navigation links
const mainLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Leads', path: '/admin/leads', icon: Users },
  { name: 'Applications', path: '/admin/applications', icon: UserPlus },
];

// Content management links
const contentLinks = [
  { name: 'Homepage', path: '/admin/homepage', icon: Home },
  { name: 'About', path: '/admin/about', icon: Info },
  { name: 'Services', path: '/admin/services', icon: Briefcase },
  { name: 'Projects', path: '/admin/projects', icon: Image },
  { name: 'Contact', path: '/admin/contact', icon: Mail },
  { name: 'Content', path: '/admin/content', icon: FileText },
];

// SEO & Marketing links
const seoLinks = [
  { name: 'SEO Tools', path: '/admin/seo-tools', icon: Zap },
  { name: 'SEO Settings', path: '/admin/seo', icon: Search },
  { name: 'Sitemap & Robots', path: '/admin/sitemap-robots', icon: Map },
];

// Appearance links
const appearanceLinks = [
  { name: 'Branding', path: '/admin/branding', icon: Palette },
  { name: 'Site Logo', path: '/admin/logo', icon: ImageIcon },
  { name: 'Header & Footer', path: '/admin/header-footer', icon: PanelTop },
  { name: 'Loading Page', path: '/admin/loading-page', icon: Loader },
  { name: 'Popup Offers', path: '/admin/popup-offers', icon: Gift },
];

// Settings links
const settingsLinks = [
  { name: 'Webhook Settings', path: '/admin/webhook-settings', icon: Webhook },
  { name: 'Career Settings', path: '/admin/career-settings', icon: Settings },
  { name: 'Job Openings', path: '/admin/job-openings', icon: Briefcase },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { data: branding } = useSiteContent<BrandingContent>('branding');
  const { state } = useSidebar();
  
  const siteName = branding?.siteName || defaultBrandingContent.siteName;
  const logoUrl = branding?.logoUrl || '';
  const isCollapsed = state === 'collapsed';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="text-sm">Back to Site</span>}
        </Link>
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={siteName} 
            className={isCollapsed ? "h-6 w-6 object-contain" : "h-8 max-w-[150px] object-contain"}
          />
        ) : (
          <h1 className={`font-display font-bold text-gradient ${isCollapsed ? 'text-sm' : 'text-xl'}`}>
            {isCollapsed ? siteName.charAt(0) : siteName}
          </h1>
        )}
        {!isCollapsed && <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>}
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <SidebarMenuItem key={link.path}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={link.name}>
                      <Link to={link.path}>
                        <Icon className="h-5 w-5" />
                        <span>{link.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <SidebarMenuItem key={link.path}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={link.name}>
                      <Link to={link.path}>
                        <Icon className="h-5 w-5" />
                        <span>{link.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SEO & Marketing */}
        <SidebarGroup>
          <SidebarGroupLabel>SEO & Marketing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {seoLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <SidebarMenuItem key={`${link.path}-${index}`}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={link.name}>
                      <Link to={link.path}>
                        <Icon className="h-5 w-5" />
                        <span>{link.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Appearance */}
        <SidebarGroup>
          <SidebarGroupLabel>Appearance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appearanceLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <SidebarMenuItem key={link.path}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={link.name}>
                      <Link to={link.path}>
                        <Icon className="h-5 w-5" />
                        <span>{link.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <SidebarMenuItem key={link.path}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={link.name}>
                      <Link to={link.path}>
                        <Icon className="h-5 w-5" />
                        <span>{link.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <GenerateSitemapRobots />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!isCollapsed && (
          <div className="px-2 py-2 mb-2">
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <SidebarTrigger />
          </div>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
