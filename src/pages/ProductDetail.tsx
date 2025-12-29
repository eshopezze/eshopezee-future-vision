import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { fetchProductByHandle, type DetailedProduct, type ProductVariant } from "@/lib/shopifyClient";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

// Helper function to detect if variants are colors
const isColorVariant = (variants: ProductVariant[]): boolean => {
  const colorKeywords = ['color', 'colour', 'black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'gray', 'grey', 'beige', 'navy', 'maroon'];
  return variants.some(v =>
    colorKeywords.some(keyword => v.title.toLowerCase().includes(keyword))
  );
};

// Helper function to get color hex value from variant title
const getVariantColor = (title: string): string => {
  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    pink: '#EC4899',
    purple: '#A855F7',
    orange: '#F97316',
    brown: '#92400E',
    gray: '#6B7280',
    grey: '#6B7280',
    beige: '#F5F5DC',
    navy: '#1E3A8A',
    maroon: '#7F1D1D',
    gold: '#FFD700',
    silver: '#C0C0C0',
    cream: '#FFFDD0',
    olive: '#808000',
    teal: '#14B8A6',
    cyan: '#06B6D4',
    lime: '#84CC16',
    indigo: '#6366F1',
    violet: '#8B5CF6',
    magenta: '#D946EF',
    turquoise: '#40E0D0',
    coral: '#FF7F50',
    salmon: '#FA8072',
    khaki: '#F0E68C',
    tan: '#D2B48C',
  };

  const lowerTitle = title.toLowerCase();
  for (const [colorName, hexValue] of Object.entries(colorMap)) {
    if (lowerTitle.includes(colorName)) {
      return hexValue;
    }
  }

  // Default to a gradient if no color match
  return '#9CA3AF';
};

