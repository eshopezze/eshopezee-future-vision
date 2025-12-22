import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Marquee } from "@/components/Marquee";
import { CategoriesSection } from "@/components/CategoriesSection";
import { TrendingProducts } from "@/components/TrendingProducts";
import { PromoBanner } from "@/components/PromoBanner";
import { NewArrivals } from "@/components/NewArrivals";
import { AIFeaturesSection } from "@/components/AIFeaturesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <Marquee />
      <CategoriesSection />
      <TrendingProducts />
      <PromoBanner />
      <NewArrivals />
      <AIFeaturesSection />
      <Footer />
    </main>
  );
};

export default Index;
