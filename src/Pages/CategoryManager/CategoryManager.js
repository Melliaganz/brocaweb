import React, { useState, useEffect } from "react";
import { getCategories, createCategory, deleteCategory } from "../../Services/api";
import { Delete, Add, Category, ErrorOutline } from "@mui/icons-material";
import "./categoryManager.css";

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError("Erreur lors du chargement des catégories.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");
    if (!newCategoryName.trim()) return;

    try {
      const created = await createCategory(newCategoryName.trim());
      setCategories([...categories, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategoryName("");
    } catch (err) {
      setError(err.message || "Erreur lors de la création.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
    setError("");
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="categoryManagerContainer">
      <div className="categoryHeader">
        <Category />
        <h2>Gestion des Catégories</h2>
      </div>

      {error && (
        <div className="categoryError">
          <ErrorOutline /> {error}
        </div>
      )}

      <form className="addCategoryForm" onSubmit={handleAddCategory}>
        <input
          type="text"
          placeholder="Nouvelle catégorie (ex: Miroirs, Lampes...)"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button type="submit" className="addCatBtn">
          <Add /> Ajouter
        </button>
      </form>

      <div className="categoriesList">
        {categories.length === 0 ? (
          <p className="noData">Aucune catégorie créée.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="categoryItem">
              <span>{cat.name}</span>
              <button 
                className="deleteCatBtn" 
                onClick={() => handleDelete(cat._id)}
                title="Supprimer"
              >
                <Delete fontSize="small" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryManager;
