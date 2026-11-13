import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { 
  Palette, 
  Globe, 
  Video, 
  Camera, 
  Megaphone, 
  ChevronRight 
} from "lucide-react";

// Project data
const projects = [
  {
    id: 1,
    title: "TechFlow Rebrand",
    category: "branding",
    description: "Complete brand identity redesign for a SaaS startup",
    tags: ["Branding", "Identity", "Strategy"],
    icon: Palette,
    content: (
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-indigo-500/30 to-purple-600/30 flex items-center justify-center">
          <Palette className="w-12 h-12 text-white/50" />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Bloom E-commerce",
    category: "websites",
    description: "Modern e-commerce platform for a boutique flower shop",
    tags: ["Web", "E-commerce", "Design"],
    icon: Globe,
    content: (
      <div className="relative w-full h-full bg-gradient-to-br from-blue-500/30 to-cyan-600/30 flex items-center justify-center">
        <Globe className="w-12 h-12 text-white/50" />
      </div>
    ),
  },
  {
    id: 3,
    title: "Fitness Pro Video",
    category: "video",
    description: "Brand film for premium fitness equipment company",
    tags: ["Video", "Brand Film", "Motion"],
    icon: Video,
    content: (
      <div className="relative w-full h-full bg-gradient-to-br from-orange-500/30 to-red-600/30 flex items-center justify-center">
        <Video className="w-12 h-12 text-white/50" />
      </div>
    ),
  },
  {
    id: 4,
    title: "Urban Café Campaign",
    category: "social",
    description: "Social media strategy and content for café launch",
    tags: ["Social", "Campaign", "Content"],
    icon: Megaphone,
    content: (
      <div className="relative w-full h-full bg-gradient-to-br from-pink-500/30 to-rose-600/30 flex items-center justify-center">
        <Megaphone className="w-12 h-12 text-white/50" />
      </div>
    ),
  },
  {
    id: 5,
    title: "GreenLeaf Identity",
    category: "branding",
    description: "Eco-friendly brand identity for organic products",
    tags: ["Branding", "Identity", "Sustainable"],
    icon: Palette,
    content: (
      <div className="relative w-full h-full bg-gradient-to-br from-emerald-500/30 to-teal-600/30 flex items-center justify-center">
        <Palette className="w-12 h-12 text-white/50" />
      </div>
    ),
  },
  {
    id: 6,
    title: "Artisan Print Series",
    category: "photo",
    description: "Print advertising campaign for luxury watches",
    tags: ["Photography", "Print", "Luxury"],
    icon: Camera,
    content: (
      <div className="relative w-full h-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center">
        <Camera className="w-12 h-12 text-white/50" />
      </div>
    ),
  },
];

export const FeaturedWork = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Filter projects
  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  // Categories
  const categories = [
    { id: "all", label: "All", icon: ChevronRight },
    { id: "branding", label: "Branding", icon: Palette },
    { id: "websites", label: "Websites", icon: Globe },
    { id: "video", label: "Video", icon: Video },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "social", label: "Social", icon: Megaphone },
  ];

  // GSAP animations for images
  useEffect(() => {
    const image = document.querySelector('[data-image-hover]');
    if (!image) return;

    const rect = image.getBoundingClientRect();

    document.addEventListener('mousemove', (e) => {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(image, {
        x: x * 0.3,
        y: y * 0.3,
        scale: 1 + Math.abs(x) / 200,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    });

    document.addEventListener('mouseleave', () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      });
    });

    return () => {
      document.removeEventListener('mousemove', () => {});
      document.removeEventListener('mouseleave', () => {});
    };
  }, []);

  return (
    <section className="relative py-16 sm:py-20 bg-[var(--background)]">
      {/* Section header */}
      <div className="container mx-auto px-4 sm:px-6 text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "power2.out" }}
          className="text-xl sm:text-2xl font-semibold text-foreground mb-4"
        >
          <span className="text-gradient">Featured Work</span>
        </motion.h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          A selection of our recent projects across different industries and services.
        </p>
      </div>

      {/* Filter buttons */}
      <div className="container mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-primary to-accent text-white glow"
                  : "bg-[var(--card)] text-muted-foreground hover:text-foreground hover:bg-[var(--secondary)]"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured projects grid */}
      <div 
        ref={gridRef}
        className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "power2.out", delay: index * 0.1 }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => {
                setActiveProject(project);
                setLightboxOpen(true);
              }}
            >
              {/* Hover preview */}
              <div className="relative aspect-square overflow-hidden rounded-t-2xl" data-image-hover>
                <div className="w-full h-full bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br to-50% from-gradient flex items-center justify-center transition-transform duration-300 group-hover:scale-110`} style={{
                    background: `linear-gradient(135deg, ${project.tags.map((t, i) => {
                      const colors = {
                        branding: 'from-indigo-500 to-purple-600',
                        websites: 'from-blue-500 to-cyan-600',
                        video: 'from-orange-500 to-red-600',
                        photography: 'from-violet-500 to-purple-600',
                        social: 'from-pink-500 to-rose-600',
                      };
                      return colors[t as keyof typeof colors] || 'from-primary to-accent';
                    }).join(', ')}`,
                  }}>
                    <project.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-semibold text-lg">{project.title}</h3>
                  <p className="text-white/80 text-sm">{project.description}</p>
                </div>
              </div>

              {/* Category tag */}
              <div className="mt-3 flex justify-center">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--secondary)] text-foreground">
                  {project.category}
                </span>
              </div>

              {/* Project tags */}
              <div className="mt-2 flex gap-2 justify-center">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-full text-xs bg-[var(--background)] border border-[var(--border)]/30 text-[var(--muted-foreground)]">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && activeProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div 
            className="max-w-4xl max-h-full rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">{activeProject.title}</h3>
                <p className="text-muted-foreground mb-4">{activeProject.description}</p>
                <div className="flex gap-2 justify-center">
                  {activeProject.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-sm bg-[var(--secondary)] text-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
