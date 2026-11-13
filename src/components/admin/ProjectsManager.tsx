import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, GripVertical, Upload, X, Image } from 'lucide-react';
import { PortfolioProject } from '@/hooks/useSiteContent';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableProjectCardProps {
  project: PortfolioProject;
  index: number;
  categories: string[];
  onUpdate: (index: number, field: keyof PortfolioProject, value: string | string[]) => void;
  onRemove: (index: number) => void;
  onImageUpload: (index: number, file: File, type: 'main' | 'gallery') => void;
  onRemoveImage: (index: number, type: 'main' | 'gallery', galleryIndex?: number) => void;
}

const SortableProjectCard = ({
  project,
  index,
  categories,
  onUpdate,
  onRemove,
  onImageUpload,
  onRemoveImage,
}: SortableProjectCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(index, file, 'main');
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        onImageUpload(index, file, 'gallery');
      });
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  return (
    <Card ref={setNodeRef} style={style} className="border-border/50">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <CardTitle className="text-base font-display">
            {project.title || 'Untitled Project'}
          </CardTitle>
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
      <CardContent className="space-y-4">
        {/* Main Image Upload */}
        <div>
          <label className="text-sm font-medium mb-2 block">Cover Image</label>
          <div className="flex items-start gap-4">
            <div 
              className="w-32 h-24 rounded-lg border border-border overflow-hidden flex-shrink-0"
              style={{ 
                background: project.imageUrl 
                  ? `url(${project.imageUrl}) center/cover` 
                  : project.gradient 
              }}
            >
              {!project.imageUrl && (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="h-8 w-8 text-white/50" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              {project.imageUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => onRemoveImage(index, 'main')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              value={project.title}
              onChange={(e) => onUpdate(index, 'title', e.target.value)}
              placeholder="Project title"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select
              value={project.category}
              onChange={(e) => onUpdate(index, 'category', e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Client</label>
            <Input
              value={project.client || ''}
              onChange={(e) => onUpdate(index, 'client', e.target.value)}
              placeholder="Client name"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Year</label>
            <Input
              value={project.year || ''}
              onChange={(e) => onUpdate(index, 'year', e.target.value)}
              placeholder="2024"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Short Description</label>
          <Input
            value={project.description}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
            placeholder="Brief project description for cards"
          />
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="text-sm font-medium py-2">
              Project Details & Gallery
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Description</label>
                <Textarea
                  value={project.fullDescription || ''}
                  onChange={(e) => onUpdate(index, 'fullDescription', e.target.value)}
                  placeholder="Detailed project description for the detail page"
                  rows={2}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Challenge</label>
                  <Textarea
                    value={project.challenge || ''}
                    onChange={(e) => onUpdate(index, 'challenge', e.target.value)}
                    placeholder="What was the challenge?"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Solution</label>
                  <Textarea
                    value={project.solution || ''}
                    onChange={(e) => onUpdate(index, 'solution', e.target.value)}
                    placeholder="How did you solve it?"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Results</label>
                  <Textarea
                    value={project.results || ''}
                    onChange={(e) => onUpdate(index, 'results', e.target.value)}
                    placeholder="What were the results?"
                    rows={2}
                  />
                </div>
              </div>

              {/* Gallery */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Gallery Images</label>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGallerySelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Images
                  </Button>
                </div>
                {project.gallery && project.gallery.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {project.gallery.map((img, imgIndex) => (
                      <div key={imgIndex} className="relative group">
                        <div 
                          className="aspect-square rounded-lg overflow-hidden"
                          style={{ background: `url(${img}) center/cover` }}
                        />
                        <button
                          onClick={() => onRemoveImage(index, 'gallery', imgIndex)}
                          className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No gallery images yet</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Fallback Gradient</label>
                <Input
                  value={project.gradient}
                  onChange={(e) => onUpdate(index, 'gradient', e.target.value)}
                  placeholder="linear-gradient(...)"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

interface ProjectsManagerProps {
  projects: PortfolioProject[];
  categories: string[];
  onProjectsChange: (projects: PortfolioProject[]) => void;
  onCategoriesChange: (categories: string[]) => void;
}

export const ProjectsManager = ({
  projects,
  categories,
  onProjectsChange,
  onCategoriesChange,
}: ProjectsManagerProps) => {
  const [newCategory, setNewCategory] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((item) => item.id === active.id);
      const newIndex = projects.findIndex((item) => item.id === over.id);
      onProjectsChange(arrayMove(projects, oldIndex, newIndex));
    }
  };

  const updateProject = (index: number, field: keyof PortfolioProject, value: string | string[]) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onProjectsChange(updated);
  };

  const addProject = () => {
    const newProject: PortfolioProject = {
      id: Date.now().toString(),
      title: 'New Project',
      category: categories[0] || 'Branding',
      description: 'Project description',
      imageUrl: '',
      gradient: 'linear-gradient(135deg, hsl(200, 80%, 50%) 0%, hsl(180, 80%, 40%) 100%)',
      client: '',
      year: new Date().getFullYear().toString(),
      fullDescription: '',
      challenge: '',
      solution: '',
      results: '',
      gallery: [],
    };
    onProjectsChange([...projects, newProject]);
  };

  const removeProject = (index: number) => {
    onProjectsChange(projects.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (index: number, file: File, type: 'main' | 'gallery') => {
    const project = projects[index];

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${project.id}-${type}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName);

      if (type === 'main') {
        updateProject(index, 'imageUrl', publicUrl);
      } else {
        const currentGallery = projects[index].gallery || [];
        updateProject(index, 'gallery', [...currentGallery, publicUrl]);
      }
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleRemoveImage = (index: number, type: 'main' | 'gallery', galleryIndex?: number) => {
    if (type === 'main') {
      updateProject(index, 'imageUrl', '');
    } else if (galleryIndex !== undefined) {
      const currentGallery = [...(projects[index].gallery || [])];
      currentGallery.splice(galleryIndex, 1);
      updateProject(index, 'gallery', currentGallery);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onCategoriesChange([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (cat: string) => {
    onCategoriesChange(categories.filter((c) => c !== cat));
  };

  return (
    <div className="space-y-6">
      {/* Categories Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm"
              >
                {cat}
                <button
                  onClick={() => removeCategory(cat)}
                  className="ml-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            />
            <Button variant="outline" onClick={addCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={addProject}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={projects.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <SortableProjectCard
                key={project.id}
                project={project}
                index={index}
                categories={categories}
                onUpdate={updateProject}
                onRemove={removeProject}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {projects.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button variant="outline" onClick={addProject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
