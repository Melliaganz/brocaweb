import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { API_BASE_URL_IMG, getArticles } from "../../Services/api";
import "../Homepage/home.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const search = query.get("q")?.toLowerCase() || "";
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        const allArticles = await getArticles();
        const filtered = allArticles.filter(
          (article) =>
            article.titre.toLowerCase().includes(search) ||
            (article.categorie &&
              article.categorie.toLowerCase().includes(search))
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

  if (loading) return <div className="homeContainer">Chargement...</div>;
  if (error) return <div className="homeContainer">Erreur : {error}</div>;

  return (
    <div className="homeContainer">
      <h2>Résultats pour "{search}"</h2>
      {articles.length === 0 ? (
        <p>Aucun article trouvé.</p>
      ) : (
        <div className="articlesGrid">
          {articles.map((article) => (
            <Link
              key={article._id}
              to={`/article/${article._id}`}
              className="articleCard"
            >
              <img
                src={`${API_BASE_URL_IMG}/uploads/${
                  article.images[article.mainImageIndex || [0]]
                }`}
                alt={article.titre}
                width={300}
                height={200}
                style={{ height: "auto" }}
              />
              <h3 className="titreArticle">{article.titre}</h3>
              <p className="articlePrix">
                <strong>{article.prix} €</strong>
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
