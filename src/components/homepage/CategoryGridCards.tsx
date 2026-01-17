import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllCollections, type CollectionInfo, fetchCollectionProducts, type FormattedProduct } from "@/lib/shopifyClient";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface GridCardProps {
    title: string;
    collectionHandle: string;
}

const CategoryGridCard = ({ title, collectionHandle }: GridCardProps) => {
    const [products, setProducts] = useState<FormattedProduct[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchCollectionProducts(collectionHandle);
                setProducts(data.products.slice(0, 4));
            } catch (error) {
                console.error(`Failed to load products for ${collectionHandle}:`, error);
            }
        };
        loadProducts();
    }, [collectionHandle]);

    if (products.length < 4) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card p-5 rounded-xl border border-border/50 shadow-sm flex flex-col hover:shadow-neon hover:border-primary/50 transition-all duration-300 group relative overflow-hidden h-full"
        >
            <h3 className="font-heading font-bold text-base mb-5 text-foreground flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full" />
                {title}
            </h3>

            <div className="grid grid-cols-2 gap-4 flex-grow pb-5">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        to={`/product/${product.handle}`}
                        className="group/item block"
                    >
                        <div className="aspect-square overflow-hidden bg-gray-50 mb-2.5 rounded-lg border border-border group-hover/item:border-primary/20 transition-all duration-300 shadow-sm">
                            <img
                                src={product.image || ""}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500 ease-in-out"
                            />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground/80 truncate group-hover/item:text-primary transition-colors duration-200 uppercase tracking-tighter">
                            {product.name}
                        </p>
                    </Link>
                ))}
            </div>

            <Link
                to={`/collection/${collectionHandle}`}
                className="mt-auto pt-3 border-t border-border flex items-center justify-between group/link hover:text-primary transition-colors duration-200"
            >
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover/link:text-primary transition-colors">See all</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/link:text-primary group-hover/link:translate-x-1 transition-all duration-300" />
            </Link>
        </motion.div>
    );
};

export const CategoryGridCards = () => {
    const [collections, setCollections] = useState<CollectionInfo[]>([]);

    useEffect(() => {
        const loadCollections = async () => {
            try {
                const data = await fetchAllCollections();
                setCollections(data.slice(0, 5));
            } catch (error) {
                console.error("Failed to load collections for grid cards:", error);
            }
        };
        loadCollections();
    }, []);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -ml-20 -mt-20" />

            <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground">
                            Shop by <span className="text-primary">Category</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Explore our curated collections of premium essentials.
                        </p>
                    </div>
                    <button className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                        View All Categories
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {collections.map((col) => (
                        <CategoryGridCard
                            key={col.id}
                            title={col.title}
                            collectionHandle={col.handle}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
