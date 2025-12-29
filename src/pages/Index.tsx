import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useState, lazy, Suspense } from "react";
import { fetchAllProducts, type FormattedProduct } from "@/lib/shopifyClient";
import { useSearchParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

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
  const [searchParams] = useSearchParams();
  const { setIsOpen } = useCart();

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

  // Open cart if redirected from login with cart=open
  useEffect(() => {
    if (searchParams.get('cart') === 'open') {
      setIsOpen(true);
    }
  }, [searchParams, setIsOpen]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden pt-16">
      <Navbar />

      <section className="bg-white">
        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
        </Suspense>
      </section>

      <section className="bg-secondary/30 border-y border-border/50">
        <Suspense fallback={<SectionLoader />}>
          <Marquee />
        </Suspense>
      </section>

      <section className="bg-background py-16">
        <Suspense fallback={<SectionLoader />}>
          <CategoryGridCards />
        </Suspense>
      </section>

      <section className="bg-white py-16 border-y border-border/40 shadow-inner">
        <Suspense fallback={<SectionLoader />}>
          <ProductScroller
            title="Trending Deals"
            subtitle="Most popular items right now"
            products={trendingProducts}
            loading={loading}
            collectionLink="/collection/trending-product"
          />
        </Suspense>
      </section>

      <section className="bg-background py-16">
        <Suspense fallback={<SectionLoader />}>
          <ProductScroller
            title="New Tech Arrivals"
            subtitle="Latest gadgets in stock"
            products={newArrivals}
            loading={loading}
            collectionLink="/collection/electronics"
          />
        </Suspense>
      </section>

      <section className="bg-secondary/20 py-16 border-t border-border/50">
        <Suspense fallback={<SectionLoader />}>
          <AIFeaturesSection />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
};

export default Index;

