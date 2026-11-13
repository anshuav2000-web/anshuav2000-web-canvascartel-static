import { Layout } from "@/components/layout/Layout";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag, 
  Bookmark,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: "1",
    title: "How AI is Revolutionizing Creative Agencies in 2026",
    category: "AI & Automation",
    date: "Jan 15, 2026",
    readTime: "5 min read",
    excerpt: "Explore how AI tools are transforming the creative industry and what agencies need to prepare for the future.",
    image: "https://images.unsplash.com/photo-1625798202041-4791c72e6a48?w=800&h=400&fit=crop",
    author: "Priyankur",
    readMore: "/blog/ai-revolution"
  },
  {
    id: "2",
    title: "5 Branding Mistakes That Kill Startups",
    category: "Branding",
    date: "Jan 10, 2026",
    readTime: "4 min read",
    excerpt: "Learn from common branding pitfalls and how to avoid them to build a strong, memorable brand identity.",
    image: "https://images.unsplash.com/photo-1561070791-252614c3ad31?w=800&h=400&fit=crop",
    author: "Priyankur",
    readMore: "/blog/branding-mistakes"
  },
  {
    id: "3",
    title: "The Complete Guide to Social Media Marketing in 2026",
    category: "Social Media",
    date: "Jan 5, 2026",
    readTime: "7 min read",
    excerpt: "Everything you need to know about modern social media marketing strategies and how to measure success.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
    author: "Priyankur",
    readMore: "/blog/social-media-guide"
  },
];

export const BlogPage = () => {
  return (
    <Layout>
      {/* Blog Hero */}
      <section className="py-16 sm:py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-display font-bold text-center mb-4"
          >
            <span className="text-gradient">Blog & Insights</span>
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Latest insights, trends, and tips from our creative and marketing experts
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col h-full rounded-2xl bg-[var(--card)] border border-border overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">{post.author.charAt(0)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{post.author}</span>
                    </div>
                    <Link to={post.readMore}>
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                        Read more <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-[var(--secondary)]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-display font-bold mb-4"
          >
            <span className="text-gradient">Want More Insights?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-muted-foreground mb-8 max-w-lg mx-auto"
          >
            Subscribe to our newsletter for weekly updates on creative trends and marketing strategies.
          </motion.p>
          <Link to="/contact">
            <button className="h-12 px-8 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold hover:from-primary/90 hover:to-accent/90 transition-all hover:scale-105">
              Subscribe Now
            </button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;