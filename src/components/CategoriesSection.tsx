import { Home, ChefHat, Bath, Dumbbell, Lightbulb, Sparkles, Tag, ShoppingBag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ShopifyCollection {
  id: number;
  title: string;
  handle: string;
  image: string | null;
  productsCount: number;
}

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

export const CategoriesSection = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('shopify-collections');
        
        if (error) {
          console.error('Error fetching collections:', error);
          setError('Failed to load collections');
          return;
        }
        
        if (data?.collections) {
          setCollections(data.collections);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load collections');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <section id="categories" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-secondary/10 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Browse By Category
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Explore Our</span>{" "}
            <span className="gradient-text">Collections</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover products across various categories tailored to your lifestyle and preferences.
          </p>
        </div>

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {collections.map((collection, index) => {
              const IconComponent = getIconForCollection(collection.title);
              const colorGradient = colorGradients[index % colorGradients.length];
              
              return (
                <a
                  key={collection.id}
                  href={`#${collection.handle}`}
                  className="group glass rounded-2xl p-6 text-center hover-lift border border-transparent hover:border-primary/30 cursor-pointer"
                >
                  {collection.image ? (
                    <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <img 
                        src={collection.image} 
                        alt={collection.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${colorGradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-foreground" />
                    </div>
                  )}
                  <h3 className="font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {collection.productsCount > 0 ? `${collection.productsCount} items` : 'View collection'}
                  </p>
                </a>
              );
            })}
          </div>
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
