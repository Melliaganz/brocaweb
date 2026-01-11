import { useEffect, useState, useContext } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  API_BASE_URL_IMG,
  getAllUsers,
} from "../../Services/api";
import { AuthContext } from "../../Services/AuthContext";
import "./adminOrders.css";
import {
  BarChart,
  ReceiptLong,
  Euro,
  ShoppingBasket,
  Person,
  ImageNotSupported,
  DeleteOutline,
  ShoppingCartCheckout,
} from "@mui/icons-material";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [usersWithCarts, setUsersWithCarts] = useState([]);
  const [activeTab, setActiveTab] = useState("validated");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { socket } = useContext(AuthContext);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleUpdate = () => {
        fetchInitialData();
      };

      socket.on("cart_updated", handleUpdate);
      socket.on("user_status_change", handleUpdate);
      socket.on("order_updated", handleUpdate); // Optionnel si vous émettez cet event au backend

      return () => {
        socket.off("cart_updated", handleUpdate);
        socket.off("user_status_change", handleUpdate);
        socket.off("order_updated", handleUpdate);
      };
    }
  }, [socket]);

  const fetchInitialData = async () => {
    try {
      const [ordersData, usersData] = await Promise.all([
        getAllOrders(),
        getAllUsers(),
      ]);

      const ordersArray = Array.isArray(ordersData)
        ? ordersData
        : ordersData.orders || [];

      setOrders(
        [...ordersArray].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );

      if (Array.isArray(usersData)) {
        setUsersWithCarts(usersData.filter((u) => u.cart?.items?.length > 0));
      }
    } catch (err) {
      setError("Impossible de récupérer les données.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Supprimer définitivement cette commande ?")) {
      try {
        await deleteOrder(orderId);
        setOrders(orders.filter((order) => order._id !== orderId));
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const renderItemImage = (item) => {
    const imagePath = item.image || item.article?.images?.[0];
    if (!imagePath)
      return <ImageNotSupported className="adminOrderThumb placeholder" />;
    if (imagePath.startsWith("http"))
      return <img src={imagePath} alt="" className="adminOrderThumb" />;
    return (
      <img
        src={`${API_BASE_URL_IMG}/uploads/${imagePath}`}
        alt=""
        className="adminOrderThumb"
      />
    );
  };

  const stats = {
    totalRevenue: orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0),
    totalOrders: orders.length,
    itemsSold: orders.reduce(
      (acc, curr) =>
        acc + (curr.items?.reduce((sum, item) => sum + item.quantity, 0) || 0),
      0
    ),
  };

  if (loading)
    return (
      <div className="adminOrdersContainer">
        <span className="loader"></span>
      </div>
    );
  if (error)
    return (
      <div className="adminOrdersContainer error">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="adminOrdersContainer">
      <div className="adminHeader">
        <BarChart className="headerIcon" />
        <h1>Tableau de bord des ventes</h1>
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <div className="statIconWrapper">
            <Euro />
          </div>
          <div className="statInfo">
            <h3>Chiffre d'affaires</h3>
            <p className="statNumber">
              {stats.totalRevenue.toLocaleString()} €
            </p>
          </div>
        </div>
        <div className="statCard">
          <div className="statIconWrapper">
            <ReceiptLong />
          </div>
          <div className="statInfo">
            <h3>Commandes validées</h3>
            <p className="statNumber">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="statCard">
          <div className="statIconWrapper">
            <ShoppingBasket />
          </div>
          <div className="statInfo">
            <h3>Paniers actifs</h3>
            <p className="statNumber">{usersWithCarts.length}</p>
          </div>
        </div>
      </div>

      <div className="tableSection">
        <div className="tabsSelector">
          <button
            className={`tabBtn ${activeTab === "validated" ? "active" : ""}`}
            onClick={() => setActiveTab("validated")}
          >
            <ReceiptLong /> Commandes passées
          </button>
          <button
            className={`tabBtn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <ShoppingCartCheckout /> Paniers en cours
            {usersWithCarts.length > 0 && (
              <span className="tabBadge">{usersWithCarts.length}</span>
            )}
          </button>
        </div>

        {activeTab === "validated" ? (
          <div className="tableWrapper">
            {orders.length === 0 ? (
              <p className="noDataMsg">
                Aucune commande validée pour le moment.
              </p>
            ) : (
              <table className="ordersTable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Articles</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Action</th>
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
                            <Person style={{ fontSize: "1rem" }} />{" "}
                            {order.user?.nom || "Client supprimé"}
                          </span>
                          <span className="clientEmail">
                            {order.user?.email}
                          </span>
                        </div>
                      </td>
                      <td>
                        <ul className="itemsList">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="adminOrderItem">
                              {renderItemImage(item)}
                              <span>
                                <strong>{item.quantity}x</strong> {item.titre}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="priceTotal">{order.totalPrice} €</td>
                      <td>
                        <select
                          className={`statusSelect ${order.status
                            .toLowerCase()
                            .replace(/\s/g, "")}`}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          <option value="En cours">En cours</option>
                          <option value="Traité">Traité</option>
                          <option value="Livré">Livré</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="btnActionDelete"
                        >
                          <DeleteOutline />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="tableWrapper">
            {usersWithCarts.length === 0 ? (
              <p className="noDataMsg">Aucun panier actif pour le moment.</p>
            ) : (
              <table className="ordersTable cartsTable">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Contenu du panier</th>
                    <th>Valeur estimée</th>
                    <th>Dernière activité</th>
                  </tr>
                </thead>
                <tbody>
                  {usersWithCarts.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="clientInfo">
                          <span className="clientName">
                            <Person style={{ fontSize: "1rem" }} /> {u.nom}
                          </span>
                          <span className="clientEmail">{u.email}</span>
                        </div>
                      </td>
                      <td>
                        <ul className="itemsList">
                          {u.cart.items.map((item, idx) => (
                            <li key={idx} className="adminOrderItem">
                              <span>
                                <strong>{item.quantite}x</strong>{" "}
                                {item.article?.nom || "Article"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="priceTotal">
                        {u.cart.items.reduce(
                          (sum, i) => sum + i.quantite * (i.article?.prix || 0),
                          0
                        )}{" "}
                        €
                      </td>
                      <td>
                        {u.lastActivity
                          ? new Date(u.lastActivity).toLocaleTimeString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
