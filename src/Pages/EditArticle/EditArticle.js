import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL_IMG, getArticleById, updateArticle, getCategories } from "../../Services/api";
import { AuthContext } from "../../Services/AuthContext";
import CategoryManager from "../CategoryManager/CategoryManager"; 
import "../CreateArticle/createArticle.css";
import { CloudUpload, AddCircleOutline } from "@mui/icons-material";

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    etat: "",
    categorie: "",
    quantite: "",
  });
  
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCatManager, setShowCatManager] = useState(false);

  const getImageUrl = (imageName) => {
    if (!imageName) return "/placeholder.jpg";
    if (imageName.startsWith("http")) return imageName;
    return `${API_BASE_URL_IMG}/uploads/${imageName}`;
  };

  const fetchCats = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Erreur chargement catégories", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCats();
        const article = await getArticleById(id);
        setFormData({
          titre: article.titre || "",
          description: article.description || "",
          prix: article.prix || "",
          etat: article.etat || "",
          categorie: article.categorie || "",
          quantite: article.quantite ?? 1,
        });
        setExistingImages(article.images || []);
        setMainImageIndex(article.mainImageIndex || 0);
      } catch (err) {
        setMessage("Erreur de chargement de l'article.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + newImages.length + files.length;
    if (total > 5) {
      setMessage("Limite de 5 images dépassée");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    setMessage("");
  };

  const handleRemoveExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
    if (mainImageIndex >= index) {
      setMainImageIndex(Math.max(0, mainImageIndex - 1));
    }
  };

  const handleRemoveNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingImages.length + newImages.length === 0) {
      setMessage("Au moins une image est requise.");
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach(key => form.append(key, formData[key]));
    form.append("mainImageIndex", mainImageIndex);
    existingImages.forEach((img) => form.append("existingImages", img));
    newImages.forEach((file) => form.append("newImages", file));

    try {
      setLoading(true);
      await updateArticle(id, form);
      navigate(`/article/${id}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="createArticleContainer"><p>Chargement...</p></div>;

  return (
    <div className="createArticleContainer">
      <h2>Modifier l'article</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          value={formData.titre}
          onChange={handleChange}
          className="inputs"
          required
        />
        
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="inputs"
          rows={4}
          required
        />

        <input
          type="number"
          name="prix"
          placeholder="Prix"
          value={formData.prix}
          onChange={handleChange}
          className="inputs"
          required
        />

        <div className="selectInputGroup">
          <select name="etat" value={formData.etat} onChange={handleChange} className="inputs" required>
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
              className="inputs selectWithBtn" 
              required
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
            className="inputs"
            required
          />
        </div>

        <div className="previewContainer">
          {existingImages.map((img, idx) => (
            <div 
              key={`ex-${idx}`} 
              className={`previewItem ${idx === mainImageIndex ? "mainImage" : ""}`}
              onClick={() => setMainImageIndex(idx)}
            >
              <img src={getImageUrl(img)} alt="" />
              <button type="button" className="removeImgBtn" onClick={(e) => { e.stopPropagation(); handleRemoveExistingImage(idx); }}>×</button>
              {idx === mainImageIndex && <div className="mainBadge">Principale</div>}
            </div>
          ))}

          {newImages.map((img, idx) => {
            const globalIdx = existingImages.length + idx;
            return (
              <div 
                key={`new-${idx}`} 
                className={`previewItem ${globalIdx === mainImageIndex ? "mainImage" : ""}`}
                onClick={() => setMainImageIndex(globalIdx)}
              >
                <img src={URL.createObjectURL(img)} alt="" />
                <button type="button" className="removeImgBtn" onClick={(e) => { e.stopPropagation(); handleRemoveNewImage(idx); }}>×</button>
                {globalIdx === mainImageIndex && <div className="mainBadge">Principale</div>}
              </div>
            );
          })}
        </div>

        <p className="hint">Cliquez sur une image pour la définir comme image principale</p>

        <div className="fileInputContainer">
          <input
            type="file"
            id="file-upload"
            className="fileInput"
            accept="image/*"
            multiple
            onChange={handleNewImageChange}
          />
          <label htmlFor="file-upload" className="fileLabel">
            <CloudUpload style={{ marginRight: "10px" }} />
            Ajouter des photos ({existingImages.length + newImages.length} / 5)
          </label>
        </div>

        <button type="submit" className="submitBtn" disabled={loading}>
          {loading ? "Enregistrement..." : "Valider les modifications"}
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

      {message && <p className={`message ${message.includes("Erreur") ? "error" : "success"}`}>{message}</p>}
    </div>
  );
}

export default EditArticle;
