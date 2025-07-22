import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getArticleById } from '../../Services/api';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!article) return <p>Article introuvable.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{article.titre}</h2>
      <img
        src={`http://localhost:5000/uploads/${article.image}`}
        alt={article.titre}
        style={{ maxWidth: '400px', borderRadius: '8px' }}
      />
      <p><strong>Prix :</strong> {article.prix} €</p>
      <p><strong>Description :</strong> {article.description}</p>
      <p><strong>État :</strong> {article.etat}</p>
    </div>
  );
}

export default ArticleDetail;
