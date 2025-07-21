import { getArticles } from '../../Services/api';
import './home.css';
import { useEffect, useState } from 'react';

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        // on suppose que tu veux les articles les plus récents en haut
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setArticles(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Chargement des articles...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="homeContainer">
      <h1>Publications récentes</h1>
      <div className="articlesGrid">
        {articles.slice(0, 5).map((article) => (
          <div key={article._id} className="articleCard">
            <img src={`http://localhost:5000/uploads/${article.image}`} alt={article.titre} />
            <h3>{article.titre}</h3>
            <p>{article.description}</p>
            <p><strong>{article.prix} €</strong></p>
          </div>
        ))}
      </div>

      <h2>Tout le catalogue</h2>
      <div className="articlesGrid">
        {articles.map((article) => (
          <div key={article._id} className="articleCard">
            <img src={`http://localhost:5000/uploads/${article.image}`} alt={article.titre} />
            <h3>{article.titre}</h3>
            <p>{article.description}</p>
            <p><strong>{article.prix} €</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
