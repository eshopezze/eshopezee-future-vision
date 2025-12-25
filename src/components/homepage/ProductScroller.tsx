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
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory px-2"
                >
                    {loading
                        ? Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="min-w-[180px] md:min-w-[220px] aspect-[3/4] bg-white/[0.02] animate-pulse rounded-2xl" />
                        ))
                        : products.map((product) => (
                            <motion.div
                                key={product.id}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                className="min-w-[180px] md:min-w-[220px] bg-white/[0.02] border border-white/5 rounded-2xl p-3 hover:border-white/10 transition-all duration-500 snap-start flex flex-col group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <Link to={`/product/${product.handle}`} className="block flex-grow">
                                    <div className="aspect-square overflow-hidden mb-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-primary/10 transition-all duration-700 relative shadow-inner">
                                        <img
                                            src={product.image || ""}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                        />
                                        {product.originalPrice && (
                                            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-md border border-white/10 text-primary text-[8px] font-bold px-2 py-1 rounded-full z-20 shadow-lg uppercase tracking-wider">
                                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xs md:text-sm font-semibold text-foreground/90 line-clamp-2 mb-2 px-1 group-hover:text-primary transition-colors duration-300 h-9 leading-tight">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <span className="text-foreground font-bold text-base">₹{product.price.toLocaleString("en-IN")}</span>
                                        {product.originalPrice && (
                                            <span className="text-[10px] text-muted-foreground/30 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                                        )}
                                    </div>
                                </Link>
                                <Button
                                    size="sm"
                                    className="w-full h-9 font-bold rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_hsla(175,100%,50%,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group/btn z-20 relative"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addItem(product.variantId, 1);
                                    }}
                                >
                                    <ShoppingCart className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:scale-110" />
                                    <span className="uppercase tracking-[0.15em] text-[9px]">Add</span>
                                </Button>
                            </motion.div>
                        ))}
                    <Link
                        to={collectionLink || "/products"}
                        className="min-w-[180px] md:min-w-[220px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-500 group/all"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-3 group-hover/all:scale-110 transition-transform">
                            <ArrowRight className="w-5 h-5 text-primary/50 group-hover/all:text-primary transition-colors" />
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.2em] group-hover/all:text-primary transition-colors">See All</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProductScroller;
