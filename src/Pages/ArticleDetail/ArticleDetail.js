import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById, deleteArticle } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Services/AuthContext";
import "./articleDetail.css";
import { Close, Delete, Done, Edit } from "@mui/icons-material";

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteArticle(id);
      navigate("/");
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!article) return <p>Article introuvable.</p>;

  return (
    <div className="articleDetailContainer">
      <h2>{article.titre}</h2>
      <div className="articleDetailContent">
        <div className="imagesGallery">
          <div className="mainImageContainer">
            <img
              src={`http://localhost:5000/uploads/${
                article.images[article.mainImageIndex || 0]
              }`}
              alt={article.titre}
              className="mainImage"
            />
          </div>

          {article.images.length > 1 && (
            <div className="thumbnailRow">
              {article.images.map(
                (img, i) =>
                  i !== (article.mainImageIndex || 0) && (
                    <img
                      key={i}
                      src={`http://localhost:5000/uploads/${img}`}
                      alt={`Miniature ${i + 1}`}
                      className="thumbnailImage"
                      onClick={() =>
                        setSelectedImage(`http://localhost:5000/uploads/${img}`)
                      }
                    />
                  )
              )}
            </div>
          )}
        </div>

        <div className="articleDetailInfo">
          {user?.role === "admin" && (
            <div className="articleActions">
              <button
                className="editBtn"
                onClick={() => navigate(`/admin/edit-article/${id}`)}
              >
                <Edit /> Modifier
              </button>
              <button
                className="deleteBtn"
                onClick={() => setShowConfirm(true)}
              >
                <Delete /> Supprimer
              </button>
            </div>
          )}
          {showConfirm && (
            <div className="confirmModal">
              <div className="confirmBox">
                <p>Confirmer la suppression de cet article ?</p>
                <div className="confirmActions">
                  <button className="buttonValidate" onClick={handleDelete}>
                    <Done /> Oui, supprimer
                  </button>
                  <button
                    className="buttonCancel"
                    onClick={() => setShowConfirm(false)}
                  >
                    <Close /> Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="descriptionArticleDetail">
            <p>
              <strong>Prix :</strong> {article.prix} €
            </p>
            <p>
              <strong>Description :</strong> {article.description}
            </p>
            <p>
              <strong>État :</strong> {article.etat}
            </p>
            <p>
              <strong>Catégorie:</strong> {article.categorie}
            </p>
          </div>
        </div>
      </div>
      {selectedImage && (
        <div className="modalOverlay" onClick={() => setSelectedImage(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button
              className="closeModalBtn"
              onClick={() => setSelectedImage(null)}
            >
              <Close />
            </button>
            <img src={selectedImage} alt="Zoom" className="modalImage" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleDetail;
