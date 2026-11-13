import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteContent, ContactContent, defaultContactContent } from '@/hooks/useSiteContent';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

const ContactAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<ContactContent>('contact');
  const [content, setContent] = useState<ContactContent>(defaultContactContent);

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  const handleSave = () => {
    updateContent(content);
  };

  const addContactInfo = () => {
    setContent({
      ...content,
      contactInfo: [...content.contactInfo, { id: Date.now().toString(), icon: 'Mail', title: '', value: '' }],
    });
  };

  const removeContactInfo = (id: string) => {
    setContent({
      ...content,
      contactInfo: content.contactInfo.filter((item) => item.id !== id),
    });
  };

  const addWhyChooseItem = () => {
    setContent({
      ...content,
      whyChooseItems: [...content.whyChooseItems, { id: Date.now().toString(), text: '' }],
    });
  };

  const removeWhyChooseItem = (id: string) => {
    setContent({
      ...content,
      whyChooseItems: content.whyChooseItems.filter((item) => item.id !== id),
    });
  };

  const addServiceOption = () => {
    setContent({
      ...content,
      serviceOptions: [...content.serviceOptions, { value: '', label: '' }],
    });
  };

  const removeServiceOption = (index: number) => {
    setContent({
      ...content,
      serviceOptions: content.serviceOptions.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Contact Page</h1>
            <p className="text-muted-foreground mt-1">Manage contact page content</p>
          </div>
          <Button onClick={handleSave} disabled={isUpdating}>
            <Save className="h-4 w-4 mr-2" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tagline</label>
              <Input
                value={content.hero.tagline}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, tagline: e.target.value } })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Title Highlight</label>
                <Input
                  value={content.hero.titleHighlight}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleHighlight: e.target.value } })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={content.hero.description}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contact Information</CardTitle>
            <Button variant="outline" size="sm" onClick={addContactInfo}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Section Title</label>
              <Input
                value={content.infoTitle}
                onChange={(e) => setContent({ ...content, infoTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Section Description</label>
              <Textarea
                value={content.infoDescription}
                onChange={(e) => setContent({ ...content, infoDescription: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-4">
              {content.contactInfo.map((item, index) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Contact Item {index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeContactInfo(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Icon (Mail, Phone, MapPin, MessageSquare)</label>
                      <Input
                        value={item.icon}
                        onChange={(e) => {
                          const updated = [...content.contactInfo];
                          updated[index] = { ...item, icon: e.target.value };
                          setContent({ ...content, contactInfo: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Title</label>
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...content.contactInfo];
                          updated[index] = { ...item, title: e.target.value };
                          setContent({ ...content, contactInfo: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Value</label>
                      <Input
                        value={item.value}
                        onChange={(e) => {
                          const updated = [...content.contactInfo];
                          updated[index] = { ...item, value: e.target.value };
                          setContent({ ...content, contactInfo: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Why Choose Us</CardTitle>
            <Button variant="outline" size="sm" onClick={addWhyChooseItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Section Title</label>
              <Input
                value={content.whyChooseTitle}
                onChange={(e) => setContent({ ...content, whyChooseTitle: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              {content.whyChooseItems.map((item, index) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <Input
                    value={item.text}
                    onChange={(e) => {
                      const updated = [...content.whyChooseItems];
                      updated[index] = { ...item, text: e.target.value };
                      setContent({ ...content, whyChooseItems: updated });
                    }}
                    placeholder="Benefit text"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeWhyChooseItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Form Settings</CardTitle>
            <Button variant="outline" size="sm" onClick={addServiceOption}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service Option
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Form Title</label>
              <Input
                value={content.formTitle}
                onChange={(e) => setContent({ ...content, formTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Service Options</label>
              <div className="space-y-3">
                {content.serviceOptions.map((option, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <Input
                      value={option.value}
                      onChange={(e) => {
                        const updated = [...content.serviceOptions];
                        updated[index] = { ...option, value: e.target.value };
                        setContent({ ...content, serviceOptions: updated });
                      }}
                      placeholder="Value (e.g., advertisement)"
                    />
                    <Input
                      value={option.label}
                      onChange={(e) => {
                        const updated = [...content.serviceOptions];
                        updated[index] = { ...option, label: e.target.value };
                        setContent({ ...content, serviceOptions: updated });
                      }}
                      placeholder="Label (e.g., Advertisement Design)"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeServiceOption(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Admin Notification Email</label>
              <Input
                type="email"
                value={content.adminNotificationEmail || ''}
                onChange={(e) => setContent({ ...content, adminNotificationEmail: e.target.value })}
                placeholder="admin@yourcompany.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                New lead notifications will be sent to this email address.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ContactAdmin;
