import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Dummy products data for collections
const dummyProducts: Record<string, Array<{
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
}>> = {
  default: [
    {
      id: "prod-1",
      name: "Premium Wireless Headphones",
      price: 199.99,
      originalPrice: 249.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 234,
    },
    {
      id: "prod-2",
      name: "Smart Watch Pro",
      price: 349.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 189,
    },
    {
      id: "prod-3",
      name: "Portable Bluetooth Speaker",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
      rating: 4.5,
      reviews: 156,
    },
    {
      id: "prod-4",
      name: "Wireless Charging Pad",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=400&h=400&fit=crop",
      rating: 4.3,
      reviews: 98,
    },
    {
      id: "prod-5",
      name: "Noise Cancelling Earbuds",
      price: 159.99,
      originalPrice: 189.99,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 312,
    },
    {
      id: "prod-6",
      name: "Ultra HD Action Camera",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
      rating: 4.4,
      reviews: 87,
    },
    {
      id: "prod-7",
      name: "Smart Home Hub",
      price: 129.99,
      originalPrice: 159.99,
      image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=400&fit=crop",
      rating: 4.2,
      reviews: 145,
    },
    {
      id: "prod-8",
      name: "Mechanical Keyboard RGB",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 423,
    },
  ],
};

const Collection = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addItem } = useCart();
  
  // Format collection title from handle
  const collectionTitle = handle
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Collection";

  const products = dummyProducts.default;

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: parseInt(product.id.replace('prod-', '')) || Math.random(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
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
              <span className="gradient-text">{collectionTitle}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore our curated selection of {collectionTitle.toLowerCase()} products
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group glass rounded-2xl overflow-hidden border border-transparent hover:border-primary/30 transition-all duration-300 hover-lift"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.originalPrice && (
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
                      <span className="text-lg font-bold text-primary">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collection;
