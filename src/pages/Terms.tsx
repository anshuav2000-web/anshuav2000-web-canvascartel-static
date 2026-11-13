import { Layout } from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-gradient-hero relative noise">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-invert">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Acceptance of Terms
                </h2>
                <p>
                  By accessing and using Canvas Cartel's website and services,
                  you accept and agree to be bound by these Terms of Service. If
                  you do not agree to these terms, please do not use our
                  services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Services
                </h2>
                <p>
                  Canvas Cartel provides creative design and marketing services
                  including but not limited to advertisement design, social media
                  content creation, website development, video and photo
                  production, and marketing strategy consulting.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Intellectual Property
                </h2>
                <p>
                  All content on this website, including text, graphics, logos,
                  images, and software, is the property of Canvas Cartel and is
                  protected by copyright and trademark laws. Upon full payment
                  for services, clients receive ownership of the final
                  deliverables unless otherwise specified in the project
                  agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Payment Terms
                </h2>
                <p>
                  Payment terms are specified in individual project agreements.
                  Generally, a 50% advance is required before project
                  commencement, with the remaining balance due upon project
                  completion.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Limitation of Liability
                </h2>
                <p>
                  Canvas Cartel shall not be liable for any indirect, incidental,
                  special, or consequential damages arising from your use of our
                  services. Our liability is limited to the amount paid for the
                  specific services in question.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Revisions and Changes
                </h2>
                <p>
                  The number of revisions included in each project is specified
                  in the project agreement. Additional revisions may be subject
                  to additional charges.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Governing Law
                </h2>
                <p>
                  These terms shall be governed by and construed in accordance
                  with the laws of India. Any disputes shall be subject to the
                  exclusive jurisdiction of the courts of Mumbai.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Contact
                </h2>
                <p>
                  For questions about these Terms of Service, please contact us
                  at hello@canvascartel.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
