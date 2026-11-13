import { motion } from "framer-motion";

const logos = [
  { name: "Google", icon: "🌐", color: "from-blue-500 to-indigo-600" },
  { name: "Microsoft", icon: "💻", color: "from-sky-500 to-blue-600" },
  { name: "Amazon", icon: "📦", color: "from-amber-500 to-orange-600" },
  { name: "Apple", icon: "🍏", color: "from-neutral-700 to-neutral-900" },
  { name: "Figma", icon: "🎨", color: "from-orange-500 to-pink-600" },
  { name: "Adobe", icon: "✒️", color: "from-red-500 to-rose-600" },
  { name: "Notion", icon: "📝", color: "from-zinc-800 to-black" },
  { name: "Slack", icon: "💬", color: "from-purple-600 to-indigo-700" },
  { name: "Stripe", icon: "💳", color: "from-indigo-600 to-violet-700" },
  { name: "Shopify", icon: "🛍️", color: "from-emerald-500 to-teal-600" },
];

export const LogosMarquee = () => {
  return (
    <section className="relative py-16 bg-[var(--background)] border-y border-[var(--border)]/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 text-center mb-10">
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-3">
          <span className="text-gradient">Trusted by</span> Founders & Industry Leaders Worldwide
        </h2>
        <p className="text-muted-foreground text-sm">
          Partnering with ambitious brands to build memorable digital products and campaigns.
        </p>
      </div>

      <div className="relative w-full overflow-hidden flex whitespace-nowrap py-4">
        {/* Gradient fade edges */}
        <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-8 shrink-0 min-w-full px-4"
        >
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[var(--card)] border border-[var(--border)]/50 shadow-sm hover:border-primary/50 transition-all hover:scale-105 shrink-0"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${logo.color} flex items-center justify-center text-white text-lg shadow-md`}>
                {logo.icon}
              </div>
              <span className="font-display font-semibold text-foreground text-base tracking-wide">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
