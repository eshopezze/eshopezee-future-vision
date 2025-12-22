import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, X, Loader2, TrendingUp, Package, LayoutGrid, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { searchProductsAndCollections, type FormattedProduct, type CollectionInfo } from "@/lib/shopifyClient";
import { cn } from "@/lib/utils";

interface SearchResult {
  products: FormattedProduct[];
  collections: CollectionInfo[];
}

export const SmartSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResult(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query.trim());
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const data = await searchProductsAndCollections(searchQuery);
      setResult(data);
    } catch (err) {
      console.error('Search failed:', err);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResult(null);
  };

  const handleLinkClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-primary relative group shrink-0"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-5 h-5" />
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
          Search
        </span>
      </Button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:px-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/90 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={handleClose}
          />

          {/* Search Panel */}
          <div className="relative w-full max-w-2xl bg-background border border-primary/20 shadow-[0_0_80px_rgba(0,0,0,0.5),0_0_40px_hsla(175,100%,50%,0.1)] rounded-3xl animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Search Input Area */}
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products or collections..."
                  className="w-full bg-transparent border-none outline-none text-xl font-heading tracking-tight text-foreground placeholder:text-muted-foreground/50"
                  onKeyDown={(e) => e.key === 'Escape' && handleClose()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="hover:bg-primary/10 hover:text-primary rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Results Display */}
            <div className="max-h-[65vh] overflow-y-auto custom-scrollbar bg-black/20">
              {result ? (
                <div className="p-2 space-y-2">
                  {/* Collections Section - Visual Cards */}
                  {result.collections.length > 0 && (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4 px-2">
                        <LayoutGrid className="w-4 h-4 text-primary" />
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Found Collections</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result.collections.map((collection) => (
                          <button
                            key={collection.id}
                            onClick={() => handleLinkClick(`/collection/${collection.handle}`)}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 shrink-0 border border-white/10 group-hover:border-primary/20">
                              {collection.image?.url ? (
                                <img src={collection.image.url} alt={collection.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                                  {collection.title.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-heading text-sm font-semibold truncate group-hover:text-primary transition-colors">{collection.title}</p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Explore Collection</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products Section - Detailed Rows at the bottom */}
                  {result.products.length > 0 ? (
                    <div className="p-4 bg-white/[0.02] border-t border-white/5">
                      <div className="flex items-center gap-2 mb-4 px-2">
                        <Package className="w-4 h-4 text-secondary" />
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Product Results</h3>
                      </div>
                      <div className="space-y-2">
                        {result.products.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleLinkClick(`/product/${product.handle}`)}
                            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 shrink-0 border border-white/10 group-hover:border-primary/20">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="text-left min-w-0">
                                <p className="font-heading text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">₹{product.price.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                            <div className="shrink-0 ml-4 hidden sm:block">
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">VIEW DETAIL</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : query.length >= 2 && !isLoading && (
                    <div className="p-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-muted-foreground">No products found for "{query}"</p>
                      <button
                        onClick={() => setQuery("")}
                        className="mt-2 text-primary font-bold text-sm hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              ) : !isLoading && query.length === 0 && (
                <div className="p-12 text-center">
                  <Sparkles className="w-10 h-10 text-primary/40 mx-auto mb-4" />
                  <h4 className="font-heading text-lg font-bold mb-2">Smart AI Search</h4>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                    Enter a keyword to search for products and collections across the marketplace.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Trends", "Summer", "Sale", "Tech"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State Overlay */}
              {isLoading && !result && (
                <div className="p-20 text-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                  <p className="font-heading text-sm animate-pulse tracking-widest text-primary font-bold">ANALYZING STORE DATA...</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">ESC</kbd> to close</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Powered by AI Search</span>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
