import { useNavigate } from "react-router-dom";
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

export const NewArrivals = () => {
    const { addItem } = useCart();
    const navigate = useNavigate();
    const [products, setProducts] = useState<FormattedProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                // In a real app, we might pass a sortKey: 'CREATED_AT' here
                const data = await fetchAllProducts(6);
                setProducts(data.products.reverse()); // Just reversing for visual difference for now
            } catch (error) {
                console.error("Failed to load new arrivals", error);
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
        <section id="new-arrivals" className="py-24 relative bg-background">
            <div className="container mx-auto px-6 sm:px-12 lg:px-20">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                        Fresh Heritage
                    </span>
                    <h2 className="font-heading text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
                        <span className="text-foreground">New</span>{" "}
                        <span className="gradient-text italic">Arrivals</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Check out the latest additions to our collection. Be the first to grab these trendy items.
                    </p>
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
                                <ProductCard
                                    id={product.id}
                                    name={product.name}
                                    handle={product.handle}
                                    price={product.price}
                                    originalPrice={product.originalPrice}
                                    image={product.image}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <div className="mt-12 text-center">
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => navigate('/products')}
                        className="group hover:bg-primary/10"
                    >
                        View All New Arrivals
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};
