import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  useSiteContent, 
  defaultHomepageHero,
  defaultHomepageCTA,
  HomepageContent,
  HomepageHeroContent,
  HomepageCTAContent,
} from '@/hooks/useSiteContent';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

const HomepageAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<HomepageContent>('homepage');
  const [hero, setHero] = useState<HomepageHeroContent>(defaultHomepageHero);
  const [cta, setCta] = useState<HomepageCTAContent>(defaultHomepageCTA);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setHero(data.hero || defaultHomepageHero);
      setCta(data.cta || defaultHomepageCTA);
    } else if (!isLoading && !data) {
      setHero(defaultHomepageHero);
      setCta(defaultHomepageCTA);
    }
  }, [data, isLoading]);

  const handleSave = () => {
    updateContent({ hero, cta });
    setHasChanges(false);
  };

  const updateHero = (field: keyof HomepageHeroContent, value: string | { number: string; label: string }[]) => {
    setHero({ ...hero, [field]: value });
    setHasChanges(true);
  };

  const updateCta = (field: keyof HomepageCTAContent, value: string) => {
    setCta({ ...cta, [field]: value });
    setHasChanges(true);
  };

  const updateStat = (index: number, field: 'number' | 'label', value: string) => {
    const newStats = [...hero.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateHero('stats', newStats);
  };

  const addStat = () => {
    updateHero('stats', [...hero.stats, { number: '0+', label: 'New Stat' }]);
  };

  const removeStat = (index: number) => {
    updateHero('stats', hero.stats.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Homepage Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage hero section and call-to-action content
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Badge Text</label>
              <Input
                value={hero.badge}
                onChange={(e) => updateHero('badge', e.target.value)}
                placeholder="e.g., Creative Design & Marketing Studio"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={hero.title}
                  onChange={(e) => updateHero('title', e.target.value)}
                  placeholder="Main headline text"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Highlighted Word</label>
                <Input
                  value={hero.titleHighlight}
                  onChange={(e) => updateHero('titleHighlight', e.target.value)}
                  placeholder="Word with gradient effect"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={hero.description}
                onChange={(e) => updateHero('description', e.target.value)}
                placeholder="Hero section description"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Button Text</label>
                <Input
                  value={hero.primaryButtonText}
                  onChange={(e) => updateHero('primaryButtonText', e.target.value)}
                  placeholder="e.g., Start Your Project"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Button Link</label>
                <Input
                  value={hero.primaryButtonLink}
                  onChange={(e) => updateHero('primaryButtonLink', e.target.value)}
                  placeholder="e.g., /contact"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Secondary Button Text</label>
                <Input
                  value={hero.secondaryButtonText}
                  onChange={(e) => updateHero('secondaryButtonText', e.target.value)}
                  placeholder="e.g., View Our Work"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Secondary Button Link</label>
                <Input
                  value={hero.secondaryButtonLink}
                  onChange={(e) => updateHero('secondaryButtonLink', e.target.value)}
                  placeholder="e.g., /projects"
                />
              </div>
            </div>

            {/* Stats */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Statistics</label>
                <Button variant="outline" size="sm" onClick={addStat}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stat
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {hero.stats.map((stat, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={stat.number}
                        onChange={(e) => updateStat(index, 'number', e.target.value)}
                        placeholder="50+"
                      />
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        placeholder="Projects Delivered"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive mt-1"
                      onClick={() => removeStat(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Call-to-Action Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={cta.title}
                  onChange={(e) => updateCta('title', e.target.value)}
                  placeholder="CTA headline"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Highlighted Word</label>
                <Input
                  value={cta.titleHighlight}
                  onChange={(e) => updateCta('titleHighlight', e.target.value)}
                  placeholder="Word with gradient effect"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={cta.description}
                onChange={(e) => updateCta('description', e.target.value)}
                placeholder="CTA description"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Button Text</label>
                <Input
                  value={cta.primaryButtonText}
                  onChange={(e) => updateCta('primaryButtonText', e.target.value)}
                  placeholder="e.g., Let's Talk"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Button Link</label>
                <Input
                  value={cta.primaryButtonLink}
                  onChange={(e) => updateCta('primaryButtonLink', e.target.value)}
                  placeholder="e.g., /contact"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Secondary Button Text</label>
                <Input
                  value={cta.secondaryButtonText}
                  onChange={(e) => updateCta('secondaryButtonText', e.target.value)}
                  placeholder="e.g., Explore Services"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Secondary Button Link</label>
                <Input
                  value={cta.secondaryButtonLink}
                  onChange={(e) => updateCta('secondaryButtonLink', e.target.value)}
                  placeholder="e.g., /services"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default HomepageAdmin;
