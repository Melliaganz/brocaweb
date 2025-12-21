import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById, deleteArticle, API_BASE_URL } from "../../Services/api";
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
} from "@mui/icons-material";

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantitySelected, setQuantitySelected] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lastAddedQty, setLastAddedQty] = useState(0);

  const { user } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);

  const itemInCart = (cartItems || []).find((item) => item._id === id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  const availableStock = article ? article.quantite - quantityInCart : 0;

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteArticle(id);
      navigate("/");
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
    if (article) {
      setCurrentImageIndex(article.mainImageIndex || 0);
    }
  }, [article]);

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
              src={`http://${API_BASE_URL_IMG}/uploads/${article.images[currentImageIndex]}`}
              alt={article.titre}
              className="mainImage"
              width={300}
              height={200}
            />
          </div>

          {article.images.length > 1 && (
            <div className="thumbnailRow">
              {article.images.map(
                (img, i) =>
                  i !== (article.mainImageIndex || 0) && (
                    <img
                      key={i}
                      src={`http://${API_BASE_URL_IMG}/uploads/${img}`}
                      alt={`Miniature ${i + 1}`}
                      className={`thumbnailImage ${
                        i === currentImageIndex ? "activeThumb" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(i)}
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
              (Vous en avez déjà {quantityInCart} dans votre panier)
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
              />

              <button
                className="qtyBtn"
                onClick={() => handleQuantityChange(quantitySelected + 1)}
                disabled={quantitySelected >= availableStock}
              >
                <Add />
              </button>
            </div>
            {quantitySelected >= article.quantite && (
              <span className="stockLimitLabel">Limite de stock atteinte</span>
            )}
          </div>
          <div className="articleButtonDetail">
            <button onClick={handleAddToCart} disabled={availableStock <= 0}>
              <ShoppingCart />
              {article.quantite === 0
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
