import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import React from "react";

interface AddToCartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "large" | "compact";
    text?: string;
    showIcon?: boolean;
}

export const AddToCartButton = React.forwardRef<HTMLButtonElement, AddToCartButtonProps>(
    ({ className, variant = "default", text = "Add to Cart", showIcon = true, onClick, ...props }, ref) => {

        const baseStyles = "bg-[#00E676] hover:bg-[#00C853] text-[#0E1412] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 font-black uppercase tracking-[0.2em] relative overflow-hidden border-b-4 border-[#00B248] active:border-b-0 active:translate-y-1 transition-all group/btn z-20";

        const variants = {
            default: "h-12 rounded-2xl text-[10px]",
            large: "h-14 md:h-16 rounded-2xl text-xs tracking-[0.25em] w-full",
            compact: "h-10 rounded-xl text-[10px] w-full",
        };

        return (
            <Button
                ref={ref}
                className={cn(baseStyles, variants[variant], className)}
                onClick={onClick}
                {...props}
            >
                {showIcon && (
                    <ShoppingCart className={cn(
                        "transition-transform duration-500 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1",
                        variant === "compact" ? "w-3.5 h-3.5 mr-2" : "w-4 h-4 mr-2",
                        variant === "large" && "w-5 h-5 mr-3"
                    )} />
                )}
                {text}
            </Button>
        );
    }
);

AddToCartButton.displayName = "AddToCartButton";
