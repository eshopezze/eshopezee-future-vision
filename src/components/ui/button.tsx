import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_hsla(175,100%,50%,0.4)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_20px_hsla(175,100%,50%,0.2)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-[0_0_30px_hsla(25,100%,55%,0.4)]",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-to-r from-primary to-[hsl(200,100%,50%)] text-primary-foreground font-bold uppercase tracking-wider hover:shadow-[0_0_40px_hsla(175,100%,50%,0.5)] hover:-translate-y-1",
        heroOutline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-[0_0_30px_hsla(175,100%,50%,0.3)] font-bold uppercase tracking-wider hover:-translate-y-1",
        glow: "bg-primary text-primary-foreground animate-glow-pulse hover:shadow-[0_0_50px_hsla(175,100%,50%,0.6)]",
        glass: "bg-card/40 backdrop-blur-xl border border-border/50 text-foreground hover:bg-card/60 hover:border-primary/50",
        neonOrange: "bg-gradient-to-r from-secondary to-[hsl(340,100%,55%)] text-secondary-foreground font-bold hover:shadow-[0_0_40px_hsla(25,100%,55%,0.5)] hover:-translate-y-1",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
