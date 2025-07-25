import { useContext, useState } from "react";
import { CartContext } from "../../Services/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../Services/api";
import "./checkout.css"
function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.prix * item.quantity,
    0
  );

  const handleOrder = async () => {
    setLoading(true);
    setMessage("");

    try {
      await placeOrder(
        cartItems.map((item) => ({
          articleId: item._id,
          quantity: item.quantity,
        }))
      );

      clearCart();
      setMessage("Commande passée avec succès !");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage("Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0)
    return <p>Votre panier est vide.</p>;

  return (
    <div className="checkoutContainer">
      <h2>Récapitulatif de la commande</h2>
      {cartItems.map((item) => (
        <div key={item._id}>
          <p>
            {item.titre} – {item.quantity} × {item.prix} € ={" "}
            <strong>{item.quantity * item.prix} €</strong>
          </p>
        </div>
      ))}
      <hr />
      <h3>Total : {total} €</h3>

      <button onClick={handleOrder} disabled={loading}>
        {loading ? "Commande en cours..." : "Valider la commande"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Checkout;
