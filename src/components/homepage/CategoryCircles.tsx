import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllCollections, type CollectionInfo } from "@/lib/shopifyClient";
import { motion } from "framer-motion";

export const CategoryCircles = () => {
    const [collections, setCollections] = useState<CollectionInfo[]>([]);

    useEffect(() => {
        const loadCollections = async () => {
            try {
                const data = await fetchAllCollections();
                console.log(data);
                setCollections(data.slice(0, 5)); // Top 5 for the circle row
            } catch (error) {
                console.error("Failed to load collections:", error);
            }
        };
        loadCollections();
    }, []);

    if (collections.length === 0) return null;

    return (
        <section className="bg-background border-b border-white/5 py-10 overflow-x-auto scrollbar-hide relative z-20">
            <div className="container mx-auto px-6">
                <div className="flex justify-start md:justify-center items-center gap-10 md:gap-20 min-w-max">
                    {collections.map((collection) => (
                        <Link
                            key={collection.id}
                            to={`/collection/${collection.handle}`}
                            className="group flex flex-col items-center gap-5 transition-all duration-500"
                        >
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden bg-white/[0.02] flex items-center justify-center border border-white/10 group-hover:border-primary/30 group-hover:shadow-[0_20px_40px_hsla(0,0%,0%,0.4)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative shadow-lg"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {collection.image?.url ? (
                                    <img
                                        src={collection.image.url}
                                        alt={collection.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[0.2] group-hover:grayscale-0"
                                    />
                                ) : (
                                    <span className="text-muted-foreground/20 font-light text-4xl group-hover:text-primary transition-colors duration-700">{collection.title[0]}</span>
                                )}
                            </motion.div>
                            <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground/50 group-hover:text-foreground transition-all duration-500 uppercase tracking-[0.25em] font-heading antialiased text-center max-w-[100px] line-clamp-1">
                                {collection.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
