import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  Rocket, 
  DollarSign, 
  Clock,
  MessageSquare,
  Lighthouse,
  Briefcase,
  Video,
  Workflow
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuizStep {
  businessType: string;
  goal: string;
  budget: string;
  timeline: string;
}

const steps = [
  { id: "business", label: "Business Type", icon: Sparkles },
  { id: "goal", label: "Goal", icon: Rocket },
  { id: "budget", label: "Budget", icon: DollarSign },
  { id: "timeline", label: "Timeline", icon: Clock },
];

const businessTypeOptions = [
  { value: "startup", label: "Startup", icon: Rocket },
  { value: "sme", label: "SME", icon: Briefcase },
  { value: "enterprise", label: "Enterprise", icon: Lighthouse },
  { value: "creator", label: "Creator", icon: Sparkles },
];

const goals = [
  { value: "brand", label: "Brand Identity", icon: Sparkles },
  { value: "marketing", label: "Marketing Growth", icon: Rocket },
  { value: "website", label: "Website Development", icon: Rocket },
  { value: "video", label: "Video Production", icon: Video },
  { value: "sell", label: "Sales & Leads", icon: DollarSign },
  { value: "automate", label: "Automation", icon: Workflow },
];

const budgetOptions = [
  { value: "under-50k", label: "Under ₹50,000", icon: DollarSign },
  { value: "50k-1L", label: "₹50,000 - ₹1,00,000", icon: DollarSign },
  { value: "1L-2.5L", label: "₹1,00,000 - ₹2,50,000", icon: DollarSign },
  { value: "2.5L-5L", label: "₹2,50,000 - ₹5,00,000", icon: DollarSign },
  { value: "5L-plus", label: "₹5,00,000+", icon: DollarSign },
];

const timelineOptions = [
  { value: "1wk", label: "1-2 Weeks", icon: Clock },
  { value: "2-4wks", label: "2-4 Weeks", icon: Clock },
  { value: "1-3mo", label: "1-3 Months", icon: Clock },
  { value: "3-6mo", label: "3-6 Months", icon: Clock },
];

const businessToServices = (business: string): string[] => {
  switch (business) {
    case "startup":
      return ["brand", "marketing", "website", "automate"];
    case "sme":
      return ["brand", "marketing", "website", "video", "automate"];
    case "enterprise":
      return ["brand", "marketing", "website", "video", "photography", "automate"];
    case "creator":
      return ["brand", "marketing", "video", "photography"];
    default:
      return ["brand", "marketing"];
  }
};

// Step component
const StepQuestion = ({ 
  step, 
  answer, 
  onAnswer, 
  optionLabels 
}: { 
  step: string; 
  answer: string; 
  onAnswer: (value: string) => void; 
  optionLabels: string[]; 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-muted-foreground">
        {steps.find(s => s.id === step)?.label}
      </label>
      <div className="grid grid-cols-2 gap-3">
        {optionLabels.map((label) => (
          <button
            key={label}
            onClick={() => onAnswer(label)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              p-4 rounded-xl border transition-all duration-300 text-left
              ${answer === label
                ? "border-primary bg-primary/5"
                : isHovered
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card hover:border-primary/20"
              }
            `}
          >
            <div className="text-lg mb-1">
              {steps.find(s => s.id === step)?.icon ?? Sparkles}
            </div>
            <span className="font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Quiz Component
export const Quiz = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizStep>({
    businessType: "",
    goal: "",
    budget: "",
    timeline: "",
  });
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = useCallback((step: string, value: string) => {
    setAnswers(prev => ({ ...prev, [step]: value }));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Save to Supabase
      const { error } = await supabase.from('leads').insert({
        name: `Quiz: ${answers.businessType}`,
        email: 'quiz@cannvasartel.com',
        business_type: answers.businessType,
        service_needed: answers.goal,
        budget: answers.budget,
        message: `Quiz results - Business: ${answers.businessType}, Goal: ${answers.goal}, Budget: ${answers.budget}, Timeline: ${answers.timeline}`,
        status: 'new',
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Supabase error:', error);
      }

      // Call n8n webhook
      if (import.meta.env.VITE_N8N_WEBHOOK_URL) {
        await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Quiz: ${answers.businessType}`,
            email: 'quiz@cannvasartel.com',
            business_type: answers.businessType,
            service_needed: answers.goal,
            budget: answers.budget,
            message: `Quiz results`,
            source: 'quiz',
            timestamp: new Date().toISOString(),
          }),
        });
      }

      setIsComplete(true);
      toast({
        title: "Quiz Complete!",
        description: "We'll recommend the best services for your business.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, toast]);

  const currentStepData = steps[currentStep];

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-display font-bold mb-4">Quiz Complete!</h3>
        <p className="text-muted-foreground mb-8">
          Based on your answers, here's our recommendation:
        </p>

        <div className="bg-card rounded-xl p-6 mb-8">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Recommended Services</h4>
          <div className="flex flex-wrap gap-2">
            {answers.businessType && businessToServices(answers.businessType).map((service) => (
              <span key={service} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                {service.charAt(0).toUpperCase() + service.slice(1).replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 mb-8 text-left">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Your Details</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Business:</strong> {answers.businessType}</p>
            <p><strong>Goal:</strong> {answers.goal}</p>
            <p><strong>Budget:</strong> {answers.budget}</p>
            <p><strong>Timeline:</strong> {answers.timeline}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentStep(0);
            setAnswers({ businessType: "", goal: "", budget: "", timeline: "" });
            setIsComplete(false);
          }}
          className="h-12 px-8 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all"
        >
          Take Quiz Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`
                flex items-center gap-2 text-sm font-medium transition-all
                ${i === currentStep
                  ? "text-primary"
                  : i < currentStep
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50"
                }
              `}
            >
              {i < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <div className={`w-4 h-4 rounded-full border-2 ${i === currentStep ? 'border-primary bg-primary' : 'border-border'}`} />
              )}
              {step.label}
            </div>
          ))}
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: "25%" }}
            animate={{ width: `${((currentStep + 1) / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl p-8 border border-border"
        >
          <StepQuestion
            step={currentStepData.id}
            answer={answers[currentStepData.id as keyof QuizStep] || ""}
            onAnswer={(value) => handleAnswer(currentStepData.id, value)}
            optionLabels={
              currentStepData.id === "business"
                ? ["Startup", "SME", "Enterprise", "Creator"]
                : currentStepData.id === "goal"
                  ? ["Brand", "Marketing", "Website", "Video", "Sales", "Automation"]
                  : currentStepData.id === "budget"
                    ? ["Under ₹50k", "₹50k-1L", "₹1L-2.5L", "₹2.5L-5L", "₹5L+"]
                    : ["1-2 Weeks", "2-4 Weeks", "1-3 Months", "3-6 Months"]
            }
          />

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep === 3 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold hover:from-primary/90 hover:to-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Get Recommendations
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;