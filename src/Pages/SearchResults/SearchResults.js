import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticles } from "../../Services/api";
import "./searchResults.css";

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(useLocation().search).get("q") || "";

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const all = await getArticles();
      const filtered = all.filter((a) =>
        a.titre.toLowerCase().includes(query.toLowerCase()) ||
        (a.categorie && a.categorie.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
      setLoading(false);
    };
    fetch();
  }, [query]);

  if (loading) return <div style={{ padding: "2rem" }}>Chargement...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Résultats pour “{query}”</h2>
      {results.length === 0 && <p>Aucun article trouvé.</p>}
      <div className="articlesGrid">
        {results.map((article) => (
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

export default SearchResults;
