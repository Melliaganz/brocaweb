import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { API_BASE_URL_IMG, getArticles } from "../../Services/api";
import "../Homepage/home.css";
import { SearchOff, ShoppingBag, ArrowBack } from "@mui/icons-material";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const search = query.get("q")?.toLowerCase() || "";
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getImageUrl = (imageName) => {
    if (!imageName) return "/placeholder.jpg";
    if (imageName.startsWith("http")) return imageName;
    return `${API_BASE_URL_IMG}/uploads/${imageName}`;
  };

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        setLoading(true);
        const allArticles = await getArticles();
        const filtered = allArticles.filter(
          (article) =>
            (article.titre.toLowerCase().includes(search) ||
            (article.categorie && article.categorie.toLowerCase().includes(search))) &&
            article.quantite > 0
        );
        setArticles(filtered);
      } catch (err) {
        setError("Impossible de récupérer les articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [search]);

  if (loading) {
    return (
      <div className="homeContainer">
        <span className="loader"></span>
        <p>Recherche en cours...</p>
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
          <h2>Résultats pour "{search}"</h2>
        </div>
        <Link to="/" className="backLink" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'var(--secondary)' }}>
          <ArrowBack fontSize="small" /> Retour
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="emptyState">
          <SearchOff style={{ fontSize: "4rem", color: "var(--secondary)", opacity: 0.5 }} />
          <h2>Aucun résultat trouvé</h2>
          <p>Désolé, nous n'avons rien trouvé pour "{search}". Essayez avec d'autres mots-clés.</p>
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

export default SearchResults;
