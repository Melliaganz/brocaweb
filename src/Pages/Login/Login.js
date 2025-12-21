import { useContext, useState } from "react";
import { login } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { AuthContext } from "../../Services/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await login(email, motDePasse);
      if (data.token) {
        localStorage.setItem("token", data.token);

        const base64Url = data.token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));

        setIsAuthenticated(true);
        setUser({ id: payload.id, role: payload.role });

        navigate("/");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Identifiants invalides ou erreur serveur";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="inputs"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
          className="inputs"
        />
        <button type="submit" disabled={loading} className="btn">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>}
    </div>
  );
}

export default Login;
