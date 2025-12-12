import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ChevronLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

// Sample product data
const productsData: Record<string, {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
}> = {
  "1": {
    id: 1,
    name: "Mini Portable Blender Mixer",
    price: 999,
    originalPrice: 2750,
    description: "This portable blender is perfect for making smoothies, juices, and shakes on the go. Features magnetic wireless charging, powerful motor with 2/4/6 blade options, and a durable BPA-free design. Ideal for gym, office, travel, or home use.",
    features: [
      "Magnetic wireless charging - charge anywhere",
      "Powerful motor for smooth blending",
      "BPA-free food-grade materials",
      "Portable and lightweight design",
      "Easy to clean with detachable parts",
      "USB rechargeable battery"
    ],
    images: [
      "https://eshopezee.com/cdn/shop/files/71ug8NIDxSL._SL1500_small.jpg?v=1748236265",
      "https://eshopezee.com/cdn/shop/files/51zyI2KX-RL_small.jpg?v=1748236265",
      "https://eshopezee.com/cdn/shop/files/51Xiugd94EL_small.jpg?v=1748236265",
      "https://eshopezee.com/cdn/shop/files/61h0SUqFA6L._SL1500_small.jpg?v=1748236265"
    ],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    category: "Kitchen Products"
  },
  "2": {
    id: 2,
    name: "Portable High Power 2 in 1 Car Vacuum Cleaner",
    price: 399,
    originalPrice: 950,
    description: "USB rechargeable wireless handheld car vacuum cleaner with smooth design and built-in LED light. Perfect for wet and dry cleaning in your car, home, or office.",
    features: [
      "2-in-1 vacuum and blower function",
      "Built-in LED light for dark areas",
      "USB rechargeable battery",
      "Portable wet and dry cleaning",
      "HEPA filter for allergens",
      "Multiple nozzle attachments included"
    ],
    images: [
      "https://eshopezee.com/cdn/shop/files/61iRtImTxVL._SL1500_small.jpg?v=1748235105",
      "https://eshopezee.com/cdn/shop/files/51PzBglHXjL._SL1500__1_small.jpg?v=1748235105"
    ],
    rating: 4.7,
    reviews: 89,
    inStock: true,
    category: "Home Improvement"
  },
  "3": {
    id: 3,
    name: "LED Pop It Fidget Toy",
    price: 690,
    originalPrice: 1200,
    description: "LED Pop It Fidget Toy with music, four modes and electronic speed push game. Perfect for stress relief and brain exercise, ideal for adults, boys and girls.",
    features: [
      "4 exciting game modes",
      "LED lights with multiple colors",
      "Built-in music and sound effects",
      "Speed push challenge game",
      "Stress relief and brain exercise",
      "Suitable for all ages"
    ],
    images: [
      "https://eshopezee.com/cdn/shop/files/firstimage_small.jpg?v=1748234964",
      "https://eshopezee.com/cdn/shop/files/61iWOGal-7L._SL1500_small.jpg?v=1748234964"
    ],
    rating: 4.9,
    reviews: 234,
    inStock: true,
    category: "Toys & Games"
  },
  "4": {
    id: 4,
    name: "Robot Sky Space Stars Light",
    price: 1100,
    originalPrice: 2200,
    description: "Astronaut Galaxy Projector Night Lamp for bedroom. Features remote control, adjustable brightness, and creates a stunning starry sky atmosphere for kids and adults.",
    features: [
      "360° rotation projection",
      "Remote control included",
      "Adjustable brightness levels",
      "Timer function",
      "USB powered",
      "Perfect for bedroom decor"
    ],
    images: [
      "https://eshopezee.com/cdn/shop/files/61BCB2qaZmL._SL1000_small.jpg?v=1748234864",
      "https://eshopezee.com/cdn/shop/files/61jQWt-1xSL._SL1500_small.jpg?v=1748234864"
    ],
    rating: 4.8,
    reviews: 178,
    inStock: true,
    category: "Lighting Products"
  },
  "5": {
    id: 5,
    name: "Smart Dancing Cactus Toy",
    price: 399,
    originalPrice: 1100,
    description: "Adorable dancing cactus toy that sings, dances, and repeats what you say. Perfect gift for kids and brings joy to any room.",
    features: [
      "Sings 120+ songs",
      "Voice recording and playback",
      "Dancing movements",
      "Rechargeable battery",
      "Soft plush material",
      "LED light effects"
    ],
    images: [
      "https://eshopezee.com/cdn/shop/files/81VO75i9jZL._SL1500_small.jpg?v=1748236245",
      "https://eshopezee.com/cdn/shop/files/713YhuBnJAL._SL1500_small.jpg?v=1748236245"
    ],
    rating: 4.6,
    reviews: 312,
    inStock: true,
    category: "Toys & Games"
  },
  "6": {
    id: 6,
    name: "Intelligent Neck Massager",
    price: 999,
    originalPrice: 2680,
    description: "Taran Cervical Vertebra Massager Treatment Device. Features multiple massage modes, heat therapy, and portable design for neck pain relief.",
    features: [
      "EMS pulse technology",
      "Heat therapy function",
      "6 massage modes",
      "15 intensity levels",
      "Portable and lightweight",
      "USB rechargeable"
    ],
    images: [
      "https://eshopezee.com/cdn/shop/files/Intelligent-Neck-Massager.-Taran-Cervical-Vertebra-Massager-Treatment-Device-askddeal.com-1634285850_small.jpg?v=1748235796",
      "https://eshopezee.com/cdn/shop/files/Intelligent-Neck-Massager.-Taran-Cervical-Vertebra-Massager-Treatment-Device-askddeal.com-1634285839_small.jpg?v=1748235796"
    ],
    rating: 4.7,
    reviews: 145,
    inStock: true,
    category: "Fitness Products"
  },
  "7": {
    id: 7,
    name: "LED Colorful Star Galaxy Projector",
    price: 850,
    originalPrice: 3500,
    description: "Ocean Wave Night Light with colorful star projection. Perfect for creating a romantic atmosphere in bedrooms, parties, and home decoration.",
    features: [
      "Ocean wave + starry sky effect",
      "16 color combinations",
      "Bluetooth speaker built-in",
      "Remote control included",
      "Timer auto-off function",
      "USB and adapter powered"
    ],
    images: [
      "https://eshopezee.com/cdn/shop/files/product-image-1872105059_small.jpg?v=1748235744",
      "https://eshopezee.com/cdn/shop/files/product-image-1829042961_small.jpg?v=1748235744"
    ],
    rating: 4.9,
    reviews: 267,
    inStock: true,
    category: "Lighting Products"
  },
  "8": {
    id: 8,
    name: "Electric Food Crusher Mini Garlic Machine",
    price: 400,
    originalPrice: 1600,
    description: "Mini Garlic Press Garlic Crusher Vegetable Chopper. Electric food crusher perfect for garlic, onions, nuts, and more.",
    features: [
      "Powerful 250W motor",
      "Stainless steel blades",
      "One-touch operation",
      "USB rechargeable",
      "Waterproof design",
      "Easy to clean"
    ],
    images: [
      "https://eshopezee.com/cdn/shop/files/product-image-1643760763_small.jpg?v=1748236041",
      "https://eshopezee.com/cdn/shop/files/product-image-1663298425_small.jpg?v=1748236041"
    ],
    rating: 4.5,
    reviews: 98,
    inStock: true,
    category: "Kitchen Products"
  }
};

