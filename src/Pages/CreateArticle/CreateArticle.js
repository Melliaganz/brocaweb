import { useState, useContext, useEffect } from "react";
import { createArticle } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Services/AuthContext";
import "./createArticle.css";

function CreateArticle() {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    etat: "",
    categorie: "",
    quantite: 1,
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const { isAuthenticated, user } = useContext(AuthContext);

  const maxFiles = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const objectUrls = images.map((img) => URL.createObjectURL(img));
    setPreviewUrls(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxFiles) {
      setMessage("Limite de 5 images maximum.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    if (images.length === 0 && files.length > 0) {
      setMainImageIndex(0);
    }
  };

  const isFormValid = () => {
    return (
      formData.titre.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.prix !== "" &&
      formData.etat !== "" &&
      formData.categorie !== "" &&
      images.length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = new FormData();
    payload.append("titre", formData.titre);
    payload.append("description", formData.description);
    payload.append("prix", Number(formData.prix)); // Forcer le nombre
    payload.append("etat", formData.etat);
    payload.append("categorie", formData.categorie);
    payload.append("mainImageIndex", mainImageIndex);
    payload.append("quantite", Number(formData.quantite)); // Forcer le nombre

    images.forEach((img) => {
      payload.append("images", img);
    });

    try {
      await createArticle(payload);
      setMessage("Article créé avec succès !");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("[UPLOAD_ERROR]", err);
      // Récupère le message précis du backend (Multer ou Controller)
      const errorMsg = err.response?.data?.message || "Erreur lors de la création.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="createArticleContainer">
      <h2>Créer un article</h2>
      <form onSubmit={handleSubmit}>
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

        <div className="selectInput">
          <select
            name="etat"
            value={formData.etat}
            onChange={handleChange}
            required
            className="inputs"
          >
            <option value="">État</option>
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
            <option value="">Catégorie</option>
            <option value="Électronique">Électronique</option>
            <option value="Meubles">Meubles</option>
            <option value="Vêtements">Vêtements</option>
            <option value="Jeux / Jouets">Jeux / Jouets</option>
            <option value="Autre">Autre</option>
          </select>

          <input
            type="number"
            name="quantite"
            placeholder="Quantité"
            min={1}
            value={formData.quantite}
            onChange={handleChange}
            required
            className="inputs"
          />
        </div>

        <div className="fileInputContainer">
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="fileInput"
          />
          <label htmlFor="file-upload" className="fileLabel">
            Ajouter des photos ({images.length}/{maxFiles})
          </label>
        </div>

        <div className="previewContainer">
          {previewUrls.map((url, idx) => (
            <div 
              key={idx} 
              className={`previewItem ${idx === mainImageIndex ? "mainImage" : ""}`}
              onClick={() => setMainImageIndex(idx)}
            >
              <img src={url} alt={`Preview ${idx}`} />
              <button 
                type="button" 
                className="removeImgBtn" 
                onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
              >
                ×
              </button>
              {idx === mainImageIndex && <span className="mainBadge">Principale</span>}
            </div>
          ))}
        </div>

        {images.length > 0 && (
          <p className="hint">Cliquer sur une photo pour la définir comme principale</p>
        )}

        <button 
          type="submit" 
          className="submitBtn" 
          disabled={!isFormValid() || loading}
        >
          {loading ? "Création..." : "Créer l’article"}
        </button>

        {message && (
          <p className={`message ${message.includes("succès") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default CreateArticle;
