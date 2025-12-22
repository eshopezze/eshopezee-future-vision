import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SmartSearch } from "@/components/SmartSearch";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchAllCollections, type CollectionInfo } from "@/lib/shopifyClient";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const staticLinks = [
  { name: "All Products", href: "/products" },
  { name: "Trending", href: "/collection/trending-product" },
  { name: "On Sale", href: "/collection/on-sale-products" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setIsOpen: setCartOpen, totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchAllCollections();
        setCollections(data);
      } catch (error) {
        console.error("Failed to load collections:", error);
      }
    };
    loadCollections();
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20 px-6 sm:px-12 lg:px-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-heading font-bold text-primary-foreground text-base sm:text-lg group-hover:shadow-[0_0_20px_hsla(175,100%,50%,0.5)] transition-shadow duration-300">
              E
            </div>
            <span className="font-heading font-bold text-base sm:text-xl tracking-wider hidden xs:inline-block truncate">
              <span className="text-primary leading-none">ESHOP</span>
              <span className="text-secondary hidden sm:inline ml-1">EZEE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Categories Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(
                    "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent text-muted-foreground hover:text-primary transition-colors",
                    pathname.startsWith("/collection") && "text-primary"
                  )}>
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-4 md:w-[700px] md:grid-cols-3 lg:w-[850px] glass border-border/30 animate-in fade-in zoom-in-95 duration-200">
                      {collections.length > 0 ? (
                        collections.map((collection) => (
                          <li key={collection.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/collection/${collection.handle}`}
                                className={cn(
                                  "flex items-start gap-3 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary h-full",
                                  isActive(`/collection/${collection.handle}`) && "bg-primary/10 text-primary border-l-2 border-primary"
                                )}
                              >
                                {collection.image?.url ? (
                                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-primary/20">
                                    <img
                                      src={collection.image.url}
                                      alt={collection.image.altText || collection.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                    <span className="text-primary font-bold text-xs">{collection.title.charAt(0)}</span>
                                  </div>
                                )}
                                <div className="flex flex-col gap-1">
                                  <div className="text-sm font-semibold leading-none">{collection.title}</div>
                                  <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                                    Collections for {collection.title}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-muted-foreground col-span-3 text-center">Loading categories...</div>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {staticLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <Link
                      to={link.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-transparent focus:bg-transparent text-muted-foreground hover:text-primary transition-all duration-300",
                        isActive(link.href) && "text-primary font-bold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full"
                      )}
                    >
                      {link.name}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <SmartSearch />
            {user ? (
              <div className="relative group hidden sm:block">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-transform hover:scale-110">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 capitalize">
                    {user.firstName[0]}
                  </div>
                </Button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="w-48 glass rounded-2xl p-2 animate-in slide-in-from-top-1">
                    <div className="px-3 py-2 border-b border-border/30 mb-1">
                      <p className="text-xs font-bold text-foreground truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-primary/10 transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-muted-foreground hover:text-primary transition-transform hover:scale-110"
                onClick={() => navigate("/login")}
              >
                <User className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary relative transition-transform hover:scale-110"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-bold animate-bounce shadow-lg ring-2 ring-background">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={cn(
          "lg:hidden transition-all duration-500 ease-in-out glass-strong backdrop-blur-2xl border-t border-primary/10 overflow-y-auto scrollbar-hide",
          isOpen ? "max-h-screen py-8 opacity-100 translate-y-0" : "max-h-0 py-0 opacity-0 -translate-y-4"
        )}>
          <div className="flex flex-col gap-10 px-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Shop by Category</p>
                <div className="h-[2px] w-12 bg-primary/20 rounded-full" />
              </div>
              <div className="grid grid-cols-1 gap-2 px-2">
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    to={`/collection/${collection.handle}`}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-2xl glass border border-transparent transition-all",
                      isActive(`/collection/${collection.handle}`) ? "border-primary/50 text-primary bg-primary/5 ring-1 ring-primary/20" : "hover:border-primary/30"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {collection.image?.url ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-primary/10">
                        <img src={collection.image.url} alt={collection.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                        <span className="text-primary font-bold">{collection.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{collection.title}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">Explore latest inventory</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4 px-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">Quick Links</p>
              <div className="flex flex-col gap-2">
                {staticLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "p-4 rounded-2xl glass border border-transparent transition-all",
                      isActive(link.href) ? "border-primary/50 text-primary bg-primary/5 ring-1 ring-primary/20" : "hover:border-primary/30"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-semibold">{link.name}</span>
                  </Link>
                ))}
                {user ? (
                  <div className="p-4 rounded-2xl glass border border-primary/10 bg-primary/5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border border-primary/20 capitalize">
                        {user.firstName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      Log Out
                    </Button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className={cn(
                      "p-4 rounded-2xl glass border border-transparent transition-all flex items-center gap-3",
                      isActive("/login") ? "border-primary/50 text-primary bg-primary/5" : "hover:border-primary/30"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-semibold">Log In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}