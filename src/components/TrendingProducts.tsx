import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 2499,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 124,
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Smart Fitness Watch Pro",
    price: 3999,
    originalPrice: 7999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 89,
    tag: "50% OFF",
  },
  {
    id: 3,
    name: "Minimalist Leather Wallet",
    price: 999,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 56,
    tag: "New",
  },
  {
    id: 4,
    name: "Portable Bluetooth Speaker",
    price: 1799,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 203,
    tag: "Trending",
  },
];

export const TrendingProducts = () => {
  return (
    <section id="trending" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-secondary font-medium text-sm uppercase tracking-widest mb-4 block">
              Hot Right Now
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold">
              <span className="text-foreground">Trending</span>{" "}
              <span className="gradient-text-secondary">Products</span>
            </h2>
          </div>
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group glass rounded-2xl overflow-hidden hover-lift border border-transparent hover:border-primary/30"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Tag */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                  {product.tag}
                </span>
                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-secondary transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                {/* Quick Add */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="hero" className="w-full" size="sm">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="text-sm font-medium text-foreground">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                </div>

                {/* Name */}
                <h3 className="font-medium text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="font-heading text-xl font-bold text-primary">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
