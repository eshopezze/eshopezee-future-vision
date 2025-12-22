import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

export const CartSidebar = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart, totalItems, totalPrice, checkoutUrl, loading } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-xl font-bold text-foreground">Your Cart</h2>
            <span className="px-2 py-0.5 bg-primary/20 text-primary text-sm font-medium rounded-full">
              {totalItems}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-foreground mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Looks like you haven't added any items yet.
              </p>
              <Button variant="hero" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.lineId}
                  className="flex gap-4 p-4 glass rounded-xl animate-scale-in"
                >
                  <button
                    onClick={() => {
                      window.location.href = `/product/${item.id.split('/').pop()}`; // Assuming ID needs cleaning if used for local routing, but handle is usually better
                      setIsOpen(false);
                    }}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden text-left"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => {
                        window.location.href = `/product/${item.id.split('/').pop()}`;
                        setIsOpen(false);
                      }}
                      className="font-medium text-left text-foreground hover:text-primary transition-colors line-clamp-2 text-sm"
                    >
                      {item.name}
                    </button>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-primary">₹{item.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 glass rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          disabled={loading}
                          className="p-1.5 hover:text-primary transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          disabled={loading}
                          className="p-1.5 hover:text-primary transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.lineId)}
                        disabled={loading}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
              <span className="font-bold text-foreground">₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-secondary font-medium">FREE</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="font-medium text-foreground">Total</span>
              <span className="font-heading text-2xl font-bold text-primary">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              disabled={loading || !checkoutUrl}
              onClick={() => {
                if (checkoutUrl) window.location.href = checkoutUrl;
              }}
            >
              {loading ? "Processsing..." : "Proceed to Checkout"}
            </Button>
            <button
              onClick={clearCart}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};