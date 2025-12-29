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
            className="bg-white p-5 rounded-xl border border-border shadow-sm flex flex-col hover:shadow-lg hover:border-primary/20 transition-all duration-300 group relative overflow-hidden h-full"
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
