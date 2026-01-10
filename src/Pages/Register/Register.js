import { useContext, useState, useEffect } from "react";
import { adminCreateUser } from "../../Services/api";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Services/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    role: "user",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== "admin")) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await adminCreateUser(formData);
      setMessage("Utilisateur créé avec succès !");
      setFormData({
        nom: "",
        email: "",
        motDePasse: "",
        role: "user",
      });
    } catch (err) {
      setMessage(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulaireContainer">
      <h2>Créer un utilisateur</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          className="inputs"
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleChange}
          required
          className="inputs"
        />
        <input
          type="password"
          name="motDePasse"
          placeholder="Mot de passe"
          value={formData.motDePasse}
          onChange={handleChange}
          required
          className="inputs"
        />
        
        <select 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          className="inputs"
          style={{ marginBottom: "1rem" }}
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>

        <button type="submit" disabled={loading} className="btn">
          {loading ? "Création..." : "Créer l'utilisateur"}
        </button>
      </form>
      
      {message && (
        <p style={{ 
          marginTop: "1rem", 
          color: message.includes("succès") ? "green" : "red" 
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Register;
