import { Shirt, Watch, Headphones, Gem, Home, Dumbbell, Smartphone, Gift } from "lucide-react";

const categories = [
  { name: "Fashion", icon: Shirt, count: 1250, color: "from-primary to-[hsl(200,100%,50%)]" },
  { name: "Watches", icon: Watch, count: 340, color: "from-secondary to-[hsl(340,100%,55%)]" },
  { name: "Electronics", icon: Headphones, count: 890, color: "from-accent to-[hsl(320,100%,65%)]" },
  { name: "Jewelry", icon: Gem, count: 520, color: "from-[hsl(45,100%,50%)] to-[hsl(25,100%,55%)]" },
  { name: "Home Decor", icon: Home, count: 670, color: "from-primary to-accent" },
  { name: "Fitness", icon: Dumbbell, count: 230, color: "from-[hsl(120,70%,45%)] to-primary" },
  { name: "Gadgets", icon: Smartphone, count: 450, color: "from-secondary to-accent" },
  { name: "Gifts", icon: Gift, count: 180, color: "from-[hsl(340,100%,55%)] to-secondary" },
];

export const CategoriesSection = () => {
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

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <a
              key={category.name}
              href={`#${category.name.toLowerCase()}`}
              className="group glass rounded-2xl p-6 text-center hover-lift border border-transparent hover:border-primary/30 cursor-pointer"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                <category.icon className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.count.toLocaleString()} items
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
