import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Mini Portable Blender Mixer",
    price: 999,
    originalPrice: 2750,
    image: "https://eshopezee.com/cdn/shop/files/71ug8NIDxSL._SL1500_small.jpg?v=1748236265",
    rating: 4.8,
    reviews: 156,
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Portable High Power 2 in 1 Car Vacuum Cleaner",
    price: 399,
    originalPrice: 950,
    image: "https://eshopezee.com/cdn/shop/files/61iRtImTxVL._SL1500_small.jpg?v=1748235105",
    rating: 4.7,
    reviews: 89,
    tag: "58% OFF",
  },
  {
    id: 3,
    name: "LED Pop It Fidget Toy",
    price: 690,
    originalPrice: 1200,
    image: "https://eshopezee.com/cdn/shop/files/firstimage_small.jpg?v=1748234964",
    rating: 4.9,
    reviews: 234,
    tag: "Hot",
  },
  {
    id: 4,
    name: "Robot Sky Space Stars Light",
    price: 1100,
    originalPrice: 2200,
    image: "https://eshopezee.com/cdn/shop/files/61BCB2qaZmL._SL1000_small.jpg?v=1748234864",
    rating: 4.8,
    reviews: 178,
    tag: "50% OFF",
  },
  {
    id: 5,
    name: "Smart Dancing Cactus Toy",
    price: 399,
    originalPrice: 1100,
    image: "https://eshopezee.com/cdn/shop/files/81VO75i9jZL._SL1500_small.jpg?v=1748236245",
    rating: 4.6,
    reviews: 312,
    tag: "Trending",
  },
  {
    id: 6,
    name: "Intelligent Neck Massager",
    price: 999,
    originalPrice: 2680,
    image: "https://eshopezee.com/cdn/shop/files/Intelligent-Neck-Massager.-Taran-Cervical-Vertebra-Massager-Treatment-Device-askddeal.com-1634285850_small.jpg?v=1748235796",
    rating: 4.7,
    reviews: 145,
    tag: "63% OFF",
  },
  {
    id: 7,
    name: "LED Colorful Star Galaxy Projector",
    price: 850,
    originalPrice: 3500,
    image: "https://eshopezee.com/cdn/shop/files/product-image-1872105059_small.jpg?v=1748235744",
    rating: 4.9,
    reviews: 267,
    tag: "Best Seller",
  },
  {
    id: 8,
    name: "Electric Food Crusher Mini Garlic Machine",
    price: 400,
    originalPrice: 1600,
    image: "https://eshopezee.com/cdn/shop/files/product-image-1643760763_small.jpg?v=1748236041",
    rating: 4.5,
    reviews: 98,
    tag: "75% OFF",
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
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="group glass rounded-2xl overflow-hidden hover-lift border border-transparent hover:border-primary/30 block"
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
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-secondary transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </button>
                {/* Quick Add */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    size="sm"
                    onClick={(e) => e.preventDefault()}
                  >
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
