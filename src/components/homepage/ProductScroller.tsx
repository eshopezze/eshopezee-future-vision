import { useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { type FormattedProduct } from "@/lib/shopifyClient";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

interface ProductScrollerProps {
    title: string;
    subtitle?: string;
    products: FormattedProduct[];
    loading?: boolean;
    collectionLink?: string;
}

const ProductScroller = ({ title, subtitle, products, loading, collectionLink }: ProductScrollerProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { addItem } = useCart();

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    if (!loading && products.length === 0) return null;

    return (
        <section className="py-12 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                {title}
                            </h2>
                            <div className="h-px w-12 bg-primary/20 mt-1 hidden md:block" />
                        </div>
                        {subtitle && <p className="text-muted-foreground/40 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase pl-1">{subtitle}</p>}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => scroll("left")}
                            className="rounded-full w-10 h-10 bg-white/[0.03] border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => scroll("right")}
                            className="rounded-full w-10 h-10 bg-white/[0.03] border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory px-2"
                >
                    {loading
                        ? Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="min-w-[180px] md:min-w-[260px] aspect-[3/4.2] bg-muted animate-pulse rounded-xl" />
                        ))
                        : products.map((product) => (
                            <motion.div
                                key={product.id}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                                className="min-w-[200px] md:min-w-[260px] bg-white border border-border rounded-xl p-3 hover:shadow-xl hover:border-primary/20 transition-all duration-300 snap-start flex flex-col group relative overflow-hidden shadow-sm"
                            >
                                <Link to={`/product/${product.handle}`} className="block flex-grow">
                                    <div className="aspect-[4/5] overflow-hidden mb-4 rounded-lg bg-gray-50 border border-border group-hover:border-primary/20 transition-all relative">
                                        <img
                                            src={product.image || ""}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />
                                        {/* Dynamic Badges */}
                                        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20">
                                            {product.originalPrice && (
                                                <div className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg uppercase tracking-wider">
                                                    Sale
                                                </div>
                                            )}
                                            {/* Mocking a "New" badge for visual interest */}
                                            {product.id.length % 2 === 0 && (
                                                <div className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg uppercase tracking-wider">
                                                    New
                                                </div>
                                            )}
                                        </div>
                                        {product.originalPrice && (
                                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-red-600 text-[10px] font-black px-2 py-1 rounded border border-red-100 z-20 shadow-sm">
                                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-200 min-h-[2.5rem] leading-tight px-1">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <span className="text-primary font-black text-lg">₹{product.price.toLocaleString("en-IN")}</span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-muted-foreground line-through opacity-60 font-medium">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                                        )}
                                    </div>
                                </Link>
                                <Button
                                    size="sm"
                                    className="w-full h-10 font-black rounded-lg bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 z-20 relative uppercase text-[10px] tracking-widest"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addItem(product.variantId, 1);
                                    }}
                                >
                                    <ShoppingCart className="w-3.5 h-3.5" />
                                    Add to Cart
                                </Button>
                            </motion.div>
                        ))}
                    <Link
                        to={collectionLink || "/products"}
                        className="min-w-[200px] md:min-w-[260px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 group/all bg-white"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover/all:scale-110 transition-all">
                            <ArrowRight className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs font-bold text-primary uppercase tracking-widest group-hover/all:translate-x-1 transition-transform">See All Collections</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProductScroller;
