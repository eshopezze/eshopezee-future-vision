import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useState, lazy, Suspense } from "react";
import { fetchAllProducts, type FormattedProduct } from "@/lib/shopifyClient";

// Lazy load components for better performance

const HeroSection = lazy(() => import("@/components/HeroSection").then(m => ({ default: m.HeroSection })));
const Marquee = lazy(() => import("@/components/Marquee").then(m => ({ default: m.Marquee })));
const CategoryGridCards = lazy(() => import("@/components/homepage/CategoryGridCards").then(m => ({ default: m.CategoryGridCards })));
const ProductScroller = lazy(() => import("@/components/homepage/ProductScroller"));
const AIFeaturesSection = lazy(() => import("@/components/AIFeaturesSection").then(m => ({ default: m.AIFeaturesSection })));

const SectionLoader = () => (
  <div className="w-full h-48 animate-pulse bg-white/[0.02] rounded-3xl mb-8" />
);

const Index = () => {
  const [trendingProducts, setTrendingProducts] = useState<FormattedProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<FormattedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [trending] = await Promise.all([
          fetchAllProducts(5)
        ]);
        setTrendingProducts(trending.products);
        setNewArrivals(trending.products.slice().reverse()); // Mocking new arrivals for now
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden pt-20">
      <Navbar />

      <Suspense fallback={<SectionLoader />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Marquee />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CategoryGridCards />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ProductScroller
          title="Trending Deals"
          subtitle="Most popular items right now"
          products={trendingProducts}
          loading={loading}
          collectionLink="/collection/trending-product"
        />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ProductScroller
          title="New Tech Arrivals"
          subtitle="Latest gadgets in stock"
          products={newArrivals}
          loading={loading}
          collectionLink="/collection/electronics"
        />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <AIFeaturesSection />
      </Suspense>
      <Footer />
    </main>
  );
};

export default Index;

