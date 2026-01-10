import React, { useEffect, useState, useContext } from "react";
import { getAllUsers, deleteUser, updateUser } from "../../Services/api";
import { AuthContext } from "../../Services/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { PersonAdd, DeleteForever, Edit, Save, Cancel } from "@mui/icons-material";
import "./userManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ nom: "", email: "", role: "" });
  
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
      const updatedUser = await updateUser(id, editFormData);
      setUsers(users.map((u) => (u._id === id ? { ...u, ...editFormData } : u)));
      setEditingId(null);
      alert("Utilisateur mis à jour");
    } catch (err) {
      alert(err.message);
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
              {editingId === u._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="nom"
                      value={editFormData.nom}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <select name="role" value={editFormData.role} onChange={handleInputChange}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleSave(u._id)} className="btnSave">
                      <Save />
                    </button>
                    <button onClick={handleCancelClick} className="btnCancel">
                      <Cancel />
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{u.nom}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    <button onClick={() => handleEditClick(u)} className="btnEdit">
                      <Edit />
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="btnDelete"
                      disabled={u._id === user.id}
                      title={u._id === user.id ? "Vous ne pouvez pas vous supprimer" : "Supprimer"}
                    >
                      <DeleteForever />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
