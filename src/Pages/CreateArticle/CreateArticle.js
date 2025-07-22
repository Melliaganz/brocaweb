import { useState } from "react";
import { createArticle } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../Services/AuthContext";

function CreateArticle() {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    etat: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = new FormData();
    payload.append("titre", formData.titre);
    payload.append("description", formData.description);
    payload.append("prix", formData.prix);
    payload.append("etat", formData.etat);
    if (image) payload.append("image", image);

    try {
      await createArticle(payload);
      setMessage("Article créé avec succès !");
      setFormData({ titre: "", description: "", prix: "", etat: "" });
      setImage(null);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isAuthenticated || user === null) return;

    if (user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Créer un article</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          value={formData.titre}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="number"
          name="prix"
          placeholder="Prix (€)"
          value={formData.prix}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="text"
          name="etat"
          placeholder="État (ex : Bon, Neuf, Usé...)"
          value={formData.etat}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: "1rem" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer l’article"}
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "1rem",
            color: message.includes("succès") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default CreateArticle;
