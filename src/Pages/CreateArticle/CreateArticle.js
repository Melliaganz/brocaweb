import { useState, useContext, useEffect } from "react";
import { createArticle, getCategories } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Services/AuthContext";
import CategoryManager from "../CategoryManager/CategoryManager"; 
import { AddCircleOutline, CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
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
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [showCatManager, setShowCatManager] = useState(false);

  const [uploadStatus, setUploadStatus] = useState({ 
    show: false, 
    progress: 0, 
    status: "idle", 
    message: "" 
  });

  const { isAuthenticated, user } = useContext(AuthContext);
  const maxFiles = 5;
  const navigate = useNavigate();

  const fetchCats = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Erreur chargement catégories", err);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  useEffect(() => {
    const objectUrls = images.map((img) => URL.createObjectURL(img));
    setPreviewUrls(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxFiles) {
      setMessage("Limite de 5 images maximum.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    if (images.length === 0 && files.length > 0) setMainImageIndex(0);
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
    setUploadStatus({ show: true, progress: 10, status: "loading", message: "Initialisation de l'envoi..." });

    const payload = new FormData();
    payload.append("titre", formData.titre);
    payload.append("description", formData.description);
    payload.append("prix", Number(formData.prix));
    payload.append("etat", formData.etat);
    payload.append("categorie", formData.categorie);
    payload.append("mainImageIndex", mainImageIndex);
    payload.append("quantite", Number(formData.quantite));

    images.forEach((img) => payload.append("images", img));

    const progressInterval = setInterval(() => {
      setUploadStatus(prev => {
        if (prev.progress < 90) return { ...prev, progress: prev.progress + 5, message: "Upload des images en cours..." };
        return prev;
      });
    }, 400);

    try {
      await createArticle(payload);
      clearInterval(progressInterval);
      setUploadStatus({ show: true, progress: 100, status: "success", message: "Article créé avec succès !" });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      clearInterval(progressInterval);
      setUploadStatus({ show: true, progress: 100, status: "error", message: err.response?.data?.message || "Erreur lors de la création." });
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (mainImageIndex === index) setMainImageIndex(0);
    else if (index < mainImageIndex) setMainImageIndex((prev) => prev - 1);
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

        <div className="selectInputGroup">
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

          <div className="categorySelectorContainer">
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
              className="inputs selectWithBtn"
            >
              <option value="">Catégorie</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button 
              type="button" 
              className="manageCatsBtn"
              onClick={() => setShowCatManager(true)}
              title="Gérer les catégories"
            >
              <AddCircleOutline />
            </button>
          </div>

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

        <button 
          type="submit" 
          className="submitBtn" 
          disabled={!isFormValid() || uploadStatus.status === "loading"}
        >
          {uploadStatus.status === "loading" ? "Création..." : "Créer l’article"}
        </button>
      </form>

      {showCatManager && (
        <div className="modalOverlay" onClick={() => { setShowCatManager(false); fetchCats(); }}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="closeModal" onClick={() => { setShowCatManager(false); fetchCats(); }}>×</button>
            <CategoryManager />
          </div>
        </div>
      )}

      {uploadStatus.show && (
        <div className="modalOverlay">
          <div className="modalContent uploadStatusModal">
            {uploadStatus.status === "loading" && (
              <>
                <h3>Envoi en cours</h3>
                <div className="progressBarContainer">
                  <div className="progressBar" style={{ width: `${uploadStatus.progress}%` }}></div>
                </div>
              </>
            )}
            {uploadStatus.status === "success" && (
              <div className="statusResult success">
                <CheckCircleOutline style={{ fontSize: 60 }} />
                <h3>Succès !</h3>
              </div>
            )}
            {uploadStatus.status === "error" && (
              <div className="statusResult error">
                <ErrorOutline style={{ fontSize: 60 }} />
                <h3>Échec</h3>
                <button className="submitBtn" style={{marginTop: '1rem'}} onClick={() => setUploadStatus({ ...uploadStatus, show: false })}>Réessayer</button>
              </div>
            )}
            <p className="statusMessage">{uploadStatus.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateArticle;
