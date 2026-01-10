import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById, deleteArticle, API_BASE_URL_IMG } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Services/AuthContext";
import { CartContext } from "../../Services/CartContext";
import "./articleDetail.css";
import {
  Add,
  Close,
  Delete,
  Done,
  Edit,
  Remove,
  ShoppingCart,
  Lock
} from "@mui/icons-material";

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantitySelected, setQuantitySelected] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lastAddedQty, setLastAddedQty] = useState(0);

  const { user, isAuthenticated } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);

  const itemInCart = (cartItems || []).find((item) => item._id === id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  const availableStock = article ? article.quantite - quantityInCart : 0;

  const navigate = useNavigate();

  const getImageUrl = (imageName) => {
    if (!imageName) return "/placeholder.jpg";
    if (imageName.startsWith("http")) {
      return imageName;
    }
    return `${API_BASE_URL_IMG}/uploads/${imageName}`;
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(id);
      setIsDeleted(true);
      setShowConfirm(false);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const handleQuantityChange = (val) => {
    const value = parseInt(val);
    if (isNaN(value) || value < 1) {
      setQuantitySelected(1);
    } else if (value > availableStock) {
      setQuantitySelected(availableStock);
    } else {
      setQuantitySelected(value);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!article || availableStock <= 0) return;
    setLastAddedQty(quantitySelected);
    addToCart(article, quantitySelected);
    setShowNotification(true);
    const remainingAfterAdd = availableStock - quantitySelected;
    setQuantitySelected(remainingAfterAdd > 0 ? 1 : 0);
    setTimeout(() => {
      setShowNotification(false);
    }, 2500);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
        if (data && data.images && data.images.length > 0) {
          setCurrentImageIndex(data.mainImageIndex || 0);
        }
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
      {/* Modale d'Authentification requise */}
      {showAuthModal && (
        <div className="modalOverlay" onClick={() => setShowAuthModal(false)}>
          <div className="confirmBox authModal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-icon-circle">
              <Lock style={{ fontSize: "3rem", color: "#f44336" }} />
            </div>
            <h3>Connexion requise</h3>
            <p>Veuillez vous connecter pour ajouter des articles au panier.</p>
            <div className="confirmActions">
              <button className="buttonValidate" onClick={() => navigate("/login")}>
                Se connecter
              </button>
              <button className="buttonCancel" onClick={() => setShowAuthModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de succès Suppression */}
      {isDeleted && (
        <div className="confirmModal">
          <div className="confirmBox successAnim">
            <div className="success-icon-circle">
              <Done style={{ fontSize: "4rem", color: "#fff" }} />
            </div>
            <h3>Article supprimé !</h3>
            <p>Redirection vers l'accueil...</p>
          </div>
        </div>
      )}

      {showNotification && (
        <div className="cart-modal-overlay">
          <div className="cart-modal-content">
            <div className="cart-modal-icon">
              <Done style={{ fontSize: "3rem", color: "#4caf50" }} />
            </div>
            <h3>Ajouté au panier !</h3>
            <p>
              <strong>{lastAddedQty} x</strong> {article.titre}
            </p>
            <button
              onClick={() => setShowNotification(false)}
              className="close-modal-btn"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      )}

      <h2>{article.titre}</h2>
      <div className="articleDetailContent">
        <div className="imagesGallery">
          <div className="mainImageContainer">
            <img
              src={getImageUrl(article.images[currentImageIndex])}
              alt={article.titre}
              className="mainImage"
              onClick={() => setSelectedImage(getImageUrl(article.images[currentImageIndex]))}
            />
          </div>

          {article.images.length > 1 && (
            <div className="thumbnailRow">
              {article.images.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  alt={`Miniature ${i + 1}`}
                  className={`thumbnailImage ${
                    i === currentImageIndex ? "activeThumb" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(i)}
                />
              ))}
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
              <strong>Catégorie :</strong> {article.categorie}
            </p>
            <p>
              <strong>Quantité disponible:</strong>{" "}
              {article.quantite !== availableStock
                ? availableStock
                : article.quantite}
            </p>
          </div>
          {quantityInCart > 0 && (
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              ({quantityInCart} déjà dans votre panier)
            </p>
          )}
          <div className="purchaseActions">
            <div className="quantitySelector">
              <button
                className="qtyBtn"
                onClick={() => handleQuantityChange(quantitySelected - 1)}
                disabled={quantitySelected <= 1}
              >
                <Remove />
              </button>

              <input
                type="number"
                value={quantitySelected}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="qtyInput"
                name="quantity"
              />

              <button
                className="qtyBtn"
                onClick={() => handleQuantityChange(quantitySelected + 1)}
                disabled={quantitySelected >= availableStock}
              >
                <Add />
              </button>
            </div>
          </div>
          <div className="articleButtonDetail">
            <button onClick={handleAddToCart} disabled={availableStock <= 0}>
              <ShoppingCart />
              {availableStock <= 0
                ? "Rupture de stock"
                : "Ajouter au panier"}
            </button>
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
