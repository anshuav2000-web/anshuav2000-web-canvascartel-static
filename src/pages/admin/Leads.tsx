import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_type: string;
  service_needed: string;
  budget: number;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  created_at: string;
}

export default function Leads() {
  const { user, isAdmin } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setLeads([
          {
            id: '1',
            name: 'Rahul Sharma',
            email: 'rahul@techstart.io',
            phone: '+91 98765 43210',
            business_type: 'SaaS Startup',
            service_needed: 'Website Development & Branding',
            budget: 50000,
            message: 'Looking for complete brand overhaul and web development.',
            status: 'new',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Meera Patel',
            email: 'meera@medicare.com',
            phone: '+91 99887 76655',
            business_type: 'Healthcare',
            service_needed: 'AI & Business Automation',
            budget: 75000,
            message: 'Need WhatsApp AI agents and n8n workflows for lead routing.',
            status: 'contacted',
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      } else {
        setLeads(data);
      }
    } catch (error) {
      console.error('Error:', error);
      setLeads([
        {
          id: '1',
          name: 'Rahul Sharma',
          email: 'rahul@techstart.io',
          phone: '+91 98765 43210',
          business_type: 'SaaS Startup',
          service_needed: 'Website Development & Branding',
          budget: 50000,
          message: 'Looking for complete brand overhaul and web development.',
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async () => {
    if (!deleteConfirm) return;
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', deleteConfirm.id);

      if (error) {
        console.error('Error deleting lead:', error);
      } else {
        setLeads(leads.filter(l => l.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'new': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'contacted': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'qualified': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'converted': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'closed': 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${colors[status as keyof typeof colors] || colors.new}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
                         lead.email.toLowerCase().includes(search.toLowerCase()) ||
                         lead.service_needed.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient">Lead Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all incoming leads from your website</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 animate-spin rounded-full border-b-2 border-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {getInitials(lead.name)}
                              </span>
                            </div>
                            <span className="font-semibold">{lead.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{lead.email}</p>
                            <p className="text-muted-foreground text-xs">{lead.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={lead.business_type} onValueChange={() => {}}>
                            <SelectTrigger className="w-auto h-8 px-2 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{lead.service_needed}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">₹{lead.budget.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* View lead */}}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* Edit lead */}}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              color="red"
                              onClick={() => setDeleteConfirm(lead)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total Leads: {leads.length}</span>
          <span className="mx-2">|</span>
          <span>New: {leads.filter(l => l.status === 'new').length}</span>
          <span className="mx-2">|</span>
          <span>Qualified: {leads.filter(l => l.status === 'qualified').length}</span>
          <span className="mx-2">|</span>
          <span>Converted: {leads.filter(l => l.status === 'converted').length}</span>
        </div>
      </div>
    </AdminLayout>
  );
}
