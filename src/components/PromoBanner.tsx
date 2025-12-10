import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const PromoBanner = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden border-animated">
          {/* Inner Content */}
          <div className="relative bg-card p-8 md:p-16 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[250px] bg-secondary/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  Limited Time Offer
                </div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
                  Get <span className="gradient-text">30% OFF</span> on Your First Order
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Sign up today and receive an exclusive discount code. Plus, get free shipping on orders over ₹999!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button variant="neonOrange" size="xl" className="group">
                    Claim Offer
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="glass" size="xl">
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Timer/Stats */}
              <div className="glass rounded-2xl p-6 min-w-[280px]">
                <p className="text-sm text-muted-foreground text-center mb-4">Offer ends in:</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: "02", label: "Days" },
                    { value: "14", label: "Hours" },
                    { value: "36", label: "Mins" },
                    { value: "48", label: "Secs" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="font-heading text-2xl md:text-3xl font-bold text-primary">
                        {item.value}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
