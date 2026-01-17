import { Link, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { fetchAllProducts, type FormattedProduct } from "@/lib/shopifyClient";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export const TrendingProducts = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchAllProducts(6); // Fetch 8 products for the grid
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to load trending products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: FormattedProduct) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product.variantId, 1);
  };

  return (
    <section id="trending" className="py-24 relative bg-background">
      <div className="container mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
              Hot Right Now
            </span>
            <h2 className="font-heading text-4xl md:text-6xl font-black tracking-tight">
              <span className="text-foreground">Trending</span>{" "}
              <span className="gradient-text italic">Products</span>
            </h2>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/collection/trending-product')}
            className="group hidden md:flex"
          >
            View All Products
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
          >
            {products.map((product) => (
              <motion.div variants={item} key={product.id}>
                <div
                  onClick={() => navigate(`/product/${product.handle}`)}
                  className="group bg-card rounded-[2.5rem] overflow-hidden border border-border/50 hover:border-primary/50 block cursor-pointer h-full flex flex-col shadow-sm hover:shadow-neon transition-all duration-700"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-secondary/5">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}

                    {/* Discount Tag */}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-white transition-all scale-0 group-hover:scale-100 duration-300 shadow-lg"
                    >
                      <Heart className="w-5 h-5" />
                    </button>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 hidden md:block">
                      <AddToCartButton
                        variant="compact"
                        text="Quick Add"
                        onClick={(e) => handleAddToCart(e, product)}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-foreground mt-0.5">{product.rating}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">({product.reviews})</span>
                    </div>

                    {/* Name */}
                    <h3 className="font-heading font-semibold text-foreground mb-auto line-clamp-2 leading-tight group-hover:text-primary transition-colors text-sm md:text-base">
                      {product.name}
                    </h3>

                    {/* Divider */}
                    <div className="h-px w-full bg-border/50 my-3" />

                    {/* Price & Action */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="font-heading text-lg font-bold text-primary">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="md:hidden w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/products')}
            className="w-full"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};
