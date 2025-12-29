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
          <div className="mb-20 relative">
            <div className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <h1 className="font-heading text-5xl md:text-8xl font-black mb-8 tracking-tighter">
              <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent italic">{loading ? "Synchronizing..." : displayTitle}</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-2xl font-medium max-w-3xl leading-relaxed">
              {loading
                ? "Preparing your personalized selection..."
                : `Discover our exclusive ${displayTitle.toLowerCase()} collection, meticulously curated for uncompromising quality and timeless aesthetic.`}
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
                    className="group bg-white border border-border/50 rounded-[2.5rem] p-5 hover:border-primary/30 transition-all duration-700 relative overflow-hidden shadow-sm hover:shadow-primary/10"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative aspect-square overflow-hidden mb-4 rounded-2xl bg-secondary/5 border border-border/30 group-hover:border-primary/10 transition-all duration-700 shadow-inner group/img" onClick={() => navigate(`/product/${product.handle}`)}>
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="absolute top-3 right-3 bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-xl z-20 shadow-lg uppercase tracking-widest">
                          SALE
                        </div>
                      )}
                    </div>

                    <Link to={`/product/${product.handle}`} className="block">
                      <h3 className="text-base font-black text-foreground/90 line-clamp-2 mb-3 px-1 group-hover:text-primary transition-colors duration-300 h-12 leading-tight tracking-tight">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3 mb-5 px-1">
                        <span className="text-primary font-black text-2xl tracking-tighter">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-foreground/30 font-bold line-through decoration-primary/40">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </Link>

                    <Button
                      size="sm"
                      className="w-full h-12 font-black rounded-2xl bg-[#2A2A2A] hover:bg-[#1A1A1A] text-white shadow-lg shadow-black/10 transition-all duration-500 flex items-center justify-center gap-2 group/btn z-20 relative overflow-hidden uppercase tracking-[0.2em] text-[10px] border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                      onClick={(e) => {
                        e.preventDefault();
                        addItem(product.id, 1);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 transition-transform duration-500 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
                      Add to Cart
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
