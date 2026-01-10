import { useEffect, useState } from "react";
import { getUserOrders } from "../../Services/api";
import "./UserOrders.css";
import { ShoppingBag, AccessTime, CheckCircle, localShipping } from "@mui/icons-material";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        setError("Impossible de charger vos commandes.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Livré": return <CheckCircle style={{ color: "green" }} />;
      case "Expédié": return <localShipping style={{ color: "blue" }} />;
      default: return <AccessTime style={{ color: "orange" }} />;
    }
  };

  if (loading) return <div className="loaderContainer"><span className="loader"></span></div>;

  return (
    <div className="ordersContainer">
      <h1><ShoppingBag /> Mes commandes</h1>
      {error && <p className="error">{error}</p>}
      
      {orders.length === 0 ? (
        <p className="emptyMessage">Vous n'avez pas encore passé de commande.</p>
      ) : (
        <div className="ordersList">
          {orders.map((order) => (
            <div key={order._id} className="orderCard">
              <div className="orderHeader">
                <span>Commande n° {order._id.slice(-8)}</span>
                <span className="orderDate">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="orderDetails">
                <div className="orderItems">
                  {order.articles.map((item, index) => (
                    <p key={index}>{item.quantite}x {item.article.titre}</p>
                  ))}
                </div>
                <div className="orderStatus">
                  {getStatusIcon(order.statut)}
                  <span>{order.statut}</span>
                </div>
              </div>
              
              <div className="orderFooter">
                <strong>Total : {order.total} €</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserOrders;
