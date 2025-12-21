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
    // Generate URLs only when images change
    const objectUrls = images.map((img) => URL.createObjectURL(img));
    setPreviewUrls(objectUrls);

    // Cleanup: Revoke URLs to free memory
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);
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

  if (images.length > 5) {
    setMessage("Limite de 5 images dépassée.");
    setLoading(false);
    return;
  }
  const isFormValid = () => {
    return (
      formData.titre.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.prix !== "" &&
      formData.etat !== "" &&
      formData.categorie !== "" &&
      images.length > 0 &&
      images.length <= maxFiles
    );
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
    payload.append("categorie", formData.categorie);
    payload.append("mainImageIndex", mainImageIndex || 0);
    payload.append("quantite", formData.quantite);

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
        quantite: 1,
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
          value={formData.titre ?? ""}
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
          value={formData.prix ?? ""}
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
            <option value="">Etat</option>
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
            value={formData.quantite ?? ""}
            onChange={handleChange}
            required
            className="inputs"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="inputs"
          max={maxFiles}
        />
        <p style={{ fontSize: "0.9rem", color: "gray" }}>
          {images.length}/{maxFiles} images sélectionnées
        </p>
        <div stytle={{ display: "flex", gap: "10px", flexWrap: "wrap" , flexDirection:"row"}} className="previewContainer">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="previewItem">
              <img
                src={url}
                alt={`Preview ${idx}`}
                onClick={() => setMainImageIndex(idx)}
                width={300}
                height={200}
                style={{
                  border:
                    idx === mainImageIndex
                      ? "2px solid blue"
                      : "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
              <button type="button" onClick={() => handleRemoveImage(idx)}>
                X
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "gray" }}>
          Cliquer sur une des photos pour en faire la photo principale de
          l'article
        </p>

        <button type="submit" disabled={!isFormValid() || loading}>
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