// Sample reviews data
const sampleReviews = [
  {
    id: 1,
    user: "Priya S.",
    avatar: "PS",
    rating: 5,
    date: "2 weeks ago",
    title: "Excellent product!",
    comment: "Very happy with my purchase. The quality is amazing and it works exactly as described. Fast shipping too!",
    helpful: 24,
    notHelpful: 2
  },
  {
    id: 2,
    user: "Rahul M.",
    avatar: "RM",
    rating: 4,
    date: "1 month ago",
    title: "Good value for money",
    comment: "Product is good overall. Minor issues with packaging but the product itself is great. Would recommend.",
    helpful: 18,
    notHelpful: 1
  },
  {
    id: 3,
    user: "Anita K.",
    avatar: "AK",
    rating: 5,
    date: "3 weeks ago",
    title: "Love it!",
    comment: "Bought this as a gift and the recipient loved it! Great quality and looks even better in person.",
    helpful: 32,
    notHelpful: 0
  },
  {
    id: 4,
    user: "Vikram P.",
    avatar: "VP",
    rating: 4,
    date: "2 months ago",
    title: "Satisfied customer",
    comment: "Decent product for the price. Does what it's supposed to do. Customer service was helpful when I had questions.",
    helpful: 15,
    notHelpful: 3
  }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
      });
    }
    setQuantity(1);
  };

  const product = id ? productsData[id] : null;

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4 inline" /> Back
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square glass rounded-2xl overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover animate-fade-in"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-secondary font-medium">{product.category}</span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="font-medium text-foreground">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="font-heading text-4xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
              <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
              <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-bold">{discount}% OFF</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Key Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center glass rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:text-primary transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:text-primary transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <Button variant="hero" size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? "text-secondary border-secondary" : ""}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-secondary" : ""}`} />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">7 Days Return</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="py-12 border-t border-border/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="font-bold text-foreground">{product.rating}</span>
              <span className="text-muted-foreground">based on {product.reviews} reviews</span>
            </div>
          </div>

          <div className="grid gap-6">
            {sampleReviews.map((review) => (
              <div key={review.id} className="glass rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{review.user}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <h5 className="font-medium text-foreground mb-2">{review.title}</h5>
                    <p className="text-muted-foreground mb-4">{review.comment}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful})
                      </button>
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                        ({review.notHelpful})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default ProductDetail;