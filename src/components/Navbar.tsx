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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-primary/10 shadow-sm shadow-primary/5 transition-all duration-300">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-8 lg:px-12 relative z-50">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 transition-transform active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-heading font-black text-white text-xl shadow-lg shadow-primary/20 group-hover:shadow-clay group-hover:scale-105 transition-all duration-500">
              E
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-heading font-black text-xl tracking-tight text-foreground uppercase">
                ESHOP<span className="text-primary">EZEE</span>
              </span>
              <span className="text-[7.5px] font-black text-primary tracking-[0.3em] uppercase hidden sm:block">Privilege Edition</span>
            </div>
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
                    <ul className="grid w-[600px] gap-3 p-4 md:w-[700px] md:grid-cols-3 lg:w-[850px] bg-white border border-border rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
                      {collections.length > 0 ? (
                        collections.map((collection) => (
                          <li key={collection.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/collection/${collection.handle}`}
                                className={cn(
                                  "flex items-start gap-3 select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted group/item h-full",
                                  isActive(`/collection/${collection.handle}`) && "bg-muted font-medium border-l-2 border-primary"
                                )}
                              >
                                {collection.image?.url ? (
                                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border border-border group-hover/item:border-primary/30 transition-colors">
                                    <img
                                      src={collection.image.url}
                                      alt={collection.image.altText || collection.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                                    <span className="text-muted-foreground font-bold text-xs">{collection.title.charAt(0)}</span>
                                  </div>
                                )}
                                <div className="flex flex-col gap-1">
                                  <div className="text-sm font-semibold leading-none group-hover/item:text-primary transition-colors">{collection.title}</div>
                                  <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                                    Explore {collection.title}
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
                <Button variant="ghost" size="icon" className="w-11 h-11 text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-white/5 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 capitalize">
                    {user.firstName[0]}
                  </div>
                </Button>
                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="w-56 glass rounded-[1.5rem] p-3 shadow-2xl border-white/5">
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-xs font-bold text-foreground truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-muted-foreground/60 truncate uppercase tracking-tighter">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl text-xs font-medium text-foreground hover:bg-primary/10 transition-colors flex items-center gap-3"
                    >
                      <User className="w-4 h-4 text-primary" />
                      My Account
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex w-11 h-11 text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-white/5 rounded-2xl"
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
          "lg:hidden fixed inset-0 z-40 bg-[#FAF8F4] transition-all duration-500 ease-in-out pt-24 pb-8 px-6 h-[100dvh] overflow-hidden flex flex-col",
          isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
        )}>
          <div className="flex flex-col h-full space-y-8 relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -ml-32 -mt-32" />
            <div className="space-y-6 flex-1 relative z-10">
              <div className="flex items-center justify-between px-2">
                <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Shop by Category</p>
                <div className="h-[2px] w-12 bg-primary/20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    to={`/collection/${collection.handle}`}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-xl glass border border-transparent transition-all",
                      isActive(`/collection/${collection.handle}`) ? "border-primary/50 text-primary bg-primary/5 ring-1 ring-primary/20" : "hover:border-primary/30"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {collection.image?.url ? (
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-primary/10 shrink-0">
                        <img src={collection.image.url} alt={collection.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                        <span className="text-primary font-bold text-xs">{collection.title.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-xs font-semibold truncate line-clamp-1">{collection.title}</span>
                  </Link>
                ))}
              </div>
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
                    "p-3 rounded-xl glass border border-transparent transition-all",
                    isActive(link.href) ? "border-primary/50 text-primary bg-primary/5 ring-1 ring-primary/20" : "hover:border-primary/30"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-semibold text-xs">{link.name}</span>
                </Link>
              ))}
              {user ? (
                <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl border border-primary/20 capitalize shadow-clay">
                      {user.firstName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-foreground truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-muted-foreground truncate font-bold uppercase tracking-widest">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white h-10 rounded-xl"
                      onClick={() => {
                        navigate("/profile");
                        setIsOpen(false);
                      }}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-destructive border-destructive/20 hover:bg-destructive/10 h-10 rounded-xl"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
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
    </nav>
  );
}