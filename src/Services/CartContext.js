import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Charger depuis localStorage si dispo
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (article, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === article._id);
      if (existing) {
        return prev.map((item) =>
          item._id === article._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...article, quantity }];
    });
  };

  const removeFromCart = (articleId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== articleId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
