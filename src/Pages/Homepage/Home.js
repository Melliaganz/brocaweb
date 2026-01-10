import { Link } from "react-router-dom";
import { API_BASE_URL_IMG, getArticles } from "../../Services/api";
import "./home.css";
import { useEffect, useState, useMemo } from "react";
import { Sort, Category, ShoppingBag, Inventory } from "@mui/icons-material";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentByCategory, setRecentByCategory] = useState({});
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("recent");

  const getImageUrl = (imageName, width = 500) => {
    if (!imageName) return "/placeholder.jpg";
    if (imageName.startsWith("https://res.cloudinary.com")) {
      return imageName.replace(
        "/upload/",
        `/upload/f_auto,q_auto,w_${width},c_scale/`
      );
    }
    if (imageName.startsWith("http")) return imageName;
    return `${API_BASE_URL_IMG}/uploads/${imageName}`;
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
        return sorted.sort((a, b) => a.categorie.localeCompare(b.categorie));
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
          (article) => article.quantite > 0
        );
        setArticles(availableArticles);

        const categoryMap = {};
        const sortedForCats = [...availableArticles].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        for (const article of sortedForCats) {
          if (!categoryMap[article.categorie]) {
            categoryMap[article.categorie] = article;
          }
        }
        setRecentByCategory(categoryMap);
      } catch (err) {
        setError("Erreur de connexion au catalogue.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    if (sortedArticles.length > 0) {
      const firstArticle = sortedArticles[0];
      const mainImg = firstArticle.images[firstArticle.mainImageIndex || 0];

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = getImageUrl(mainImg, 300);
      link.imageSrcset = `${getImageUrl(mainImg, 300)} 1x, ${getImageUrl(
        mainImg,
        600
      )} 2x`;
      link.imageSizes = "233px"; // Correspond à la largeur réelle de l'image dans ta grille CSS
      link.crossOrigin = "anonymous";
      link.fetchPriority = "high";
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) document.head.removeChild(link);
      };
    }
  }, [sortedArticles]);

  if (loading) {
    return (
      <div className="homeContainer">
        <span className="loader"></span>
        <p>Chargement des pépites...</p>
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
      {articles.length === 0 ? (
        <div className="emptyState">
          <Inventory
            style={{
              fontSize: "4rem",
              color: "var(--secondary)",
              opacity: 0.5,
            }}
          />
          <h2>Aucun article disponible</h2>
          <p>Revenez plus tard pour découvrir nos nouveautés.</p>
        </div>
      ) : (
        <>
          <h1 className="mainTitle">Découvrez nos trésors</h1>

          <div className="sortControls">
            <Sort style={{ color: "var(--secondary)" }} />
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

          <div className="sectionHeader">
            <Category className="sectionIcon" />
            <h2>Par catégories</h2>
          </div>

          <div className="articlesGrid">
            {Object.entries(recentByCategory).map(([categorie, article]) => (
              <div key={categorie} className="articleCard categoryCard">
                <Link
                  to={`/categorie/${encodeURIComponent(categorie)}`}
                  key={article._id}
                  className="articleCard categoryCard"
                >
                  {" "}
                  <img
                    src={getImageUrl(
                      article.images[article.mainImageIndex || 0],
                      300
                    )}
                    srcSet={`${getImageUrl(
                      article.images[article.mainImageIndex || 0],
                      300
                    )} 1x, ${getImageUrl(
                      article.images[article.mainImageIndex || 0],
                      600
                    )} 2x`}
                    sizes="233px"
                    alt={categorie}
                    crossOrigin="anonymous"
                    loading="lazy"
                  />
                  <div className="cardInfo">
                    <h3 className="titreArticle">{categorie}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="sectionHeader" style={{ marginTop: "3rem" }}>
            <ShoppingBag className="sectionIcon" />
            <h2>Tout le catalogue</h2>
          </div>

          <div className="articlesGrid">
            {sortedArticles.map((article, index) => (
              <div key={article._id} className="articleCard">
                <Link to={`/article/${article._id}`}>
                  <img
                    src={getImageUrl(
                      article.images[article.mainImageIndex || 0],
                      300
                    )}
                    srcSet={`${getImageUrl(
                      article.images[article.mainImageIndex || 0],
                      300
                    )} 1x, ${getImageUrl(
                      article.images[article.mainImageIndex || 0],
                      600
                    )} 2x`}
                    sizes="233px"
                    alt={article.titre}
                    crossOrigin="anonymous"
                    fetchpriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="cardInfo">
                    <h3 className="titreArticle">{article.titre}</h3>
                    <p className="articlePrix">{article.prix} €</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
