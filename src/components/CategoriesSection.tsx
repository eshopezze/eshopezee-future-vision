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
  "from-primary to-[hsl(200,100%,50%)]",
  "from-secondary to-[hsl(340,100%,55%)]",
  "from-accent to-[hsl(320,100%,65%)]",
  "from-[hsl(120,70%,45%)] to-primary",
  "from-[hsl(45,100%,50%)] to-[hsl(25,100%,55%)]",
  "from-primary to-accent",
  "from-secondary to-accent",
  "from-[hsl(340,100%,55%)] to-secondary",
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
            <span className="gradient-text">Collections</span>
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
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group glass rounded-3xl p-6 text-center border border-white/5 hover:border-primary/30 cursor-pointer transition-colors relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  {collection.image?.url ? (
                    <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-6 shadow-lg rotate-0 group-hover:rotate-3 transition-transform duration-300">
                      <img
                        src={collection.image.url}
                        alt={collection.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${colorGradient} flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-300`}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  )}

                  <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {collection.title}
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    Explore Collection
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
