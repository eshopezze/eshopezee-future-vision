import { Link } from "react-router-dom";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
    id: string;
    name: string;
    handle: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    rating?: number;
    reviews?: number;
    priority?: boolean;
}

export const ProductCard = ({ id, name, handle, price, originalPrice, image, priority = false }: ProductCardProps) => {
    const { addItem } = useCart();
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <div className="group bg-card rounded-2xl p-4 border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-neon transition-all duration-300 flex flex-col h-full relative">
            {/* Image Container */}
            <Link to={`/product/${handle}`} className="block relative aspect-square overflow-hidden rounded-xl bg-muted mb-4">
                <img
                    src={image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading={priority ? "eager" : "lazy"}
                />

                {/* Badges - Top Left */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {discount > 0 && (
                        <span className="bg-[#FF3B30] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                            SALE
                        </span>
                    )}
                    {/* Logic for NEW badge can be added here based on product creation date or a prop */}
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                        NEW
                    </span>
                </div>

                {/* Discount Badge - Bottom Right */}
                {discount > 0 && (
                    <div className="absolute bottom-3 right-3 bg-white text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        -{discount}%
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                <Link to={`/product/${handle}`}>
                    <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors text-left leading-tight min-h-[2.5rem]">
                        {name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4 mt-auto">
                    <span className="text-primary font-bold text-lg md:text-xl">
                        ₹{price.toLocaleString('en-IN')}
                    </span>
                    {originalPrice && originalPrice > price && (
                        <span className="text-muted-foreground line-through text-xs md:text-sm">
                            ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                {/* Add To Cart Button - Full Width, Static */}
                <AddToCartButton
                    variant="compact"
                    className="w-full rounded-full font-bold uppercase tracking-wide text-xs h-10 shadow-none hover:shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    text="Add to Cart"
                    showIcon={true}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem(id, 1);
                    }}
                />
            </div>
        </div>
    );
};
