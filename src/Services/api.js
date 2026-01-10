export const API_BASE_URL_IMG = process.env.REACT_APP_API_IMG_URL;
const API_BASE_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { message: "Erreur de lecture des données serveur." };
  }

  if (res.status === 401) {
    localStorage.removeItem("token");
    // On évite la redirection brutale si on est déjà sur login
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  if (!res.ok) throw new Error(data.message || "Une erreur est survenue");
  return data;
};

export const register = async ({ nom, email, motDePasse }) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, email, motDePasse }),
  });
  return handleResponse(res);
};

export const login = async (email, motDePasse) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, motDePasse }),
  });
  return handleResponse(res);
};

export const adminCreateUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/auth/admin/create-user`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
};

export const getArticles = async () => {
  const res = await fetch(`${API_BASE_URL}/articles`);
  return handleResponse(res);
};

export const getArticleById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`);
  return handleResponse(res);
};

export const createArticle = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/articles`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });
  return handleResponse(res);
};

export const deleteArticle = async (id) => {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const updateArticle = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: formData,
  });
  return handleResponse(res);
};

export const placeOrder = async (items) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ items }),
  });
  return handleResponse(res);
};

export const getAllOrders = async () => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const getAllUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/admin/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const updateUser = async (id, userData) => {
  const res = await fetch(`${API_BASE_URL}/auth/admin/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_BASE_URL}/auth/admin/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};
