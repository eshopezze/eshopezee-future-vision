import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "The Future of Online Shopping",
    subtitle: "Experience AI-powered recommendations and smart search.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    color: "from-primary/20",
    badge: "AI-Powered Experience",
    cta: "Explore Products",
    link: "/products"
  },
  {
    id: 2,
    title: "Trendsetting Collections",
    subtitle: "Discover the latest fashion trends curated just for you.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    color: "from-secondary/20",
    badge: "New Arrivals",
    cta: "Shop Now",
    link: "/products"
  },
  {
    id: 3,
    title: "Premium Tech Gadgets",
    subtitle: "Upgrade your lifestyle with our cutting-edge electronics.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    color: "from-purple-500/20",
    badge: "Best Sellers",
    cta: "View Gadgets",
    link: "/collection/electronics"
  }
];

export const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  const handleNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-background/90 via-background/60`} />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </motion.div>
      </AnimatePresence>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10 pt-20">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-bold tracking-wider text-white uppercase">
                  {slide.badge}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tight drop-shadow-2xl">
                {slide.title.split(" ").map((word, i) => (
                  <span key={i} className="inline-block mr-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                    {word}
                  </span>
                ))}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-10 font-light leading-relaxed">
                {slide.subtitle}
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={slide.link}>
                  <Button variant="hero" size="xl" className="group text-lg px-8 py-6 rounded-2xl">
                    {slide.cta}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-20 hidden md:flex">
        <Button variant="ghost" size="icon" onClick={handlePrev} className="rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="flex gap-2 items-center">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${current === idx ? "w-8 bg-primary" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
            />
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={handleNext} className="rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10">
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${current === idx ? "w-6 bg-primary" : "w-1.5 bg-white/30"
              }`}
          />
        ))}
      </div>
    </section>
  );
};

