import { Link } from "react-router-dom";
import { getArticles } from "../../Services/api";
import "./home.css";
import { useEffect, useState } from "react";
import { useMemo } from "react";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentByCategory, setRecentByCategory] = useState({});
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("recent");

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
      case "categorie":
        return sorted.sort((a, b) => a.categorie.localeCompare(b.categorie));
      case "recent":
      default:
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  }, [articles, sortOption]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        if (data && data.length > 0) {
          console.log("Premier article reçu :", data[0].titre);
        } else {
          console.log("Aucun article en base de données.");
        }
        const availableArticles = data.filter(
          (article) => article.quantite > 0
        );

        const sorted = availableArticles.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setArticles(sorted);

        const categoryMap = {};
        for (const article of sorted) {
          if (!categoryMap[article.categorie]) {
            categoryMap[article.categorie] = article;
          }
        }
        setRecentByCategory(categoryMap);
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 404:
              setError("Aucun article trouvé (erreur 404");
              break;
            case 500:
              setError(
                "Erreur interne du serveur. Veuillez réessayer plus tard"
              );
              break;
            case 401:
              setError("Non autorisé. Veuillez vous connecter.");
              break;
            default:
              setError(`Erreur inconnue : ${err.response.status}`);
          }
        } else if (err.request) {
          setError("Le serveur ne répond pas. Vérifiez votre connexion.");
        } else {
          setError(`${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading)
    return (
      <div className="homeContainer">
        <span className="loader"></span>
        Chargement des articles...
      </div>
    );
  if (error) return <div className="homeContainer">Erreur : {error}</div>;
  if (!articles.length)
    return (
      <div className="homeContainer">
        <h2>Aucun article n’est actuellement en vente.</h2>
      </div>
    );

  return (
    <div className="homeContainer">
      <h1>Publications récentes</h1>
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
          <option value="categorie">Catégorie</option>
        </select>
      </div>

      <h2>Catégories</h2>
      <div className="articlesGrid">
        {Object.entries(recentByCategory).map(([categorie, article]) => (
          <Link
            to={`/categorie/${categorie}`}
            key={article._id}
            className="articleCard"
          >
            <img
              src={`http://localhost:5000/uploads/${
                article.images[article.mainImageIndex || 0]
              }`}
              alt={article.titre}
              width={300}
              height={200}
            />
            <div className="descriptifArticle">
              <h3 className="titreArticle"> Catégorie : {categorie}</h3>
            </div>
          </Link>
        ))}
      </div>

      <h2>Tout le catalogue</h2>
      <div className="articlesGrid">
        {sortedArticles.map((article) => (
          <Link
            to={`/article/${article._id}`}
            key={article._id}
            className="articleCard"
          >
            <img
              src={`http://localhost:5000/uploads/${
                article.images[article.mainImageIndex || 0]
              }`}
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

export default Home;
