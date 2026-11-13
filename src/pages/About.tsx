import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Target, Users, Zap, Award, Globe, Star, Shield, Lightbulb, Rocket, Loader2 } from "lucide-react";
import { useSiteContent, defaultAboutContent, AboutContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Target, Users, Zap, Award, Globe, Star, Shield, Lightbulb, Rocket
};

const About = () => {
  const { data, isLoading } = useSiteContent<AboutContent>('about');
  const content = data || defaultAboutContent;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero relative noise">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              {content.hero.tagline}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-4 mb-6">
              {content.hero.title}{" "}
              <span className="text-gradient">{content.hero.titleHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main About Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                {content.main.title}
                <br />
                <span className="text-gradient">{content.main.titleHighlight}</span>
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                {content.main.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-card border border-border/50 overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-8xl font-display font-bold text-gradient mb-4">
                    {content.main.brandTagline}
                  </div>
                  <p className="text-xl font-display text-foreground">
                    {content.main.brandName}
                  </p>
                  <p className="text-muted-foreground mt-2">{content.main.establishedYear}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              {content.philosophy.tagline}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-6">
              {content.philosophy.title} <span className="text-gradient">{content.philosophy.titleHighlight}</span>
            </h2>
            <p className="text-muted-foreground">
              {content.philosophy.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.values.map((value) => {
              const Icon = iconMap[value.icon] || Heart;
              return (
                <div
                  key={value.id}
                  className="p-6 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {content.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Creators & Brands */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Creators */}
            <div className="p-8 md:p-12 rounded-3xl border-gradient bg-gradient-card">
              <Award className="h-10 w-10 text-primary mb-6" />
              <h3 className="text-2xl font-display font-bold mb-4">
                {content.creatorsCard.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {content.creatorsCard.description}
              </p>
              <p className="text-foreground font-medium">
                {content.creatorsCard.highlight}
              </p>
            </div>

            {/* For Brands */}
            <div className="p-8 md:p-12 rounded-3xl border-gradient bg-gradient-card">
              <Globe className="h-10 w-10 text-accent mb-6" />
              <h3 className="text-2xl font-display font-bold mb-4">
                {content.brandsCard.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {content.brandsCard.description}
              </p>
              <p className="text-foreground font-medium">
                {content.brandsCard.highlight}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {content.cta.title} <span className="text-gradient">{content.cta.titleHighlight}</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              {content.cta.description}
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                {content.cta.buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
