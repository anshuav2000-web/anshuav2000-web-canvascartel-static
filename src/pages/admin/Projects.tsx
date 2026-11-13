import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  useSiteContent, 
  defaultPortfolioProjects,
  defaultCategories,
  PortfolioProject,
  PortfolioContent,
} from '@/hooks/useSiteContent';
import { Save, Loader2 } from 'lucide-react';
import { ProjectsManager } from '@/components/admin/ProjectsManager';

const ProjectsAdmin = () => {
  const { data, isLoading, updateContent, isUpdating } = useSiteContent<PortfolioContent>('portfolio');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setProjects(data.projects || defaultPortfolioProjects);
      setCategories(data.categories || defaultCategories);
    } else if (!isLoading && !data) {
      setProjects(defaultPortfolioProjects);
      setCategories(defaultCategories);
    }
  }, [data, isLoading]);

  const handleSave = () => {
    updateContent({ projects, categories });
    setHasChanges(false);
  };

  const handleProjectsChange = (newProjects: PortfolioProject[]) => {
    setProjects(newProjects);
    setHasChanges(true);
  };

  const handleCategoriesChange = (newCategories: string[]) => {
    setCategories(newCategories);
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
            <h1 className="text-3xl font-display font-bold">Projects Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage projects, categories, and images. Drag items to reorder.
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

        <ProjectsManager
          projects={projects}
          categories={categories}
          onProjectsChange={handleProjectsChange}
          onCategoriesChange={handleCategoriesChange}
        />
      </div>
    </AdminLayout>
  );
};

export default ProjectsAdmin;
