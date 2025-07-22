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
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await login(email, motDePasse);
      localStorage.setItem("token", data.token);
      setMessage("Connexion réussie");
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsAuthenticated(true);

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
