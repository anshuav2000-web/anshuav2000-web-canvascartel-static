import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LeadStatusBadge } from './LeadStatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { Save, Mail, Phone, Building, Calendar, DollarSign } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Lead = Database['public']['Tables']['leads']['Row'];

interface LeadDetailDialogProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailDialog = ({ lead, onClose }: LeadDetailDialogProps) => {
  const [notes, setNotes] = useState(lead?.notes || '');
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleSaveNotes = async () => {
    if (!lead) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('leads')
      .update({ notes })
      .eq('id', lead.id);
    
    if (error) {
      toast.error('Failed to save notes');
    } else {
      toast.success('Notes saved');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
    setSaving(false);
  };

  if (!lead) return null;

  return (
    <Dialog open={!!lead} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-4">
            {lead.name}
            <LeadStatusBadge status={lead.status} />
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">
                {lead.email}
              </a>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">
                  {lead.phone}
                </a>
              </div>
            )}
            {lead.company && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{lead.company}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(lead.created_at), 'MMMM d, yyyy h:mm a')}</span>
            </div>
            {lead.budget && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{lead.budget}</span>
              </div>
            )}
          </div>
          
          {/* Service */}
          {lead.service && (
            <div>
              <Label className="text-muted-foreground text-sm">Service Interested In</Label>
              <p className="mt-1">{lead.service}</p>
            </div>
          )}
          
          {/* Message */}
          <div>
            <Label className="text-muted-foreground text-sm">Message</Label>
            <div className="mt-2 p-4 bg-secondary/30 rounded-lg border border-border/30">
              <p className="whitespace-pre-wrap">{lead.message}</p>
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-muted-foreground text-sm">Internal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this lead..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 min-h-[100px] bg-secondary/30 border-border/30"
            />
            <Button 
              onClick={handleSaveNotes} 
              disabled={saving}
              className="mt-2 gap-2"
              variant="outline"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Notes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
