import { useContext, useState } from "react";
import { register } from "../../Services/api";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Services/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    motDePasse: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

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
      const data = await register(formData);
      localStorage.setItem("token", data.token);
      
      setIsAuthenticated(true); 
      
      setMessage("Compte créé avec succès");
      navigate("/");
    } catch (err) {
      // On capture l'erreur proprement
      setMessage(err.response?.data?.message || err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulaireContainer">
      <h2>Créer un compte</h2>
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
        <button type="submit" disabled={loading} className="btn">
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>}
    </div>
  );
}

export default Register;
