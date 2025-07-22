import { Link } from "react-router-dom";
import { getArticles } from "../../Services/api";
import "./home.css";
import { useEffect, useState } from "react";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setArticles(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div style={{marginTop: "2rem"}}>
    <span className="loader"></span>
    Chargement des articles...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="homeContainer">
      <h1>Publications récentes</h1>
      <div className="articlesGrid">
        {articles.slice(0, 5).map((article) => (
          <Link
            to={`/article/${article._id}`}
            key={article._id}
            className="articleCard"
          >
            <img
              src={`http://localhost:5000/uploads/${article.image}`}
              alt={article.titre}
            />
            <h3>{article.titre}</h3>
            <p>{article.description}</p>
            <p>
              <strong>{article.prix} €</strong>
            </p>
          </Link>
        ))}
      </div>

      <h2>Tout le catalogue</h2>
      <div className="articlesGrid">
        {articles.map((article) => (
          <Link
            to={`/article/${article._id}`}
            key={article._id}
            className="articleCard"
          >
              <img
                src={`http://localhost:5000/uploads/${article.image}`}
                alt={article.titre}
              />
              <h3>{article.titre}</h3>
              <p>{article.description}</p>
              <p>
                <strong>{article.prix} €</strong>
              </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
