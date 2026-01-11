import { useEffect, useState } from "react";
import { getUserOrders, API_BASE_URL_IMG } from "../../Services/api";
import "./UserOrders.css";
import { ShoppingBag, AccessTime, CheckCircle, LocalShipping, ImageNotSupported } from "@mui/icons-material";

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
      case "Livré":
        return <CheckCircle style={{ color: "#2e7d32" }} />;
      case "Traité":
        return <LocalShipping style={{ color: "#0288d1" }} />;
      case "En cours":
      default:
        return <AccessTime style={{ color: "#ed6c02" }} />;
    }
  };

  const renderItemImage = (item) => {
    const imagePath = item.image || item.article?.images?.[0];
    
    if (!imagePath) {
      return (
        <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
          <ImageNotSupported style={{ fontSize: '20px', color: '#ccc' }} />
        </div>
      );
    }

    const src = imagePath.startsWith("http") 
      ? imagePath 
      : `${API_BASE_URL_IMG}/uploads/${imagePath}`;

    return (
      <img 
        src={src} 
        alt={item.titre}
        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
      />
    );
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
                <span>Commande n° {order._id.slice(-8).toUpperCase()}</span>
                <span className="orderDate">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="orderDetails">
                <div className="orderItems">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="orderItemRow" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      {renderItemImage(item)}
                      <p style={{ margin: 0 }}>
                        <strong>{item.quantity}x</strong> {item.titre}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="orderStatus">
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </div>
              
              <div className="orderFooter">
                <strong>Total : {order.totalPrice.toFixed(2)} €</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserOrders;
