import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartProduct = {
  id: number;
  name: string;
  image: string;
  price: number;
};

export type CartItem = CartProduct & {
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: CartProduct, size: string, quantity?: number) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  removeItem: (id: number, size: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("dar-alnoum-cart");
      if (saved) setItems(JSON.parse(saved) as CartItem[]);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("dar-alnoum-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
    addItem: (product, size, quantity = 1) => setItems((current) => {
      const existing = current.find((item) => item.id === product.id && item.size === size);
      if (existing) {
        return current.map((item) => item === existing
          ? { ...item, quantity: item.quantity + quantity }
          : item);
      }
      return [...current, { ...product, size, quantity }];
    }),
    updateQuantity: (id, size, quantity) => setItems((current) => current
      .map((item) => item.id === id && item.size === size ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0)),
    removeItem: (id, size) => setItems((current) => current.filter((item) => !(item.id === id && item.size === size))),
    clearCart: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}