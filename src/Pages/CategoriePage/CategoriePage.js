import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { API_BASE_URL_IMG, getArticles } from "../../Services/api";

function CategoriePage() {
  const { categorie } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("recent");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        const filtered = data.filter(
          (a) => a.categorie.toLowerCase() === categorie.toLowerCase()
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

  const sortedArticles = useMemo(() => {
    const sorted = [...articles];

    switch (sortOption) {
      case "priceAsc":
        return sorted.sort((a, b) => a.prix - b.prix);
      case "priceDesc":
        return sorted.sort((a, b) => b.prix - a.prix);
      case "alphaAsc":
        return sorted.sort((a, b) => a.titre.localeCompare(b.titre));
      case "alphaDesc":
        return sorted.sort((a, b) => b.titre.localeCompare(a.titre));
      case "recent":
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [articles, sortOption]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!articles.length) return <p>Aucun article trouvé dans cette catégorie.</p>;

  return (
    <div className="homeContainer">
      <h2>Articles de la catégorie : {categorie}</h2>

      <div className="sortControls">
        <label htmlFor="sort">Trier par :</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="recent">Plus récents</option>
          <option value="priceAsc">Prix croissant</option>
          <option value="priceDesc">Prix décroissant</option>
          <option value="alphaAsc">A → Z</option>
          <option value="alphaDesc">Z → A</option>
        </select>
      </div>

      <div className="articlesGrid">
        {sortedArticles.map((article) => (
          <Link
            to={`/article/${article._id}`}
            key={article._id}
            className="articleCard"
          >
            <img
              src={`http://${API_BASE_URL_IMG}/uploads/${article.images[article.mainImageIndex || 0]}`}
              alt={article.titre}
            />
            <h3 className="titreArticle">{article.titre}</h3>
            <p className="articlePrix">
              <strong>{article.prix} €</strong>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoriePage;
