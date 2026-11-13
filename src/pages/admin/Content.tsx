import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useSiteContent, 
  defaultServices, 
  defaultHero, 
  defaultProcess, 
  defaultPortfolioProjects,
  defaultCategories,
  ServiceItem, 
  ServicesContent, 
  HeroContent, 
  ProcessStep,
  PortfolioProject,
  PortfolioContent,
} from '@/hooks/useSiteContent';
import { Plus, Trash2, Save, GripVertical, Loader2 } from 'lucide-react';
import { ProjectsManager } from '@/components/admin/ProjectsManager';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const iconOptions = ['Megaphone', 'Share2', 'Globe', 'Video', 'Camera', 'Target', 'Palette', 'Briefcase', 'TrendingUp', 'Zap'];

interface SortableServiceCardProps {
  service: ServiceItem;
  serviceIndex: number;
  onUpdate: (index: number, field: keyof ServiceItem, value: string | string[]) => void;
  onRemove: (index: number) => void;
  onUpdateFeature: (serviceIndex: number, featureIndex: number, value: string) => void;
  onAddFeature: (serviceIndex: number) => void;
  onRemoveFeature: (serviceIndex: number, featureIndex: number) => void;
}

const SortableServiceCard = ({
  service,
  serviceIndex,
  onUpdate,
  onRemove,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
}: SortableServiceCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="border-border/50">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <CardTitle className="text-lg font-display">
            {service.title || 'Untitled Service'}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(serviceIndex)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Icon</label>
            <select
              value={service.icon}
              onChange={(e) => onUpdate(serviceIndex, 'icon', e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              value={service.title}
              onChange={(e) => onUpdate(serviceIndex, 'title', e.target.value)}
              placeholder="Service title"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Pricing</label>
            <Input
              value={service.pricing}
              onChange={(e) => onUpdate(serviceIndex, 'pricing', e.target.value)}
              placeholder="e.g., Starting from ₹15,000"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            value={service.description}
            onChange={(e) => onUpdate(serviceIndex, 'description', e.target.value)}
            placeholder="Service description"
            rows={2}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Features</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddFeature(serviceIndex)}
              className="h-7 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Feature
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {service.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => onUpdateFeature(serviceIndex, featureIndex, e.target.value)}
                  placeholder="Feature"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveFeature(serviceIndex, featureIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface SortableProcessCardProps {
  step: ProcessStep;
  index: number;
  onUpdate: (index: number, field: keyof ProcessStep, value: string) => void;
  onRemove: (index: number) => void;
}

const SortableProcessCard = ({ step, index, onUpdate, onRemove }: SortableProcessCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="border-border/50">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <CardTitle className="text-lg font-display">Step {step.step}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Step Number</label>
            <Input
              value={step.step}
              onChange={(e) => onUpdate(index, 'step', e.target.value)}
              placeholder="01"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              value={step.title}
              onChange={(e) => onUpdate(index, 'title', e.target.value)}
              placeholder="Step title"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <Input
            value={step.description}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
            placeholder="Step description"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const Content = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<ServicesContent>('services');
  const { data: portfolioData, isLoading: portfolioLoading, updateContent: updatePortfolio, isUpdating: portfolioUpdating } = useSiteContent<PortfolioContent>('portfolio');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [process, setProcess] = useState<ProcessStep[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [portfolioCategories, setPortfolioCategories] = useState<string[]>(defaultCategories);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (data) {
      setServices(data.services || defaultServices);
      setHero(data.hero || defaultHero);
      setProcess(data.process || defaultProcess);
    } else if (!isLoading && !data) {
      setServices(defaultServices);
      setHero(defaultHero);
      setProcess(defaultProcess);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (portfolioData) {
      setPortfolioProjects(portfolioData.projects || defaultPortfolioProjects);
      setPortfolioCategories(portfolioData.categories || defaultCategories);
    } else if (!portfolioLoading && !portfolioData) {
      setPortfolioProjects(defaultPortfolioProjects);
      setPortfolioCategories(defaultCategories);
    }
  }, [portfolioData, portfolioLoading]);

  const handleSave = () => {
    updateContent({ services, hero, process });
    updatePortfolio({ projects: portfolioProjects, categories: portfolioCategories });
    setHasChanges(false);
  };

  const handlePortfolioProjectsChange = (projects: PortfolioProject[]) => {
    setPortfolioProjects(projects);
    setHasChanges(true);
  };

  const handlePortfolioCategoriesChange = (categories: string[]) => {
    setPortfolioCategories(categories);
    setHasChanges(true);
  };

  // Drag handlers
  const handleServiceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }
  };

  const handleProcessDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setProcess((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }
  };

  // Service handlers
  const updateService = (index: number, field: keyof ServiceItem, value: string | string[]) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
    setHasChanges(true);
  };

  const updateFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    const updated = [...services];
    const features = [...updated[serviceIndex].features];
    features[featureIndex] = value;
    updated[serviceIndex] = { ...updated[serviceIndex], features };
    setServices(updated);
    setHasChanges(true);
  };

  const addFeature = (serviceIndex: number) => {
    const updated = [...services];
    updated[serviceIndex] = { 
      ...updated[serviceIndex], 
      features: [...updated[serviceIndex].features, 'New Feature'] 
    };
    setServices(updated);
    setHasChanges(true);
  };

  const removeFeature = (serviceIndex: number, featureIndex: number) => {
    const updated = [...services];
    updated[serviceIndex] = { 
      ...updated[serviceIndex], 
      features: updated[serviceIndex].features.filter((_, i) => i !== featureIndex) 
    };
    setServices(updated);
    setHasChanges(true);
  };

  const addService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      icon: 'Briefcase',
      title: 'New Service',
      description: 'Service description goes here.',
      features: ['Feature 1', 'Feature 2'],
      pricing: 'Starting from ₹10,000',
    };
    setServices([...services, newService]);
    setHasChanges(true);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  // Hero handlers
  const updateHero = (field: keyof HeroContent, value: string) => {
    setHero({ ...hero, [field]: value });
    setHasChanges(true);
  };

  // Process handlers
  const updateProcessStep = (index: number, field: keyof ProcessStep, value: string) => {
    const updated = [...process];
    updated[index] = { ...updated[index], [field]: value };
    setProcess(updated);
    setHasChanges(true);
  };

  const addProcessStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      step: String(process.length + 1).padStart(2, '0'),
      title: 'New Step',
      description: 'Step description',
    };
    setProcess([...process, newStep]);
    setHasChanges(true);
  };

  const removeProcessStep = (index: number) => {
    setProcess(process.filter((_, i) => i !== index));
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
            <h1 className="text-3xl font-display font-bold">Content Management</h1>
            <p className="text-muted-foreground mt-1">
              Edit services, pricing, and other site content. Drag items to reorder.
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

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="process">Process Steps</TabsTrigger>
            <TabsTrigger value="portfolio">Projects</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-end">
              <Button variant="outline" onClick={addService}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleServiceDragEnd}
            >
              <SortableContext items={services.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-6">
                  {services.map((service, serviceIndex) => (
                    <SortableServiceCard
                      key={service.id}
                      service={service}
                      serviceIndex={serviceIndex}
                      onUpdate={updateService}
                      onRemove={removeService}
                      onUpdateFeature={updateFeature}
                      onAddFeature={addFeature}
                      onRemoveFeature={removeFeature}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {services.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No services yet</p>
                  <Button variant="outline" onClick={addService}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Service
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Hero Section Tab */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tagline</label>
                  <Input
                    value={hero.tagline}
                    onChange={(e) => updateHero('tagline', e.target.value)}
                    placeholder="e.g., Our Services"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={hero.title}
                      onChange={(e) => updateHero('title', e.target.value)}
                      placeholder="Main title text"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Highlighted Word</label>
                    <Input
                      value={hero.titleHighlight}
                      onChange={(e) => updateHero('titleHighlight', e.target.value)}
                      placeholder="Word to highlight with gradient"
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Process Steps Tab */}
          <TabsContent value="process" className="space-y-6">
            <div className="flex justify-end">
              <Button variant="outline" onClick={addProcessStep}>
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleProcessDragEnd}
            >
              <SortableContext items={process.map(p => p.id)} strategy={rectSortingStrategy}>
                <div className="grid md:grid-cols-2 gap-4">
                  {process.map((step, index) => (
                    <SortableProcessCard
                      key={step.id}
                      step={step}
                      index={index}
                      onUpdate={updateProcessStep}
                      onRemove={removeProcessStep}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {process.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No process steps yet</p>
                  <Button variant="outline" onClick={addProcessStep}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Step
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <ProjectsManager
              projects={portfolioProjects}
              categories={portfolioCategories}
              onProjectsChange={handlePortfolioProjectsChange}
              onCategoriesChange={handlePortfolioCategoriesChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Content;
