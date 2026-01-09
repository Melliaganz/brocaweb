import React, { useEffect, useState, useContext } from "react";
import { getAllUsers, deleteUser } from "../../Services/api";
import { AuthContext } from "../../Services/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { PersonAdd, DeleteForever } from "@mui/icons-material";
import "./userManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [isAuthenticated, user, navigate]);

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

  if (loading) return <p>Chargement...</p>;

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
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.nom}</td>
              <td>{u.email}</td>
              <td>
                <span className={`badge ${u.role}`}>{u.role}</span>
              </td>
              <td>
                <button 
                  onClick={() => handleDelete(u._id)}
                  className="btnDelete"
                  disabled={u._id === user.id}
                  title={u._id === user.id ? "Vous ne pouvez pas vous supprimer" : "Supprimer"}
                >
                  <DeleteForever />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
