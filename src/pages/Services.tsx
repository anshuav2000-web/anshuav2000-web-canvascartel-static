import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const projects = [
  {
    id: "project-1",
    name: "Brand Identity - TechStart",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1522585427497-1f0cac227e4e?w=800&h=600&fit=crop",
    description: "Complete brand identity system for a tech startup including logo, color palette, typography, and brand guidelines.",
    link: "/projects/1"
  },
  {
    id: "project-2",
    name: "Website Redesign - MediCare",
    category: "Websites",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    description: "Modern e-commerce website redesign with integrated booking system and patient management features.",
    link: "/projects/2"
  },
  {
    id: "project-3",
    name: "Social Media Campaign - QuickBites",
    category: "Social",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c9?w=800&h=600&fit=crop",
    description: "Instagram content campaign driving 3x engagement rate for food delivery brand.",
    link: "/projects/3"
  },
  {
    id: "project-4",
    name: "Video Production - GreenEco",
    category: "Video",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097bc3?w=800&h=600&fit=crop",
    description: "Brand film production showcasing eco-friendly packaging solutions with compelling storytelling.",
    link: "/projects/4"
  },
  {
    id: "project-5",
    name: "Logo Design - FinStack",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281c4b6?w=800&h=600&fit=crop",
    description: "Minimalist logo design with versatile primary and secondary mark for fintech startup.",
    link: "/projects/5"
  },
  {
    id: "project-6",
    name: "Product Photography - Aura",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1571781926024-78b9edb4bb33?w=800&h=600&fit=crop",
    description: "Product photography series for wellness brand featuring lifestyle and studio shots.",
    link: "/projects/6"
  },
];

export const WorkPage = () => {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Branding", "Websites", "Video", "Photography", "Social"];

  const filteredProjects = projects.filter(p => filter === "All" || p.category === filter);

  return (
    <Layout>
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-display font-bold text-center mb-4"
          >
            <span className="text-gradient">Our Work</span>
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A selection of recent projects showcasing our creativity and expertise
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-[var(--card)] border border-border hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="group rounded-2xl bg-[var(--card)] border border-border overflow-hidden hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="relative overflow-hidden h-48 sm:h-56">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
                    {project.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                  <Link to={project.link}>
                    <span className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                      View Project <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WorkPage;
