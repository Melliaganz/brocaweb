import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "./AuthContext"; 
import { getCart, addToServerCart, removeFromServerCart, clearServerCart } from "./api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartFromServer();
    } else {
      const stored = sessionStorage.getItem("cart");
      try {
        setCartItems(stored ? JSON.parse(stored) : []);
      } catch (e) {
        setCartItems([]);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const fetchCartFromServer = async () => {
    try {
      const data = await getCart();
      const formattedItems = data.items.map(item => ({
        ...item.article,
        quantity: item.quantite
      }));
      setCartItems(formattedItems);
    } catch (err) {
      console.error("Erreur récupération panier serveur", err);
    }
  };

  const addToCart = async (article, quantity = 1) => {
    const existing = cartItems.find((item) => item._id === article._id);
    const currentQtyInCart = existing ? existing.quantity : 0;
    const finalQty = Math.min(currentQtyInCart + quantity, article.stock || article.quantite);

    if (isAuthenticated) {
      try {
        await addToServerCart(article._id, finalQty);
        fetchCartFromServer(); 
      } catch (err) {
        console.error("Erreur sync serveur", err);
      }
    } else {
      setCartItems((prev) => {
        if (existing) {
          return prev.map((item) =>
            item._id === article._id ? { ...item, quantity: finalQty } : item
          );
        }
        return [...prev, { ...article, quantity: finalQty }];
      });
    }
  };

  const updateQuantity = async (articleId, newQty, stockMax) => {
    if (newQty <= 0) {
      removeFromCart(articleId);
      return;
    }
    const finalQty = Math.min(newQty, stockMax);

    if (isAuthenticated) {
      try {
        await addToServerCart(articleId, finalQty);
        fetchCartFromServer();
      } catch (err) {
        console.error("Erreur update serveur", err);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === articleId ? { ...item, quantity: finalQty } : item
        )
      );
    }
  };

  const removeFromCart = async (articleId) => {
    if (isAuthenticated) {
      try {
        await removeFromServerCart(articleId);
        fetchCartFromServer();
      } catch (err) {
        console.error("Erreur suppression serveur", err);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item._id !== articleId));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await clearServerCart();
        setCartItems([]);
      } catch (err) {
        console.error("Erreur nettoyage serveur", err);
      }
    } else {
      setCartItems([]);
    }
  };

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
