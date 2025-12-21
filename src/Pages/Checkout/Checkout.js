import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../../Services/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrder, getArticleById } from "../../Services/api";
import "./checkout.css";
import { ClearAll, Remove, Done, ShoppingBag, Home } from "@mui/icons-material";

function Checkout() {
  const { cartItems, clearCart, removeFromCart, setCartItems } =
    useContext(CartContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate();

  const hasValidated = useRef(false);

  useEffect(() => {
    if (hasValidated.current || cartItems.length === 0) return;

    const verifyCartItems = async () => {
      const validItems = [];
      let hasChanged = false;

      for (const item of cartItems) {
        try {
          const article = await getArticleById(item._id);

          if (article && article.quantite > 0) {
            const adjustedQuantity = Math.min(item.quantity, article.quantite);

            if (adjustedQuantity !== item.quantity) {
              hasChanged = true;
            }

            validItems.push({ ...item, quantity: adjustedQuantity });
          } else {
            hasChanged = true;
          }
        } catch (err) {
          hasChanged = true;
        }
      }

      if (hasChanged) {
        setCartItems(validItems);
        setMessage(
          "Votre panier a été mis à jour selon les stocks disponibles."
        );
      }
      hasValidated.current = true;
    };

    verifyCartItems();
  }, [cartItems, setCartItems]);

  const total = cartItems.reduce(
    (acc, item) => acc + item.prix * item.quantity,
    0
  );

 const handleOrder = async () => {
    setLoading(true);
    try {
      await placeOrder(
        cartItems.map((item) => ({
          articleId: item._id,
          quantity: item.quantity,
        }))
      );

      setIsSuccess(true); 
      clearCart();
    } catch (err) {
      console.error("[CHECKOUT_ERROR]", err);
      setMessage("Erreur lors de la validation de votre commande.");
      setLoading(false);
    }
  };

 if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="checkoutContainer emptyCart">
        <ShoppingBag style={{ fontSize: "4rem", color: "#ccc" }} />
        <p className="emptyMessage">Votre panier est actuellement vide.</p>
        <button className="orderBtn" onClick={() => navigate("/")}>
          <Home /> Retourner à la boutique
        </button>
      </div>
    );
  }
  return (
    <div className="checkoutContainer">
      {isSuccess && (
        <div className="orderSuccessModal">
          <div className="successContent">
            <div className="successIcon">
              <Done style={{ fontSize: "3rem" }} />
            </div>
            <h2>Commande confirmée !</h2>
            <p>Votre demande a bien été enregistrée et le stock a été mis à jour.</p>
            <div className="modalButtons">
              <button className="btnHome" onClick={() => navigate("/")}>
                <Home /> Retourner à l'accueil
              </button>
              <button className="btnOrders" onClick={() => navigate("/profile")}>
                <ShoppingBag /> Voir mes commandes
              </button>
            </div>
          </div>
        </div>
      )}
      <h2>Récapitulatif de la commande</h2>
      <div className="cartList">
        {cartItems.map((item) => (
          <div key={item._id} className="cartItem">
            <p>
              <strong>{item.titre}</strong> – {item.quantity} x {item.prix} € ={" "}
              {item.quantity * item.prix} €
            </p>
            <button
              className="removeBtn"
              onClick={() => removeFromCart(item._id)}
            >
              <Remove />
            </button>
          </div>
        ))}
      </div>

      <div className="cartActions">
        <button className="clearBtn" onClick={clearCart}>
          <ClearAll />
          Vider tout le panier
        </button>
      </div>

      <hr />
      <h3>Total : {total} €</h3>

      <button className="orderBtn" onClick={handleOrder} disabled={loading}>
        {loading ? "Commande en cours..." : "Valider la commande"}
      </button>

      {message && <p className="statusMessage">{message}</p>}
    </div>
  );
}

export default Checkout;
