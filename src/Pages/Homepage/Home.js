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
       if (err.response) {
        switch (err.response.status){
          case 404:
            setError("Aucun article trouvé (erreur 404");
            break;
          case 500:
            setError("Erreur interne du serveur. Veuillez réessayer plus tard");
            break;
          case 401:
            setError("Non autorisé. Veuillez vous connecter.");
            break;
          default: 
          setError(`Erreur inconnue : ${err.response.status}`);
        }
       } else if (err.request) {
        setError("Le serveur ne répond pas. Vérifiez votre connexion.")
       } else {
        setError(`${err.message}`)
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
              src={`http://localhost:5000/uploads/${article.images[0]}`}
              alt={article.titre}
            />
            <div className="descriptifArticle">
              <h3 className="titreArticle">{article.titre}</h3>
              <p className="articlePrix">
                <strong>{article.prix} €</strong>
              </p>
            </div>
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
              src={`http://localhost:5000/uploads/${article.images[0]}`}
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
