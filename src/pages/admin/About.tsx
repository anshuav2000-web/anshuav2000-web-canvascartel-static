import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useSiteContent, 
  defaultAboutContent,
  AboutContent,
  AboutValue,
} from '@/hooks/useSiteContent';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { IconBrowser } from '@/components/admin/IconBrowser';

const AboutAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<AboutContent>('about');
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setContent({ ...defaultAboutContent, ...data });
    } else if (!isLoading && !data) {
      setContent(defaultAboutContent);
    }
  }, [data, isLoading]);

  const handleSave = () => {
    updateContent(content);
    setHasChanges(false);
  };

  const updateField = <K extends keyof AboutContent>(
    section: K,
    field: keyof AboutContent[K],
    value: string | string[]
  ) => {
    setContent({
      ...content,
      [section]: { ...content[section], [field]: value },
    });
    setHasChanges(true);
  };

  const updateValue = (index: number, field: keyof AboutValue, value: string) => {
    const newValues = [...content.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setContent({ ...content, values: newValues });
    setHasChanges(true);
  };

  const addValue = () => {
    const newValue: AboutValue = {
      id: Date.now().toString(),
      icon: 'Star',
      title: 'New Value',
      description: 'Description here',
    };
    setContent({ ...content, values: [...content.values, newValue] });
    setHasChanges(true);
  };

  const removeValue = (index: number) => {
    setContent({ ...content, values: content.values.filter((_, i) => i !== index) });
    setHasChanges(true);
  };

  const updateStat = (index: number, field: 'number' | 'label', value: string) => {
    const newStats = [...content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setContent({ ...content, stats: newStats });
    setHasChanges(true);
  };

  const addStat = () => {
    setContent({ ...content, stats: [...content.stats, { number: '0+', label: 'New Stat' }] });
    setHasChanges(true);
  };

  const removeStat = (index: number) => {
    setContent({ ...content, stats: content.stats.filter((_, i) => i !== index) });
    setHasChanges(true);
  };

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...content.main.paragraphs];
    newParagraphs[index] = value;
    setContent({ ...content, main: { ...content.main, paragraphs: newParagraphs } });
    setHasChanges(true);
  };

  const addParagraph = () => {
    setContent({ 
      ...content, 
      main: { ...content.main, paragraphs: [...content.main.paragraphs, 'New paragraph'] } 
    });
    setHasChanges(true);
  };

  const removeParagraph = (index: number) => {
    setContent({ 
      ...content, 
      main: { ...content.main, paragraphs: content.main.paragraphs.filter((_, i) => i !== index) } 
    });
    setHasChanges(true);
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
            <h1 className="text-3xl font-display font-bold">About Page Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all sections of the About page
            </p>
          </div>
          <Button onClick={handleSave} disabled={!hasChanges || isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="main">Main Content</TabsTrigger>
            <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
            <TabsTrigger value="values">Values</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
          </TabsList>

          {/* Hero Tab */}
          <TabsContent value="hero">
            <Card>
              <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tagline</label>
                  <Input value={content.hero.tagline} onChange={(e) => updateField('hero', 'tagline', e.target.value)} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input value={content.hero.title} onChange={(e) => updateField('hero', 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Highlighted Word</label>
                    <Input value={content.hero.titleHighlight} onChange={(e) => updateField('hero', 'titleHighlight', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea value={content.hero.description} onChange={(e) => updateField('hero', 'description', e.target.value)} rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Main Content Tab */}
          <TabsContent value="main">
            <Card>
              <CardHeader><CardTitle>Main Content Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input value={content.main.title} onChange={(e) => updateField('main', 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Highlighted Word</label>
                    <Input value={content.main.titleHighlight} onChange={(e) => updateField('main', 'titleHighlight', e.target.value)} />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Brand Name</label>
                    <Input value={content.main.brandName} onChange={(e) => updateField('main', 'brandName', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Brand Tagline/Logo</label>
                    <Input value={content.main.brandTagline} onChange={(e) => updateField('main', 'brandTagline', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Established Year</label>
                    <Input value={content.main.establishedYear} onChange={(e) => updateField('main', 'establishedYear', e.target.value)} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Paragraphs</label>
                    <Button variant="outline" size="sm" onClick={addParagraph}><Plus className="h-4 w-4 mr-2" />Add</Button>
                  </div>
                  <div className="space-y-3">
                    {content.main.paragraphs.map((p, i) => (
                      <div key={i} className="flex gap-2">
                        <Textarea value={p} onChange={(e) => updateParagraph(i, e.target.value)} rows={2} className="flex-1" />
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeParagraph(i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Philosophy Tab */}
          <TabsContent value="philosophy">
            <Card>
              <CardHeader><CardTitle>Philosophy Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tagline</label>
                  <Input value={content.philosophy.tagline} onChange={(e) => updateField('philosophy', 'tagline', e.target.value)} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input value={content.philosophy.title} onChange={(e) => updateField('philosophy', 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Highlighted Word</label>
                    <Input value={content.philosophy.titleHighlight} onChange={(e) => updateField('philosophy', 'titleHighlight', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea value={content.philosophy.description} onChange={(e) => updateField('philosophy', 'description', e.target.value)} rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Values Tab */}
          <TabsContent value="values" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" onClick={addValue}><Plus className="h-4 w-4 mr-2" />Add Value</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {content.values.map((value, index) => (
                <Card key={value.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base">{value.title}</CardTitle>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeValue(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Icon</label>
                        <div className="flex gap-2">
                          <Input 
                            value={value.icon} 
                            onChange={(e) => updateValue(index, 'icon', e.target.value)} 
                            className="flex-1"
                            placeholder="Icon name"
                          />
                          <IconBrowser 
                            currentIcon={value.icon}
                            onSelectIcon={(iconName) => updateValue(index, 'icon', iconName)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <Input value={value.title} onChange={(e) => updateValue(index, 'title', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description</label>
                      <Textarea value={value.description} onChange={(e) => updateValue(index, 'description', e.target.value)} rows={2} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Statistics</CardTitle>
                <Button variant="outline" size="sm" onClick={addStat}><Plus className="h-4 w-4 mr-2" />Add Stat</Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {content.stats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <Input value={stat.number} onChange={(e) => updateStat(index, 'number', e.target.value)} placeholder="50+" />
                      <Input value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} placeholder="Label" />
                      <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => removeStat(index)}>
                        <Trash2 className="h-4 w-4 mr-2" />Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Creators Card</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input value={content.creatorsCard.title} onChange={(e) => updateField('creatorsCard', 'title', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea value={content.creatorsCard.description} onChange={(e) => updateField('creatorsCard', 'description', e.target.value)} rows={2} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Highlight Text</label>
                  <Input value={content.creatorsCard.highlight} onChange={(e) => updateField('creatorsCard', 'highlight', e.target.value)} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Brands Card</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input value={content.brandsCard.title} onChange={(e) => updateField('brandsCard', 'title', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea value={content.brandsCard.description} onChange={(e) => updateField('brandsCard', 'description', e.target.value)} rows={2} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Highlight Text</label>
                  <Input value={content.brandsCard.highlight} onChange={(e) => updateField('brandsCard', 'highlight', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CTA Tab */}
          <TabsContent value="cta">
            <Card>
              <CardHeader><CardTitle>Call-to-Action Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input value={content.cta.title} onChange={(e) => updateField('cta', 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Highlighted Word</label>
                    <Input value={content.cta.titleHighlight} onChange={(e) => updateField('cta', 'titleHighlight', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea value={content.cta.description} onChange={(e) => updateField('cta', 'description', e.target.value)} rows={2} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Button Text</label>
                  <Input value={content.cta.buttonText} onChange={(e) => updateField('cta', 'buttonText', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AboutAdmin;
