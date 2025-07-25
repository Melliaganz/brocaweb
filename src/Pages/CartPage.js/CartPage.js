import { useContext } from "react";
import { CartContext } from "../../Services/CartContext";
import { Link } from "react-router-dom";
import "./cartPage.css"

function CartPage() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  if (cartItems.length === 0)
    return <p>Votre panier est vide.</p>;

  return (
    <div className="monPanierContainer">
      <h2>Mon panier</h2>
      {cartItems.map((item) => (
        <div key={item._id}>
          <h3>{item.titre}</h3>
          <p>{item.prix} € x {item.quantity}</p>
          <button onClick={() => removeFromCart(item._id)}>Retirer</button>
        </div>
      ))}
      <Link to="/checkout">Valider la commande</Link>
    </div>
  );
}

export default CartPage;
