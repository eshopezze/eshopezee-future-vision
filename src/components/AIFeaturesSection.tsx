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
    <section id="ai" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-white font-medium text-sm uppercase tracking-widest mb-4 block">
            AI-Powered Features
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Shopping Made</span>{" "}
            <span className="gradient-text">Intelligent</span>
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
              className="group glass rounded-2xl p-8 hover-lift border border-transparent hover:border-primary/30"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color === "primary"
                  ? "bg-primary/20 text-primary"
                  : feature.color === "secondary"
                    ? "bg-secondary/20 text-secondary"
                    : "bg-accent/20 text-accent"
                  } group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
