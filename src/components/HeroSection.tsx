import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "Timeless Elegance, Modern Craft",
    subtitle: "Experience organic curation and sophisticated design.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    color: "from-primary/20",
    badge: "Organic Curation",
    cta: "Explore Collection",
    link: "/products"
  },
  {
    id: 2,
    title: "Artisanal Textures & Tones",
    subtitle: "Discover the latest trends in earthy palettes and natural fabrics.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    color: "from-accent/20",
    badge: "Heritage Series",
    cta: "View Collection",
    link: "/products"
  },
  {
    id: 3,
    title: "Premium Home Essentials",
    subtitle: "Upgrade your lifestyle with our organic lifestyle collection.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    color: "from-secondary/20",
    badge: "Limited Edition",
    cta: "Shop The Look",
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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FAF8F4]">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10 pt-16">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                  {slide.badge}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-foreground">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-muted-foreground/80 max-w-xl mb-10 font-normal leading-relaxed">
                {slide.subtitle}
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={slide.link}>
                  <Button size="lg" className="group text-base px-10 py-7 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] border-b-4 border-primary/40">
                    {slide.cta}
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-500" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-20 hidden md:flex items-center">
        <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white border-border shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex gap-2 items-center mx-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${current === idx ? "w-10 bg-primary shadow-clay" : "w-2 bg-foreground/10 hover:bg-foreground/20"
                }`}
            />
          ))}
        </div>
        <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white border-border shadow-sm">
          <ChevronRight className="w-5 h-5" />
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

