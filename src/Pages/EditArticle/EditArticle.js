import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticleById, updateArticle } from "../../Services/api";
import { AuthContext } from "../../Services/AuthContext";
import "./editArticle.css"; // Réutilisation du même style

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
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        setMessage("Erreur de chargement");
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + newImages.length + files.length;

    if (total > 5) {
      setMessage("Limite de 5 images dépassée");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
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
    const totalImages = existingImages.length + newImages.length;

    if (totalImages === 0) {
      setMessage("Au moins une image est requise.");
      return;
    }

    const form = new FormData();

    form.append("titre", formData.titre);
    form.append("description", formData.description);
    form.append("prix", formData.prix);
    form.append("etat", formData.etat);
    form.append("categorie", formData.categorie);
    form.append("quantite", Number(formData.quantite) || 1);
    form.append("mainImageIndex", mainImageIndex);

    existingImages.forEach((img) => {
      form.append("existingImages", img);
    });

    newImages.forEach((file) => {
      form.append("newImages", file);
    });

    try {
      setLoading(true);
      await updateArticle(id, form);
      navigate(`/article/${id}`);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Erreur lors de la mise à jour"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="createArticleContainer">
      <h2>Modifier un article</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="titre"
          value={formData.titre || ""}
          onChange={handleChange}
          className="inputs"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="inputs"
          rows={4}
          required
        />
        <input
          type="number"
          name="prix"
          value={formData.prix}
          onChange={handleChange}
          className="inputs"
          required
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

        <p>Images actuelles :</p>
        <div className="previewGrid">
          {existingImages.map((img, idx) => (
            <div key={idx} className="previewItem">
              <img
                src={`http://localhost:5000/uploads/${img}`}
                alt=""
                onClick={() => setMainImageIndex(idx)}
                width={300}
                height={200}
                style={{
                  border: idx === mainImageIndex ? "2px solid green" : "none",
                  cursor: "pointer",
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(idx)}
              >
                X
              </button>
            </div>
          ))}
        </div>

        {newImages.length > 0 && (
          <>
            <p>Nouvelles images :</p>
            <div className="previewGrid">
              {newImages.map((img, idx) => (
                <div key={idx} className="previewItem">
                  <img
                    src={URL.createObjectURL(img)}
                    alt=""
                    onClick={() =>
                      setMainImageIndex(existingImages.length + idx)
                    }
                    style={{
                      border:
                        existingImages.length + idx === mainImageIndex
                          ? "2px solid green"
                          : "none",
                      cursor: "pointer",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleNewImageChange}
          className="inputs"
        />
        <p>{existingImages.length + newImages.length} / 5 images</p>

        <button type="submit">Valider les modifications</button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}

export default EditArticle;
