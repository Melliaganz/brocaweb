import { Link } from "react-router-dom";
import { getArticles } from "../../Services/api";
import "./home.css";
import { useEffect, useState, useMemo } from "react";
import { Sort, Category, ShoppingBag, SearchOff } from "@mui/icons-material";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentByCategory, setRecentByCategory] = useState({});
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("recent");

  const getImageUrl = (imagePath, width = 500) => {
    if (!imagePath) return "/placeholder.jpg";
    
    if (imagePath.startsWith("http")) {
      if (imagePath.includes("cloudinary.com")) {
        return imagePath.replace(
          "/upload/",
          `/upload/f_auto,q_auto,w_${width},c_scale/`
        );
      }
      return imagePath;
    }
    return `/uploads/${imagePath}`;
  };

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
        return sorted.sort((a, b) => (a.categorie || "").localeCompare(b.categorie || ""));
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
        
        const availableArticles = data.filter(
          (article) => (article.stock !== undefined ? article.stock > 0 : true)
        );
        
        setArticles(availableArticles);

        const categoryMap = {};
        const sortedForCats = [...availableArticles].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        for (const article of sortedForCats) {
          if (article.categorie && !categoryMap[article.categorie]) {
            categoryMap[article.categorie] = article;
          }
        }
        setRecentByCategory(categoryMap);

      } catch (err) {
        console.error("Erreur fetch:", err);
        setError("Erreur de connexion au catalogue.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (error) return <div className="homeContainer"><p className="message error">{error}</p></div>;

  return (
    <div className="homeContainer">
      {loading ? (
        <div className="loading">Chargement des trésors...</div>
      ) : articles.length === 0 ? (
        <div className="emptyState">
          <SearchOff style={{ fontSize: "5rem", color: "var(--secondary)", opacity: 0.5 }} />
          <h2>Le catalogue est vide</h2>
          <p>Revenez bientôt pour découvrir nos nouvelles pépites !</p>
        </div>
      ) : (
        <>
          <h1 className="mainTitle">Découvrez nos trésors</h1>

          <div className="sortControls">
            <Sort style={{ color: "var(--secondary)" }} />
            <label htmlFor="sort-select">Trier par :</label>
            <select
              id="sort-select"
              name="sortOption"
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
          
          {/* Section Par catégories */}
          {Object.keys(recentByCategory).length > 0 && (
            <>
              <div className="sectionHeader">
                <Category className="sectionIcon" />
                <h2>Par catégories</h2>
              </div>
              <div className="articlesGrid">
                {Object.entries(recentByCategory).map(([categorie, article]) => (
                  <Link to={`/categorie/${encodeURIComponent(categorie)}`} key={categorie} className="articleCard">
                    <img
                      src={getImageUrl(article.images[article.mainImageIndex || 0], 300)}
                      alt={categorie}
                      crossOrigin="anonymous"
                    />
                    <div className="cardInfo">
                      <h3 className="titreArticle">{categorie}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Section Catalogue Complet */}
          <div className="sectionHeader" style={{ marginTop: "3rem" }}>
            <ShoppingBag className="sectionIcon" />
            <h2>Tout le catalogue</h2>
          </div>
          <div className="articlesGrid">
            {sortedArticles.map((article) => (
              <Link to={`/article/${article._id}`} key={article._id} className="articleCard">
                <img
                  src={getImageUrl(article.images[article.mainImageIndex || 0], 300)}
                  alt={article.titre}
                  crossOrigin="anonymous"
                />
                <div className="cardInfo">
                  <h3 className="titreArticle">{article.titre}</h3>
                  <p className="articlePrix">{article.prix} €</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
