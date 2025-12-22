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

  const handleAddToCart = (product: Product) => {
    // Attempt to extract numeric ID from Shopify GID
    const numericId = product.id.split('/').pop();

    addItem({
      id: numericId ? parseInt(numericId) : Math.random(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

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
                    className="group glass rounded-2xl overflow-hidden border border-transparent hover:border-primary/30 transition-all duration-300 hover-lift"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.handle}`)}>
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-full">
                          SALE
                        </span>
                      )}
                      <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-foreground">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">₹{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 border-primary/20 hover:border-primary"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
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
