import React, { useEffect, useState, useContext } from "react";
import { getAllUsers, deleteUser, updateUser } from "../../Services/api";
import { AuthContext } from "../../Services/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  PersonAdd,
  DeleteForever,
  Edit,
  Save,
  Cancel,
  FiberManualRecord,
  ShoppingCart,
} from "@mui/icons-material";
import "./userManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nom: "",
    email: "",
    role: "",
  });

  const { user, isAuthenticated, socket } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (socket) {
      socket.on("user_status_change", ({ userId, status }) => {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === userId ? { ...u, socketStatus: status } : u
          )
        );
      });

      socket.on("cart_updated", () => {
        fetchUsers();
      });
    }
    return () => {
      if (socket) {
        socket.off("user_status_change");
        socket.off("cart_updated");
      }
    };
  }, [socket]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (u) => {
    if (u.socketStatus === "online") {
      return { label: "En ligne", class: "online" };
    }

    if (u.lastActivity) {
      const now = new Date();
      const activityDate = new Date(u.lastActivity);
      const diffInMinutes = (now - activityDate) / (1000 * 60);

      if (diffInMinutes < 10) {
        return { label: "Inactif", class: "away" };
      }
    }

    return { label: "Hors ligne", class: "offline" };
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEditClick = (u) => {
    setEditingId(u._id);
    setEditFormData({ nom: u.nom, email: u.email, role: u.role });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await updateUser(id, editFormData);
      setUsers(
        users.map((u) => (u._id === id ? { ...u, ...editFormData } : u))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return <p className="loadingText">Chargement des utilisateurs...</p>;

  return (
    <div className="userManagementContainer">
      <div className="headerList">
        <h2>Gestion des Utilisateurs</h2>
        <Link to="/admin/create-user" className="btnAddUser">
          <PersonAdd /> Créer un utilisateur
        </Link>
      </div>

      {error && <p className="errorMsg">{error}</p>}

      <table className="userTable">
        <thead>
          <tr>
            <th>Statut</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Panier</th>
            <th>Dernière activité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const status = getStatus(u);
            const cartItemsCount = u.cart?.items?.reduce((acc, item) => acc + item.quantite, 0) || 0;

            return (
              <tr
                key={u._id}
                className={editingId === u._id ? "editingRow" : ""}
              >
                <td data-label="Statut">
                  <span className={`statusBadge ${status.class}`}>
                    <FiberManualRecord
                      style={{ fontSize: "12px", marginRight: "4px" }}
                    />
                    {status.label}
                  </span>
                </td>

                {editingId === u._id ? (
                  <>
                    <td data-label="Nom">
                      <input
                        type="text"
                        name="nom"
                        value={editFormData.nom}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td data-label="Email">
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td data-label="Rôle">
                      <select
                        name="role"
                        value={editFormData.role}
                        onChange={handleInputChange}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td data-label="Panier">-</td>
                    <td data-label="Activité">-</td>
                    <td data-label="Actions">
                      <button
                        onClick={() => handleSave(u._id)}
                        className="btnSave"
                      >
                        <Save />
                      </button>
                      <button onClick={handleCancelClick} className="btnCancel">
                        <Cancel />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td data-label="Nom">{u.nom}</td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Rôle">
                      <span className={`roleBadge ${u.role}`}>{u.role}</span>
                    </td>
                    <td data-label="Panier">
                      <div className="cartInfo">
                        <ShoppingCart style={{ fontSize: "16px", color: cartItemsCount > 0 ? "#27ae60" : "#bdc3c7" }} />
                        <span>{cartItemsCount} art.</span>
                      </div>
                    </td>
                    <td data-label="Activité">
                      {u.lastActivity
                        ? new Date(u.lastActivity).toLocaleTimeString()
                        : "Jamais"}
                    </td>
                    <td data-label="Actions">
                      <button
                        onClick={() => handleEditClick(u)}
                        className="btnEdit"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="btnDelete"
                        disabled={u._id === user?.id}
                        title={
                          u._id === user?.id ? "Action impossible" : "Supprimer"
                        }
                      >
                        <DeleteForever />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
