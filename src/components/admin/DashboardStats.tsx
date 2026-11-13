import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Clock, CheckCircle } from 'lucide-react';

export const DashboardStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('status');
      
      if (error) throw error;
      
      const total = leads?.length || 0;
      const newLeads = leads?.filter(l => l.status === 'new').length || 0;
      const inProgress = leads?.filter(l => l.status === 'in_progress').length || 0;
      const closed = leads?.filter(l => l.status === 'closed').length || 0;
      
      return { total, new: newLeads, inProgress, closed };
    }
  });

  const statCards = [
    {
      title: 'Total Leads',
      value: stats?.total || 0,
      icon: Users,
      className: 'text-primary'
    },
    {
      title: 'New',
      value: stats?.new || 0,
      icon: UserPlus,
      className: 'text-blue-400'
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      icon: Clock,
      className: 'text-amber-400'
    },
    {
      title: 'Closed',
      value: stats?.closed || 0,
      icon: CheckCircle,
      className: 'text-green-400'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${stat.className}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
