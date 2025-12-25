import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchPageByHandle, type ShopifyPage } from "@/lib/shopifyClient";
import { Loader2, ChevronLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Page = () => {
    const { handle } = useParams<{ handle: string }>();
    const [page, setPage] = useState<ShopifyPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPage = async () => {
            if (!handle) return;

            setLoading(true);
            setError(null);

            try {
                const pageData = await fetchPageByHandle(handle);

                if (!pageData) {
                    setError('Page not found');
                    return;
                }

                setPage(pageData);
            } catch (err) {
                console.error('Error fetching page:', err);
                setError(err instanceof Error ? err.message : 'Failed to load page');
            } finally {
                setLoading(false);
            }
        };

        loadPage();
    }, [handle]);

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-6 sm:px-12 lg:px-20 py-24 flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground animate-pulse">Loading page...</p>
                </div>
                <Footer />
            </main>
        );
    }

    if (error || !page) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-6 sm:px-12 lg:px-20 py-24 text-center">
                    <div className="max-w-md mx-auto glass rounded-3xl p-8">
                        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            {error || 'Page Not Found'}
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            The page you're looking for doesn't exist or couldn't be loaded.
                        </p>
                        <Link to="/">
                            <Button variant="hero">
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-6 sm:px-12 lg:px-20 py-8 pt-24">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link to="/" className="hover:text-primary transition-colors">
                        <ChevronLeft className="w-4 h-4 inline" /> Back
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">{page.title}</span>
                </div>

                {/* Page Content */}
                <article className="max-w-4xl mx-auto">
                    {/* Title */}
                    <header className="mb-8 pb-8 border-b border-border/30">
                        <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
                            {page.title}
                        </h1>
                        {page.bodySummary && (
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {page.bodySummary}
                            </p>
                        )}
                    </header>

                    {/* Body Content */}
                    <div
                        className="prose prose-invert prose-lg max-w-none
              prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-bold
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground
              prose-li:my-2
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-muted prose-pre:border prose-pre:border-border
              prose-img:rounded-xl prose-img:shadow-lg
              prose-hr:border-border/30"
                        dangerouslySetInnerHTML={{ __html: page.body }}
                    />
                </article>
            </div>

            <Footer />
        </main>
    );
};

export default Page;
