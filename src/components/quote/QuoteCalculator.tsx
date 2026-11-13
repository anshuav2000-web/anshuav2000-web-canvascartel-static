import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Label 
} from "@/components/ui";
import { 
  DollarSign, 
  Send,
  MessageCircle
} from "lucide-react";

// Service cost data
const serviceCosts = {
  branding: { min: 25000, max: 150000, step: 5000 },
  marketing: { min: 30000, max: 200000, step: 5000 },
  website: { min: 50000, max: 300000, step: 10000 },
  video: { min: 20000, max: 150000, step: 5000 },
  photography: { min: 15000, max: 75000, step: 2500 },
  ai_automation: { min: 40000, max: 250000, step: 10000 },
};

// Services list
const servicesList = [
  { id: "branding", name: "Branding & Design", icon: Zap, defaultCheck: true },
  { id: "marketing", name: "Social Media Marketing", icon: TrendingUp, defaultCheck: true },
  { id: "website", name: "Website Development", icon: Rocket, defaultCheck: true },
  { id: "video", name: "Video Production", icon: Video, defaultCheck: false },
  { id: "photography", name: "Photography", icon: Camera, defaultCheck: false },
  { id: "ai_automation", name: "AI & Automation", icon: Workflow, defaultCheck: false },
];

export const QuoteCalculator = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>(["branding", "marketing", "website"]);
  const [pages, setPages] = useState(5);
  const [urgency, setUrgency] = useState<"standard" | "rush">("standard");

  const total = useMemo(() => {
    let total = 0;
    selectedServices.forEach((service) => {
      const cost = serviceCosts[service as keyof typeof serviceCosts];
      if (cost) {
        // Each service has a base price (for simplicity, using min as base)
        total += Math.round((cost.min + cost.max) / 2);
      }
    });
    // Add pages cost
    total += pages * 5000;
    // Urgency multiplier
    if (urgency === "rush") {
      total *= 1.3;
    }
    return Math.round(total);
  }, [selectedServices, pages, urgency]);

  const [quote] = useState<number | null>(total);
  const [isExported, setIsExported] = useState(false);

  const [sliderValue, setSliderValue] = useState<number[]>([0, 100000]);
  const animatedValue = useSpring(sliderValue[1], {
    stiffness: 100,
    damping: 30,
    mass: 0.1,
  });

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₹${price / 1000000.toFixed(1)}Cr`;
    }
    if (price >= 1000) {
      return `₹${price / 1000.toFixed(0)}K`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const handleExport = () => {
    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-display font-bold mb-6">Project Quote Calculator</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Choose Services</Label>
          <div className="grid grid-cols-1 gap-3">
            {servicesList.map((service) => (
              <div
                key={service.id}
                className={`
                  p-4 rounded-xl border transition-all cursor-pointer
                  ${selectedServices.includes(service.id)
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/20"
                  }
                `}
                onClick={() => {
                  setSelectedServices(prev =>
                    prev.includes(service.id)
                      ? prev.filter(s => s !== service.id)
                      : [...prev, service.id]
                  );
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedServices.includes(service.id) ? "bg-primary border-primary" : "border-border"}`}>
                    {selectedServices.includes(service.id) && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <service.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm">{service.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pages Input */}
          <div className="mt-6">
            <Label className="text-sm font-semibold">Project Size</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1">
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={pages}
                  onChange={(e) => setPages(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-muted accent-primary"
                />
                <span className="text-sm text-muted-foreground mt-1 block text-right">
                  {pages} {pages === 1 ? "page" : "pages"}
                </span>
              </div>
              <div className="w-20 text-right">
                <span className="text-sm font-medium text-primary">
                  {formatPrice(pages * 5000)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-card rounded-2xl p-6 border border-border h-fit">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
            Estimated Project Cost
          </h4>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span>Selected Services</span>
              <span className="font-medium">{selectedServices.length} services</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Project Size</span>
              <span className="font-medium">{pages} pages</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Urgency</span>
              <span className="font-medium capitalize">{urgency}</span>
            </div>
          </div>

          <div className="border-t border-border my-4" />

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Estimate</p>
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-display font-bold"
            >
              {formatPrice(quote)}
            </motion.h2>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setIsExported(true)}
              className="flex-1 h-12 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold hover:from-primary/90 hover:to-accent/90 transition-all"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Quote via WhatsApp
            </button>
            <button
              onClick={handleExport}
              className="flex-1 h-12 rounded-lg border border-border text-foreground font-semibold hover:bg-primary/5 transition-all"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Book a Call
            </button>
          </div>

          {isExported && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center"
            >
              ✓ Quote sent via WhatsApp!
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};