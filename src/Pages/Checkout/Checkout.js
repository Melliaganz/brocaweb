import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../../Services/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrder, getArticleById, API_BASE_URL_IMG } from "../../Services/api";
import "./checkout.css";
import { ClearAll, Remove, Done, ShoppingBag, Home, ReceiptLong } from "@mui/icons-material";

function Checkout() {
  const { cartItems, clearCart, removeFromCart, setCartItems } = useContext(CartContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const hasValidated = useRef(false);

  const getImageUrl = (imageName) => {
    if (!imageName) return "/placeholder.jpg";
    if (imageName.startsWith("http")) return imageName;
    return `${API_BASE_URL_IMG}/uploads/${imageName}`;
  };

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
            if (adjustedQuantity !== item.quantity) hasChanged = true;
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
        setMessage("Votre panier a été mis à jour selon les stocks disponibles.");
      }
      hasValidated.current = true;
    };
    verifyCartItems();
  }, [cartItems, setCartItems]);

  const total = cartItems.reduce((acc, item) => acc + item.prix * item.quantity, 0);

  const handleOrder = async () => {
    setLoading(true);
    try {
      await placeOrder(cartItems.map((item) => ({ articleId: item._id, quantity: item.quantity })));
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      setMessage("Erreur lors de la validation de votre commande.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="checkoutContainer emptyCart">
        <ShoppingBag style={{ fontSize: "5rem", color: "#ccc" }} />
        <h2>Votre panier est vide</h2>
        <button className="orderBtn" onClick={() => navigate("/")}><Home /> Retourner à la boutique</button>
      </div>
    );
  }

  return (
    <div className="checkoutContainer">
      {isSuccess && (
        <div className="orderSuccessModal">
          <div className="successContent">
            <div className="successIcon pulse"><Done style={{ fontSize: "3rem" }} /></div>
            <h2>Commande confirmée !</h2>
            <p>Votre demande a bien été enregistrée.</p>
            <div className="modalButtons">
              <button className="btnHome" onClick={() => navigate("/")}><Home /> Accueil</button>
              <button className="btnOrders" onClick={() => navigate("/mes-commandes")}><ShoppingBag /> Mes commandes</button>
            </div>
          </div>
        </div>
      )}

      <div className="checkoutHeader">
        <ReceiptLong /> <h2>Récapitulatif</h2>
      </div>

      <div className="cartList">
        {cartItems.map((item) => (
          <div key={item._id} className="cartItem">
            <div className="itemInfoMain">
              <img src={getImageUrl(item.images?.[0])} alt={item.titre} className="checkoutItemImg" />
              <div className="itemTexts">
                <span className="itemTitle">{item.titre}</span>
                <span className="itemDetails">{item.quantity} x {item.prix} €</span>
              </div>
            </div>
            <div className="itemTotalZone">
              <span className="itemSubtotal">{item.quantity * item.prix} €</span>
              <button className="removeBtn" onClick={() => removeFromCart(item._id)}><Remove /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="cartActions">
        <button className="clearBtn" onClick={clearCart}><ClearAll /> Vider le panier</button>
      </div>

      <div className="totalSection">
        <div className="totalLine">
          <span>Total de la commande</span>
          <span className="totalAmount">{total} €</span>
        </div>
      </div>

      <button className="orderBtn" onClick={handleOrder} disabled={loading}>
        {loading ? "Chargement..." : "Valider la commande"}
      </button>

      {message && <p className="statusMessage">{message}</p>}
    </div>
  );
}

export default Checkout;
