import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, X, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  score?: number;
}

interface SearchResult {
  query: string;
  intent: string;
  suggestions: string[];
  products: Product[];
  keywords: string[];
}

export const SmartSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResult(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('smart-search', {
        body: { query: searchQuery }
      });

      if (error) {
        console.error('Search error:', error);
        if (error.message?.includes('429')) {
          toast.error('Search rate limit exceeded. Please try again in a moment.');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits exhausted. Please add credits to continue.');
        }
        return;
      }

      setResult(data);
    } catch (err) {
      console.error('Search failed:', err);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResult(null);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-primary relative group"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-5 h-5" />
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Search
        </span>
      </Button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Search Panel */}
          <div className="relative w-full max-w-2xl mx-4 glass rounded-2xl border border-primary/20 shadow-[0_0_60px_hsla(175,100%,50%,0.15)] animate-scale-in overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-border/30">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-medium uppercase tracking-wider">AI Search</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try 'something for my morning run' or 'gift for wife'..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
              />
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {result ? (
                <div className="p-4 space-y-6">
                  {/* AI Understanding */}
                  {result.intent && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">I understand you're looking for:</p>
                        <p className="text-foreground font-medium">{result.intent}</p>
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {result.products.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Matching Products
                      </h3>
                      <div className="grid gap-3">
                        {result.products.map((product) => (
                          <a
                            key={product.id}
                            href={`#product-${product.id}`}
                            className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-muted transition-colors group"
                            onClick={handleClose}
                          >
                            <div>
                              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-heading font-bold text-primary">
                                ₹{product.price.toLocaleString()}
                              </p>
                              {product.score && product.score > 20 && (
                                <span className="text-xs text-secondary">Best Match</span>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Products */}
                  {result.products.length === 0 && query.length >= 2 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No products found for "{query}"</p>
                      <p className="text-sm mt-1">Try one of the suggestions below</p>
                    </div>
                  )}

                  {/* AI Suggestions */}
                  {result.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        Try searching for:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : query.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Search using natural language. Our AI understands what you mean!
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "something for gym",
                      "gift under 2000",
                      "work from home setup",
                      "ethnic wear for wedding"
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(example)}
                        className="px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                Powered by AI
              </span>
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
