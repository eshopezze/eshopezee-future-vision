import { Brain, Search, Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Recommendations",
    description: "Personalized product suggestions powered by advanced machine learning algorithms.",
    color: "primary",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Natural language search that understands what you're looking for instantly.",
    color: "secondary",
  },
  // {
  //   icon: Sparkles,
  //   title: "Visual Discovery",
  //   description: "Upload an image and find similar products using AI image recognition.",
  //   color: "accent",
  // },
  // {
  //   icon: TrendingUp,
  //   title: "Price Tracking",
  //   description: "AI monitors prices and alerts you when products drop to your target price.",
  //   color: "primary",
  // },
  {
    icon: ShieldCheck,
    title: "Fraud Protection",
    description: "Advanced AI security systems protect every transaction you make.",
    color: "secondary",
  },
  {
    icon: Zap,
    title: "Instant Checkout",
    description: "One-click purchasing with AI-powered payment optimization.",
    color: "accent",
  },
];

export const AIFeaturesSection = () => {
  return (
    <section id="ai" className="py-32 relative overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 bg-primary/10 px-5 py-2.5 rounded-full inline-block border border-primary/10">
            Artisanal Intelligence
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
            <span className="text-foreground">Shopping Made</span>{" "}
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent italic">Intelligent</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Harness the power of artificial intelligence to enhance your shopping experience
            with smart features that learn and adapt to your preferences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-[2rem] p-10 hover:shadow-neon hover:shadow-primary/10 border border-border/50 hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 ${feature.color === "primary"
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-clay"
                  : feature.color === "secondary"
                    ? "bg-secondary/20 text-secondary border border-secondary/20"
                    : "bg-accent/10 text-accent border border-accent/10"
                  } group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}
              >
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-black text-foreground mb-3 tracking-tighter">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section >
  );
};
