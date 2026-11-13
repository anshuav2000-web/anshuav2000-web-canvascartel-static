import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { LeadTable } from '@/components/admin/LeadTable';
import { IconBrowser } from '@/components/admin/IconBrowser';
import { SEOQuickActions } from '@/components/admin/SEOQuickActions';

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your lead pipeline and site health</p>
          </div>
          <IconBrowser />
        </div>
        
        <DashboardStats />

        {/* SEO Quick Actions */}
        <SEOQuickActions />
        
        <div>
          <h2 className="text-xl font-display font-semibold mb-4">Recent Leads</h2>
          <LeadTable />
        </div>
      </div>
    </AdminLayout>
  );
}
