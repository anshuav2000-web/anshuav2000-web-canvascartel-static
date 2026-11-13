import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSiteContent, defaultPortfolioProjects, defaultCategories, PortfolioContent } from "@/hooks/useSiteContent";

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data, isLoading } = useSiteContent<PortfolioContent>('portfolio');

  const projects = data?.projects || defaultPortfolioProjects;
  const categories = ["All", ...(data?.categories || defaultCategories)];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-gradient-hero relative noise overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-40 sm:w-52 md:w-64 h-40 sm:h-52 md:h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Our Projects
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
              Work That Speaks for{" "}
              <span className="text-gradient">Itself</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Explore our collection of projects that showcase our creativity,
              strategic thinking, and dedication to excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-4 sm:py-6 md:py-8 bg-background border-b border-border sticky top-16 sm:top-20 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group rounded-xl sm:rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 bg-gradient-card hover-lift"
                >
                  <div
                    className="aspect-[4/3] relative"
                    style={{ 
                      background: project.imageUrl 
                        ? `url(${project.imageUrl}) center/cover` 
                        : project.gradient 
                    }}
                  >
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="gradient" size="sm" className="h-11 !py-3" asChild>
                        View Project
                        <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <span className="text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="font-display font-semibold text-base sm:text-lg mt-1.5 sm:mt-2 mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 sm:mb-6">
              Like What You <span className="text-gradient">See?</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-2">
              Let's create something extraordinary for your brand. Get in touch
              and let's discuss your project.
            </p>
            <Button variant="hero" size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
