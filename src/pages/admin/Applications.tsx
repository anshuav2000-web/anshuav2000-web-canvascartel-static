import { AdminLayout } from '@/components/admin/AdminLayout';
import { ApplicationTable } from '@/components/admin/ApplicationTable';

export default function Applications() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient">Job Applications</h1>
          <p className="text-muted-foreground mt-1">Manage and track all job applications</p>
        </div>
        
        <ApplicationTable />
      </div>
    </AdminLayout>
  );
}
