const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Authentification
 */

// Inscription
export const register = async ({ nom, email, motDePasse }) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, email, motDePasse }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de l’inscription');
  return data;
};

// Connexion
export const login = async (email, motDePasse) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, motDePasse }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la connexion');
  return data;
};

/**
 * Articles (public)
 */

// Tous les articles
export const getArticles = async () => {
  const res = await fetch(`${API_BASE_URL}/articles`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la récupération des articles');
  return data;
};

// Article par ID
export const getArticleById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la récupération de l’article');
  return data;
};

/**
 * Articles (admin)
 */

// Création (admin)
export const createArticle = async (formData) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/articles`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // formData doit contenir titre, description, prix, état, image
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la création de l’article');
  return data;
};

// Suppression (admin)
export const deleteArticle = async (id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression de l’article');
  return data;
};
