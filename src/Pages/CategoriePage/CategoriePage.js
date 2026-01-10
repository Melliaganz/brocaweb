import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL_IMG, getArticles } from "../../Services/api";
import { SearchOff, ShoppingBag, ArrowBack } from "@mui/icons-material";
import "../Homepage/home.css";

function CategoriePage() {
  const { categorie } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getImageUrl = (imageName) => {
    if (!imageName) return "/placeholder.jpg";
    if (imageName.startsWith("http")) return imageName;
    return `${API_BASE_URL_IMG}/uploads/${imageName}`;
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getArticles();
        const filtered = data.filter(
          (a) => a.categorie.toLowerCase() === categorie.toLowerCase() && a.quantite > 0
        );
        setArticles(filtered);
      } catch (err) {
        setError("Erreur lors du chargement des articles.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [categorie]);

  if (loading) {
    return (
      <div className="homeContainer">
        <span className="loader"></span>
        <p>Chargement de la catégorie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homeContainer">
        <p className="message error">{error}</p>
      </div>
    );
  }

  return (
    <div className="homeContainer">
      <div className="sectionHeader" style={{ justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingBag className="sectionIcon" />
          <h2 style={{ textTransform: 'capitalize' }}>{categorie}</h2>
        </div>
        <Link to="/" className="backLink" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'var(--secondary)' }}>
          <ArrowBack fontSize="small" /> Retour
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="emptyState">
          <SearchOff style={{ fontSize: "4rem", color: "var(--secondary)", opacity: 0.5 }} />
          <h2>Aucun article disponible</h2>
          <p>Désolé, il n'y a plus d'articles en stock dans la catégorie "{categorie}".</p>
          <Link to="/" className="btn" style={{ maxWidth: '200px', marginTop: '1rem', textAlign: 'center', textDecoration: 'none' }}>
            Voir tout le catalogue
          </Link>
        </div>
      ) : (
        <div className="articlesGrid">
          {articles.map((article) => (
            <Link
              key={article._id}
              to={`/article/${article._id}`}
              className="articleCard"
            >
              <img
                src={getImageUrl(article.images[article.mainImageIndex || 0])}
                alt={article.titre}
              />
              <div className="cardInfo">
                <h3 className="titreArticle">{article.titre}</h3>
                <p className="articlePrix">{article.prix} €</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriePage;
