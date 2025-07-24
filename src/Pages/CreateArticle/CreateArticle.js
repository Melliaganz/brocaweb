import { useState, useContext, useEffect } from "react";
import { createArticle } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Services/AuthContext";
import "./createArticle.css";
import { Close } from "@mui/icons-material";

function CreateArticle() {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    etat: "",
    categorie: "",
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Autorisation admin
  useEffect(() => {
    if (!isAuthenticated) return;

    // attendre que `user` soit défini
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setMessage("Vous ne pouvez télécharger que 5 images maximum.");
      return;
    }

    setImages(files);
  };

  if (images.length > 5) {
    setMessage("Limite de 5 images dépassée.");
    setLoading(false);
    return;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = new FormData();
    payload.append("titre", formData.titre);
    payload.append("description", formData.description);
    payload.append("prix", formData.prix);
    payload.append("etat", formData.etat);
    payload.append("categorie", formData.categorie);

    images.forEach((img) => {
      payload.append("images", img); // même champ "images" pour chaque fichier
    });

    try {
      await createArticle(payload);
      setMessage("Article créé avec succès !");
      setFormData({
        titre: "",
        description: "",
        prix: "",
        etat: "",
        categorie: "",
      });
      setImages([]);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="createArticleContainer">
      <h2>Créer un article</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          value={formData.titre}
          onChange={handleChange}
          required
          className="inputs"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="inputs"
        />

        <input
          type="number"
          name="prix"
          placeholder="Prix (€)"
          value={formData.prix}
          onChange={handleChange}
          required
          className="inputs"
        />

        <select
          name="etat"
          value={formData.etat}
          onChange={handleChange}
          required
          className="inputs"
        >
          <option value="">-- Sélectionner un état --</option>
          <option value="Neuf">Neuf</option>
          <option value="Très bon état">Très bon état</option>
          <option value="Bon état">Bon état</option>
          <option value="Usé">Usé</option>
          <option value="À réparer">À réparer</option>
        </select>

        <select
          name="categorie"
          value={formData.categorie}
          onChange={handleChange}
          required
          className="inputs"
        >
          <option value="">-- Sélectionner une catégorie --</option>
          <option value="Électronique">Électronique</option>
          <option value="Meubles">Meubles</option>
          <option value="Vêtements">Vêtements</option>
          <option value="Jeux / Jouets">Jeux / Jouets</option>
          <option value="Autre">Autre</option>
        </select>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="inputs"
          max={5}
        />
        <p style={{ fontSize: "0.9rem", color: "gray" }}>
          {images.length}/5 images sélectionnées
        </p>

        {images.length > 0 && (
          <div className="previewGrid">
            {images.map((img, idx) => (
              <div key={idx} className="previewItem">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Prévisualisation ${idx}`}
                />
                <button type="button" onClick={() => handleRemoveImage(idx)}>
                  X
                </button>
              </div>
            ))}
          </div>
        )}

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
