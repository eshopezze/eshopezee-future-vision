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
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[250px] bg-accent/10 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-primary/20">
                  <Sparkles className="w-3 h-3" />
                  Heritage Privilege
                </div>
                <h2 className="font-heading text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tighter leading-[0.9]">
                  Claim Your <span className="gradient-text italic">Privilege</span> Benefit
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-medium">
                  Join our inner circle and receive an exclusive 30% reduction on your inaugural acquisition. Meticulously crafted value for the discerning eye.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button variant="hero" size="xl" className="group h-16 px-10 rounded-2xl shadow-clay border-b-4 border-primary/30 active:border-b-0 active:translate-y-1 transition-all">
                    Initialize Identity
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="ghost" size="xl" className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs">
                    Learn Principles
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
