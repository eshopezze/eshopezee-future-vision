import { Home, ChefHat, Bath, Dumbbell, Lightbulb, Sparkles, Tag, ShoppingBag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCollections, type CollectionInfo } from "@/lib/shopifyClient";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  kitchen: ChefHat,
  bathroom: Bath,
  fitness: Dumbbell,
  lighting: Lightbulb,
  personal: Sparkles,
  sale: Tag,
  trending: ShoppingBag,
};

const colorGradients = [
  "from-primary to-accent",
  "from-accent to-primary",
  "from-primary/80 to-accent/80",
  "from-primary/60 to-accent/60",
  "from-primary/40 to-accent/40",
  "from-primary/20 to-accent/20",
];

const getIconForCollection = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('home')) return Home;
  if (lowerTitle.includes('kitchen')) return ChefHat;
  if (lowerTitle.includes('bath')) return Bath;
  if (lowerTitle.includes('fitness') || lowerTitle.includes('gym')) return Dumbbell;
  if (lowerTitle.includes('light')) return Lightbulb;
  if (lowerTitle.includes('personal') || lowerTitle.includes('care')) return Sparkles;
  if (lowerTitle.includes('sale') || lowerTitle.includes('discount')) return Tag;
  return ShoppingBag;
};

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

export const CategoriesSection = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await fetchAllCollections();
        setCollections(data);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Failed to load collections');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <section id="categories" className="py-24 relative overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-secondary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4 block">
            Browse By Category
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Explore Our</span>{" "}
            <span className="gradient-text">Catalogue</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover products across various categories tailored to your lifestyle and preferences.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Collections Grid */}
        {!loading && !error && collections.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {collections.map((collection, index) => {
              const IconComponent = getIconForCollection(collection.title);
              const colorGradient = colorGradients[index % colorGradients.length];

              return (
                <motion.div
                  key={collection.id}
                  variants={item}
                  onClick={() => navigate(`/collection/${collection.handle}`)}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group bg-white rounded-[2.5rem] p-8 text-center border border-border/50 hover:border-primary/30 cursor-pointer transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-primary/10"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700`} />

                  {collection.image?.url ? (
                    <div className="w-24 h-24 mx-auto rounded-[2rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-primary/20 rotate-0 group-hover:rotate-3 transition-all duration-500">
                      <img
                        src={collection.image.url}
                        alt={collection.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-24 h-24 mx-auto rounded-[2rem] bg-gradient-to-br ${colorGradient} flex items-center justify-center mb-8 shadow-sm group-hover:shadow-primary/20 group-hover:rotate-6 transition-all duration-500`}
                    >
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                  )}

                  <h3 className="font-heading font-black text-xl text-foreground mb-3 group-hover:text-primary transition-colors tracking-tighter">
                    {collection.title}
                  </h3>
                  <div className="inline-block px-4 py-2 rounded-full bg-primary/5 text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover:bg-primary/20 transition-all">
                    Discover More
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && collections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No collections found</p>
          </div>
        )}
      </div>
    </section>
  );
};
