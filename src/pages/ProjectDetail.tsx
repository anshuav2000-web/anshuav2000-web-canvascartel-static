import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Building2, Loader2 } from "lucide-react";
import { useSiteContent, defaultPortfolioProjects, PortfolioContent } from "@/hooks/useSiteContent";
import { useState } from "react";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSiteContent<PortfolioContent>('portfolio');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const projects = data?.projects || defaultPortfolioProjects;
  const project = projects.find((p) => p.id === projectId);
  const currentIndex = projects.findIndex((p) => p.id === projectId);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!project) {
    navigate('/projects', { replace: true });
    return null;
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-hero relative noise">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/projects" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>

          <div className="max-w-4xl">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-4 mb-6">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {project.fullDescription || project.description}
            </p>

            {(project.client || project.year) && (
              <div className="flex flex-wrap gap-6 mt-8">
                {project.client && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>{project.client}</span>
                  </div>
                )}
                {project.year && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{project.year}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div 
            className="aspect-[16/9] rounded-2xl overflow-hidden"
            style={{ 
              background: project.imageUrl 
                ? `url(${project.imageUrl}) center/cover` 
                : project.gradient 
            }}
          />
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {project.challenge && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                    The Challenge
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
              )}
              {project.solution && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                    Our Solution
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}
              {project.results && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                    The Results
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.results}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              Project Gallery
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className="aspect-[4/3] rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <img 
                    src={image} 
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-foreground hover:text-primary transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedImage} 
            alt="Gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Navigation */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {prevProject ? (
              <Link 
                to={`/projects/${prevProject.id}`}
                className="flex items-center gap-3 group"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Previous</span>
                  <p className="font-display font-semibold group-hover:text-primary transition-colors">
                    {prevProject.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            
            {nextProject ? (
              <Link 
                to={`/projects/${nextProject.id}`}
                className="flex items-center gap-3 text-right group"
              >
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Next</span>
                  <p className="font-display font-semibold group-hover:text-primary transition-colors">
                    {nextProject.title}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Start Your <span className="text-gradient">Project?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's create something extraordinary together. Get in touch and let's discuss your vision.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
