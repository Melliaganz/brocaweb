import { useEffect, useState } from "react";
import { getAllOrders } from "../../Services/api";
import "./adminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        console.log("Données reçues de l'API :", data);

        const ordersArray = Array.isArray(data) ? data : data.orders;

        const sortedOrders = ordersArray.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (err) {
        setError("Impossible de récupérer les commandes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const stats = {
    totalRevenue: orders.reduce((acc, curr) => acc + curr.totalPrice, 0),
    totalOrders: orders.length,
    itemsSold: orders.reduce(
      (acc, curr) =>
        acc + curr.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    ),
  };
  if (loading)
    return (
      <div className="adminOrdersContainer">
        <span className="loader"></span>
      </div>
    );
  if (error) return <div className="adminOrdersContainer error">{error}</div>;

  return (
    <div className="adminOrdersContainer">
      <h1>Tableau de bord des ventes</h1>

      <div className="statsGrid">
        <div className="statCard">
          <h3>Chiffre d'affaires</h3>
          <p className="statNumber">{stats.totalRevenue} €</p>
        </div>
        <div className="statCard">
          <h3>Commandes</h3>
          <p className="statNumber">{stats.totalOrders}</p>
        </div>
        <div className="statCard">
          <h3>Articles vendus</h3>
          <p className="statNumber">{stats.itemsSold}</p>
        </div>
      </div>
      <h1>Gestion des Commandes Clients</h1>

      {orders.length === 0 ? (
        <p className="noOrders">Aucune commande n'a encore été passée.</p>
      ) : (
        <div className="tableWrapper">
          <table className="ordersTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Articles commandés</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td>
                    <div className="clientInfo">
                      <strong>
                        {order.user?.nom || "Utilisateur supprimé"}
                      </strong>
                      <span>{order.user?.email}</span>
                    </div>
                  </td>
                  <td>
                    <ul className="itemsList">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity}x {item.titre}{" "}
                          <small>({item.prix}€)</small>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="priceTotal">{order.totalPrice} €</td>
                  <td>
                    <span
                      className={`statusBadge ${order.status.replace(
                        /\s/g,
                        ""
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
