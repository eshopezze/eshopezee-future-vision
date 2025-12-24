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
            className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 h-full flex flex-col hover:border-white/10 transition-colors duration-500 group relative overflow-hidden"
        >
            <h3 className="font-heading font-semibold text-sm mb-4 text-foreground/90 flex items-center gap-2">
                <span className="w-1 h-3 bg-primary/30 rounded-full" />
                {title}
            </h3>

            <div className="grid grid-cols-2 gap-3 flex-grow pb-4">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        to={`/product/${product.handle}`}
                        className="group/item block"
                    >
                        <div className="aspect-square overflow-hidden bg-white/[0.03] mb-2 rounded-lg border border-white/5 group-hover/item:border-primary/20 transition-all duration-500">
                            <img
                                src={product.image || ""}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>
                        <p className="text-[9px] font-medium text-muted-foreground/50 truncate group-hover/item:text-primary transition-colors duration-300 uppercase tracking-wide">
                            {product.name}
                        </p>
                    </Link>
                ))}
            </div>

            <Link
                to={`/collection/${collectionHandle}`}
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary/70 hover:text-primary transition-all duration-300 group/link"
            >
                <span className="uppercase tracking-[0.15em]">Explore</span>
                <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
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
        <section className="py-12 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
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
