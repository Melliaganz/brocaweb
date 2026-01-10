import { useContext, useState } from "react";
import { login } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { AuthContext } from "../../Services/AuthContext";
import { Email, Lock, Login as LoginIcon } from "@mui/icons-material";

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
      <div className="loginHeader">
        <LoginIcon style={{ fontSize: "3rem", color: "var(--primary)" }} />
        <h2>Connexion</h2>
        <p>Accédez à votre espace</p>
      </div>

      <form onSubmit={handleSubmit} className="loginForm">
        <div className="inputGroup">
          <Email className="inputIcon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="loginInput"
            autoComplete="email"
            name="email"
          />
        </div>

        <div className="inputGroup">
          <Lock className="inputIcon" />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            className="loginInput"
            autoComplete="current-password"
            name="password"
          />
        </div>

        <button type="submit" disabled={loading} className="btn">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      
      {message && <p className="errorMessage">{message}</p>}
    </div>
  );
}

export default Login;
