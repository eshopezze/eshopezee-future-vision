import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AIFeaturesSection } from "@/components/AIFeaturesSection";
import { TrendingProducts } from "@/components/TrendingProducts";
import { CategoriesSection } from "@/components/CategoriesSection";
import { PromoBanner } from "@/components/PromoBanner";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AIFeaturesSection />
      <TrendingProducts />
      <CategoriesSection />
      <PromoBanner />
      <Footer />
    </main>
  );
};

export default Index;
