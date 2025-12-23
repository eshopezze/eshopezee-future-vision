import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Heart, ShoppingCart, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { fetchCollectionProducts, type FormattedProduct } from "@/lib/shopifyClient";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  handle: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviews: number;
}

const Collection = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayTitle, setDisplayTitle] = useState("");

  // Format fallback collection title from handle
  const fallbackTitle = handle
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Collection";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!handle) return;

      setLoading(true);
      setError(null);

      try {
        const { collectionTitle, products } = await fetchCollectionProducts(handle);

        setProducts(products);
        setDisplayTitle(collectionTitle || fallbackTitle);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [handle, fallbackTitle]);



  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 sm:px-12 lg:px-20">
          {/* Breadcrumb */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Collection Header */}
          <div className="mb-12">
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{loading ? "Loading..." : displayTitle}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {loading
                ? "Searching for the finest products..."
                : `Explore our curated selection of ${displayTitle.toLowerCase()} products`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground animate-pulse">Fetching collection data...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20 glass rounded-3xl border border-destructive/20">
              <p className="text-destructive font-semibold mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white/[0.02] border border-white/5 rounded-2xl p-3 hover:border-white/10 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative aspect-square overflow-hidden mb-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-primary/10 transition-all duration-700 shadow-inner" onClick={() => navigate(`/product/${product.handle}`)}>
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-md border border-white/10 text-primary text-[8px] font-bold px-2 py-1 rounded-full z-20 shadow-lg uppercase tracking-wider">
                          SALE
                        </div>
                      )}
                    </div>

                    <Link to={`/product/${product.handle}`} className="block">
                      <h3 className="text-xs md:text-sm font-semibold text-foreground/90 line-clamp-2 mb-2 px-1 group-hover:text-primary transition-colors duration-300 h-9 leading-tight">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <span className="text-foreground font-bold text-base">₹{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </Link>

                    <Button
                      size="sm"
                      className="w-full h-9 font-bold rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_hsla(175,100%,50%,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group/btn z-20 relative"
                      onClick={(e) => {
                        e.preventDefault();
                        addItem(product.id, 1);
                      }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:scale-110" />
                      <span className="uppercase tracking-[0.15em] text-[9px]">Add</span>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-muted-foreground text-lg mb-4">No products found in this collection.</p>
                  <Link to="/">
                    <Button variant="outline">Browse other collections</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collection;
