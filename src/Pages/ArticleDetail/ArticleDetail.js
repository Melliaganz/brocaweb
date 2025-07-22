import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getArticleById } from '../../Services/api';
import './articleDetail.css';

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
    <div className="articleDetailContainer">
      <h2>{article.titre}</h2>
      <div className="articleDetailContent">
      <img
        src={`http://localhost:5050/uploads/${article.image}`}
        alt={article.titre}
        style={{ maxWidth: '400px', borderRadius: '8px' }}
      />
      <div className='articleDetailInfo'>
      <p><strong>Prix :</strong> {article.prix} €</p>
      <p><strong>Description :</strong> {article.description}</p>
      <p><strong>État :</strong> {article.etat}</p>
      </div>
      </div>
    </div>
  );
}

export default ArticleDetail;
