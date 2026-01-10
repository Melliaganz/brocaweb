import { createContext, useState, useEffect, useMemo } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cart");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (article, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === article._id);
      const currentQtyInCart = existing ? existing.quantity : 0;
      const newTotalQty = currentQtyInCart + quantity;
      
      // On s'assure de ne pas dépasser le stock réel
      const finalQty = Math.min(newTotalQty, article.quantite);

      if (existing) {
        return prev.map((item) =>
          item._id === article._id ? { ...item, quantity: finalQty } : item
        );
      }
      return [...prev, { ...article, quantity: finalQty }];
    });
  };

  const updateQuantity = (articleId, newQty, stockMax) => {
    if (newQty <= 0) {
      removeFromCart(articleId);
      return;
    }
    const finalQty = Math.min(newQty, stockMax);
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === articleId ? { ...item, quantity: finalQty } : item
      )
    );
  };

  const removeFromCart = (articleId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== articleId));
  };

  const clearCart = () => setCartItems([]);

  // Calculs automatiques pour faciliter l'affichage
  const cartCount = useMemo(() => 
    cartItems.reduce((acc, item) => acc + item.quantity, 0), 
  [cartItems]);

  const cartTotal = useMemo(() => 
    cartItems.reduce((acc, item) => acc + (item.prix * item.quantity), 0), 
  [cartItems]);

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        setCartItems,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
