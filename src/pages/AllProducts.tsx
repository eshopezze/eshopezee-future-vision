import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Heart, ShoppingCart, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { fetchAllProducts, type PageInfo } from "@/lib/shopifyClient";
import { toast } from "sonner";
import { AddToCartButton } from "@/components/ui/AddToCartButton";

interface Product {
    id: string;
    name: string;
    handle: string;
    price: number;
    originalPrice: number | null;
    image: string;
    rating: number;
    reviews: number;
}

const AllProducts = () => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
    const [cursorStack, setCursorStack] = useState<string[]>([]);
    const [currentCursor, setCurrentCursor] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchAllProducts(12, currentCursor);
                setProducts(data.products);
                setPageInfo(data.pageInfo);
            } catch (err) {
                console.error("Error fetching all products:", err);
                setError(err instanceof Error ? err.message : "Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentCursor]);

    const handleNextPage = () => {
        if (pageInfo?.hasNextPage && pageInfo.endCursor) {
            setCursorStack((prev) => [...prev, currentCursor as string]);
            setCurrentCursor(pageInfo.endCursor);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevPage = () => {
        if (cursorStack.length > 0) {
            const newStack = [...cursorStack];
            const prevCursor = newStack.pop() || null;
            setCursorStack(newStack);
            setCurrentCursor(prevCursor);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };



    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-6 sm:px-12 lg:px-20">
                    {/* Breadcrumb */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    {/* Page Header */}
                    <div className="mb-12">
                        <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                            <span className="gradient-text">All Products</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Explore our complete collection of premium products
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground animate-pulse">Fetching products...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-20 glass rounded-3xl border border-destructive/20">
                            <p className="text-destructive font-semibold mb-4">{error}</p>
                            <Button onClick={() => window.location.reload()}>Try Again</Button>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && !error && (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => navigate(`/product/${product.handle}`)}
                                            className="group bg-card rounded-[2.5rem] overflow-hidden border border-border/50 hover:border-primary/50 block cursor-pointer h-full flex flex-col shadow-sm hover:shadow-neon transition-all duration-700 relative"
                                        >
                                            {/* Image Container */}
                                            <div className="relative aspect-square overflow-hidden bg-muted">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        No Image
                                                    </div>
                                                )}

                                                {/* Sale Tag */}
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                        Sale
                                                    </span>
                                                )}

                                                {/* Quick Add Overlay */}
                                                <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 hidden md:block" onClick={(e) => e.stopPropagation()}>
                                                    <AddToCartButton
                                                        variant="compact"
                                                        text="Quick Add"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            addItem(product.id, 1);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex flex-col flex-grow text-center">
                                                <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors text-sm md:text-base">
                                                    {product.name}
                                                </h3>

                                                <div className="flex items-center justify-center gap-2 mt-auto">
                                                    <span className="font-heading text-xl font-black text-primary tracking-tighter">
                                                        ₹{product.price.toLocaleString()}
                                                    </span>
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <span className="text-xs text-muted-foreground line-through">
                                                            ₹{product.originalPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20">
                                        <p className="text-muted-foreground text-lg mb-4">No products found.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {products.length > 0 && pageInfo && (
                                <div className="flex items-center justify-center gap-4 py-8 border-t border-border/50">
                                    <Button
                                        variant="outline"
                                        onClick={handlePrevPage}
                                        disabled={cursorStack.length === 0}
                                        className="gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </Button>
                                    <div className="text-sm text-muted-foreground">
                                        Page {cursorStack.length + 1}
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleNextPage}
                                        disabled={!pageInfo.hasNextPage}
                                        className="gap-2"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AllProducts;