// Helper function to sort size values
const sortSizeValues = (values: string[]): string[] => {
  const sizeOrder: Record<string, number> = {
    'XXS': 1,
    'XS': 2,
    'S': 3,
    'M': 4,
    'L': 5,
    'XL': 6,
    'XXL': 7,
    '2XL': 8,
    '3XL': 9,
    'Free Size': 10,
    'One Size': 11
  };

  return [...values].sort((a, b) => {
    const orderA = sizeOrder[a.toUpperCase()] || 99;
    const orderB = sizeOrder[b.toUpperCase()] || 99;
    return orderA - orderB;
  });
};

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;

      setLoading(true);
      setError(null);

      try {
        const productData = await fetchProductByHandle(handle);

        if (!productData) {
          setError('Product not found');
          return;
        }

        setProduct(productData);
        // Set first available variant as default
        if (productData.variants && productData.variants.length > 0) {
          const defaultVariant = productData.variants[0];
          setSelectedVariant(defaultVariant);

          // Initialize selected options
          const initialOptions: Record<string, string> = {};
          defaultVariant.selectedOptions.forEach(opt => {
            initialOptions[opt.name] = opt.value;
          });
          setSelectedOptions(initialOptions);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addItem(selectedVariant.id, quantity);
    setQuantity(1);
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    // Find the variant that matches all selected options
    if (product?.variants) {
      const matchingVariant = product.variants.find(variant =>
        variant.selectedOptions.every(opt => newOptions[opt.name] === opt.value)
      );
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      }
    }
  };

  // Get current price based on selected variant
  const currentPrice = selectedVariant?.price || product?.price || 0;
  const currentOriginalPrice = selectedVariant?.compareAtPrice || product?.originalPrice;

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    api.scrollTo(selectedImage);
  }, [api, selectedImage]);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setSelectedImage(api.selectedScrollSnap());
    });
  }, [api]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-12 lg:px-20 py-24 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-black uppercase tracking-[0.3em] animate-pulse pl-2">Synchronizing Collection...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-12 lg:px-20 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || 'Product Not Found'}
          </h1>
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

      <div className="container mx-auto px-6 sm:px-12 lg:px-20 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-muted-foreground mb-4 md:mb-8 overflow-hidden">
          <Link to="/" className="hover:text-primary transition-colors flex-shrink-0">
            <ChevronLeft className="w-4 h-4 inline" /> Back
          </Link>
          <span className="flex-shrink-0">/</span>
          {product.collection ? (
            <>
              <Link to={`/collection/${product.collection.handle}`} className="hover:text-primary transition-colors flex-shrink-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] xs:max-w-[120px] sm:max-w-none">
                {product.collection.title}
              </Link>
              <span className="flex-shrink-0">/</span>
            </>
          ) : (
            <>
              <span className="flex-shrink-0">{product.category}</span>
              <span className="flex-shrink-0">/</span>
            </>
          )}
          <span className="text-foreground font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] xs:max-w-[150px] sm:max-w-none">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">

          {/* Mobile Title Section - Only visible on mobile/tablet */}
          <div className="lg:hidden space-y-4">
            <div>
              <span className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
                {product.category}
              </span>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-4 leading-tight tracking-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-black text-foreground">{product.rating}</span>
              <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest pl-1">({product.reviews} reviews)</span>
            </div>
          </div>

          {/* Left Column: Image Gallery */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Carousel setApi={setApi} className="w-full relative group">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index} className="flex items-center justify-center">
                    <div className="aspect-square sm:aspect-[4/3] w-full bg-white rounded-3xl overflow-hidden flex items-center justify-center relative border border-border/50 group-hover:border-primary/20 transition-all duration-700">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain p-4 sm:p-8 group-hover:scale-105 transition-transform duration-1000"
                      />
                      {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xl z-10 uppercase tracking-widest">
                          {discount}% OFF
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => api?.scrollPrev()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => api?.scrollNext()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </Carousel>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white",
                    selectedImage === index ? "border-primary shadow-clay ring-4 ring-primary/5" : "border-border/30 opacity-70 hover:opacity-100 hover:border-primary/50"
                  )}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="space-y-8">
            {/* Desktop Title Section - Only visible on desktop */}
            <div className="hidden lg:block space-y-4">
              <span className="text-xs text-primary font-black uppercase tracking-[0.3em] bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/10 inline-block">{product.category}</span>
              <h1 className="font-heading text-4xl lg:text-5xl font-black text-foreground leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                    />
                  ))}
                </div>
                <span className="font-black text-xl text-foreground">{product.rating}</span>
                <span className="text-muted-foreground font-medium">({product.reviews} customer reviews)</span>
              </div>
            </div>

            {/* Price section - enhanced for mobile visibility */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-transparent border border-primary/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
              <div className="flex items-baseline gap-4 relative z-10">
                <span className="font-heading text-5xl lg:text-6xl font-black text-primary tracking-tighter">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 font-bold">
                    <span className="text-lg text-foreground/30 line-through decoration-primary/40">₹{currentOriginalPrice.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground/40 mt-4 uppercase tracking-[0.3em] font-black">Heritage Craftsmanship Included</p>
            </div>

            {/* Variant Selection */}
            {product.options && product.options.length > 0 && product.options[0].name !== 'Title' && (
              <div className="space-y-6 pt-4 border-t border-border/30">
                {product.options.map((option) => {
                  const isColor = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour');

                  return (
                    <div key={option.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm tracking-widest uppercase text-muted-foreground">
                          {option.name}
                        </h3>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          {selectedOptions[option.name]}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {(option.name.toLowerCase() === 'size' ? sortSizeValues(option.values) : option.values).map((value) => {
                          const isActive = selectedOptions[option.name] === value;
                          const variantColor = isColor ? getVariantColor(value) : null;

                          return (
                            <button
                              key={value}
                              onClick={() => handleOptionChange(option.name, value)}
                              className={cn(
                                "group relative transition-all duration-300",
                                isColor
                                  ? cn(
                                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2",
                                    isActive
                                      ? 'border-primary ring-4 ring-primary/20 scale-110'
                                      : 'border-border/50 hover:border-primary/60'
                                  )
                                  : cn(
                                    "px-5 py-2.5 rounded-xl border-2 font-bold text-xs uppercase tracking-wider min-w-[3rem]",
                                    isActive
                                      ? 'border-primary bg-primary/10 text-primary shadow-neon-subtle'
                                      : 'border-border/50 hover:border-primary/40 text-muted-foreground hover:text-foreground'
                                  )
                              )}
                              title={value}
                            >
                              {isColor ? (
                                <div
                                  className="w-full h-full rounded-full shadow-inner"
                                  style={{ backgroundColor: variantColor || '#9CA3AF' }}
                                />
                              ) : (
                                value
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {selectedVariant && !selectedVariant.availableForSale && (
                  <p className="text-destructive font-bold text-sm bg-destructive/10 p-3 rounded-xl border border-destructive/20 animate-pulse text-center">
                    This combination is currently out of stock
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-3 pt-6 border-t border-border/30">
              <h3 className="font-bold text-sm tracking-widest uppercase text-muted-foreground">Description</h3>
              <div className="relative">
                <p className={cn(
                  "text-muted-foreground leading-relaxed text-sm sm:text-base",
                  !showFullDescription && product.description.length > 250 && "line-clamp-4"
                )}>
                  {product.description}
                </p>
                {product.description.length > 250 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary hover:text-primary/80 text-xs font-bold transition-all flex items-center gap-1 mt-2 uppercase tracking-tighter"
                  >
                    {showFullDescription ? 'Read Less -' : 'Read More +'}
                  </button>
                )}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col gap-6 pt-8 border-t border-border/30">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                <div className="flex items-center justify-between bg-white rounded-2xl border border-border/50 p-1.5 sm:w-36 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-black text-foreground text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-4 flex-1">
                  <Button size="lg" className="flex-1 bg-[#2A2A2A] hover:bg-[#1A1A1A] text-white shadow-xl shadow-black/10 hover:shadow-black/20 rounded-2xl h-16 text-base font-black uppercase tracking-[0.2em] group/cart overflow-hidden relative border-b-4 border-black/30 active:border-b-0 active:translate-y-1 transition-all" onClick={handleAddToCart}>
                    <ShoppingCart className="w-5 h-5 mr-3 transition-transform group-hover/cart:-translate-y-1 group-hover/cart:translate-x-1" />
                    Add to Collection
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={cn(
                      "flex-shrink-0 w-14 h-14 rounded-2xl transition-all border-border hover:border-primary/50 group/heart bg-white",
                      isWishlisted ? "text-accent border-accent/30 bg-accent/5" : ""
                    )}
                  >
                    <Heart className={cn("w-6 h-6 transition-all", isWishlisted ? "fill-accent stroke-accent" : "group-hover:scale-110")} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust Badges - Improved for Mobile Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pt-8">
              <div className="flex flex-col items-center justify-center p-5 bg-white rounded-3xl border border-border/40 shadow-sm group hover:border-primary/20 transition-colors">
                <Truck className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] text-center">Free Delivery</p>
              </div>
              <div className="flex flex-col items-center justify-center p-5 bg-white rounded-3xl border border-border/40 shadow-sm group hover:border-primary/20 transition-colors">
                <Shield className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] text-center">Certified Quality</p>
              </div>
              <div className="flex flex-col items-center justify-center p-5 bg-white rounded-3xl border border-border/40 shadow-sm group col-span-2 lg:col-span-1 hover:border-primary/20 transition-colors">
                <RotateCcw className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] text-center">Fast Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="py-12 border-t border-border/30 space-y-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Community <span className="gradient-text">Feedback</span>
            </h2>
            <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 p-4 rounded-3xl">
              <div className="flex flex-col items-center pr-4 border-r border-primary/20">
                <span className="text-3xl font-black text-primary">{product.rating}</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />
                  ))}
                </div>
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Based on <br />
                <span className="text-foreground">{product.reviews} verified reviews</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {sampleReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/10 text-xl">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-black text-foreground">{review.user}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-muted-foreground/60 tracking-wider uppercase">{review.date}</span>
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
    </main >
  );
};

export default ProductDetail;