import { Link } from "react-router-dom";
import { API_BASE_URL_IMG, getArticles } from "../../Services/api";
import "./home.css";
import { useEffect, useState, useMemo } from "react";
import { Sort, Category, ShoppingBag } from "@mui/icons-material";

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
          if (!categoryMap[article.categorie])
            categoryMap[article.categorie] = article;
        }
        setRecentByCategory(categoryMap);

        const categories = Object.keys(categoryMap);
        if (categories.length > 0) {
          const lcpArt = categoryMap[categories[0]];
          const lcpImg = lcpArt.images[lcpArt.mainImageIndex || 0];

          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = getImageUrl(lcpImg, 300);
          link.imageSrcset = `${getImageUrl(lcpImg, 300)} 1x, ${getImageUrl(
            lcpImg,
            600
          )} 2x`;
          link.imageSizes = "233px";
          link.fetchPriority = "high";
          link.crossOrigin = "anonymous";
          document.head.appendChild(link);
        }
      } catch (err) {
        setError("Erreur de connexion au catalogue.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const SkeletonCard = () => (
    <div className="articleCard skeleton">
      <div className="skeletonImg"></div>
      <div className="cardInfo">
        <div className="skeletonText title"></div>
        <div className="skeletonText price"></div>
      </div>
    </div>
  );

  if (error)
    return (
      <div className="homeContainer">
        <p className="message error">{error}</p>
      </div>
    );

  return (
    <div className="homeContainer">
      {loading ? (
        <>
          <div className="skeletonMainTitle"></div>
          <div className="skeletonSort"></div>
          <div className="sectionHeader">
            <Category className="sectionIcon" />
            <h2>Par catégories</h2>
          </div>
          <div className="articlesGrid">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        </>
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

          <div className="sectionHeader">
            <Category className="sectionIcon" />
            <h2>Par catégories</h2>
          </div>
          <div className="articlesGrid">
            {Object.entries(recentByCategory).map(
              ([categorie, article], index) => (
                <Link
                  to={`/categorie/${encodeURIComponent(categorie)}`}
                  key={categorie}
                  className="articleCard"
                >
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
                    alt={article.images}
                    crossOrigin="anonymous"
                    width="300"
                    height="160"
                    fetchPriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding={index === 0 ? "sync" : "async"}
                  />
                  <div className="cardInfo">
                    <h3 className="titreArticle">{categorie}</h3>
                  </div>
                </Link>
              )
            )}
          </div>

          <div className="sectionHeader" style={{ marginTop: "3rem" }}>
            <ShoppingBag className="sectionIcon" />
            <h2>Tout le catalogue</h2>
          </div>
          <div className="articlesGrid">
            {sortedArticles.map((article, index) => (
              <Link
                to={`/article/${article._id}`}
                key={article._id}
                className="articleCard"
              >
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
                  // On retire le lazy load pour la première ligne du catalogue aussi
                  loading={index < 2 ? "eager" : "lazy"}
                  width="300"
                  height="160"
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
