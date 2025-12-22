import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import {
  getShopifyCart,
  createShopifyCart,
  addLinesToCart,
  updateCartLines,
  removeCartLines,
  updateCartBuyerIdentity,
  type ShopifyCart,
  type CartLine
} from "@/lib/shopifyClient";
import { useAuth } from "@/contexts/AuthContext";

export interface CartItem {
  id: string; // Using Shopify's gid
  lineId: string; // Line ID in the cart
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  variantId: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
  checkoutUrl: string | null;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  // Sync buyer identity when user logs in
  useEffect(() => {
    const syncBuyer = async () => {
      if (cart && token && !cart.lines.some(l => l.merchandise.product.handle === 'dummy')) {
        // Note: We only sync if we haven't already or if state changed significantly
        // In a real prod app, you might check if buyerIdentity is already set on the cart object
        try {
          const updatedCart = await updateCartBuyerIdentity(cart.id, token);
          setCart(updatedCart);
        } catch (error) {
          console.error("Buyer identity sync error:", error);
        }
      }
    };
    syncBuyer();
  }, [token, cart?.id]);

  // Initialize cart from localStorage
  useEffect(() => {
    const initCart = async () => {
      const savedCartId = localStorage.getItem("shopify_cart_id");
      if (savedCartId) {
        try {
          const shopifyCart = await getShopifyCart(savedCartId);
          if (shopifyCart) {
            setCart(shopifyCart);
          } else {
            localStorage.removeItem("shopify_cart_id");
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          localStorage.removeItem("shopify_cart_id");
        }
      }
    };
    initCart();
  }, []);

  const syncCart = (newCart: ShopifyCart) => {
    setCart(newCart);
    localStorage.setItem("shopify_cart_id", newCart.id);
  };

  const addItem = async (variantId: string, quantity: number = 1) => {
    setLoading(true);
    try {
      let updatedCart: ShopifyCart;
      if (!cart) {
        updatedCart = await createShopifyCart(variantId, quantity);
        toast.success("Cart created and item added");
      } else {
        updatedCart = await addLinesToCart(cart.id, variantId, quantity);
        toast.success("Item added to cart");
      }
      syncCart(updatedCart);
      setIsOpen(true);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cart) return;
    setLoading(true);
    try {
      const updatedCart = await removeCartLines(cart.id, [lineId]);
      syncCart(updatedCart);
      toast.info("Item removed from cart");
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast.error("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart || quantity < 1) return;
    setLoading(true);
    try {
      const updatedCart = await updateCartLines(cart.id, lineId, quantity);
      syncCart(updatedCart);
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
    localStorage.removeItem("shopify_cart_id");
    toast.info("Cart cleared locally");
  };

  const items: CartItem[] = cart?.lines.map(line => ({
    id: line.merchandise.id,
    lineId: line.id,
    name: line.merchandise.product.title,
    price: parseFloat(line.merchandise.price.amount),
    originalPrice: line.merchandise.compareAtPrice ? parseFloat(line.merchandise.compareAtPrice.amount) : parseFloat(line.merchandise.price.amount),
    image: line.merchandise.product.featuredImage?.url || "",
    quantity: line.quantity,
    variantId: line.merchandise.id,
  })) || [];

  const totalItems = cart?.totalQuantity || 0;
  const totalPrice = parseFloat(cart?.cost.totalAmount.amount || "0");

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        totalItems,
        totalPrice,
        checkoutUrl: cart?.checkoutUrl || null,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
