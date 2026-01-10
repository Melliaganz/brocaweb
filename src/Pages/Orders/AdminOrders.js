import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, API_BASE_URL_IMG } from "../../Services/api";
import "./adminOrders.css";
import { 
  BarChart, 
  ReceiptLong, 
  Euro, 
  ShoppingBasket, 
  Person,
  ImageNotSupported
} from "@mui/icons-material";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      const ordersArray = Array.isArray(data) ? data : data.orders;
      const sortedOrders = ordersArray.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      setError("Impossible de récupérer les commandes.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Mise à jour locale de l'état pour éviter un rechargement complet
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const stats = {
    totalRevenue: orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0),
    totalOrders: orders.length,
    itemsSold: orders.reduce(
      (acc, curr) =>
        acc + curr.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    ),
  };

  if (loading) return <div className="adminOrdersContainer"><span className="loader"></span></div>;
  if (error) return <div className="adminOrdersContainer error"><p>{error}</p></div>;

  return (
    <div className="adminOrdersContainer">
      <div className="adminHeader">
        <BarChart className="headerIcon" />
        <h1>Tableau de bord des ventes</h1>
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <div className="statIconWrapper"><Euro /></div>
          <div className="statInfo">
            <h3>Chiffre d'affaires</h3>
            <p className="statNumber">{stats.totalRevenue.toLocaleString()} €</p>
          </div>
        </div>
        <div className="statCard">
          <div className="statIconWrapper"><ReceiptLong /></div>
          <div className="statInfo">
            <h3>Commandes</h3>
            <p className="statNumber">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="statCard">
          <div className="statIconWrapper"><ShoppingBasket /></div>
          <div className="statInfo">
            <h3>Articles vendus</h3>
            <p className="statNumber">{stats.itemsSold}</p>
          </div>
        </div>
      </div>

      <div className="tableSection">
        <div className="sectionTitle">
          <ReceiptLong />
          <h2>Gestion des Commandes</h2>
        </div>

        {orders.length === 0 ? (
          <div className="noOrdersBox">
            <p>Aucune commande n'a encore été passée.</p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table className="ordersTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Articles</th>
                  <th>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="dateCell">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td>
                      <div className="clientInfo">
                        <span className="clientName">
                          <Person style={{ fontSize: "1rem" }} /> {order.user?.nom || "Client supprimé"}
                        </span>
                        <span className="clientEmail">{order.user?.email}</span>
                      </div>
                    </td>
                    <td>
                      <ul className="itemsList">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="adminOrderItem">
                            {item.article?.images?.[0] ? (
                              <img 
                                src={`${API_BASE_URL_IMG}/${item.article.images[0]}`} 
                                alt="" 
                                className="adminOrderThumb"
                              />
                            ) : (
                              <ImageNotSupported className="adminOrderThumb placeholder" />
                            )}
                            <span><strong>{item.quantity}x</strong> {item.titre}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="priceTotal">{order.totalPrice} €</td>
                    <td>
                      <select 
                        className={`statusSelect ${order.status.toLowerCase().replace(/\s/g, "")}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="En cours">En cours</option>
                        <option value="Traité">Traité</option>
                        <option value="Livré">Livré</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
