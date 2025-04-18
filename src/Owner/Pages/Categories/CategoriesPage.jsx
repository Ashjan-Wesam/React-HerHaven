import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../assets/css/ownerStyles/CateoriesPage.css'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const token = localStorage.getItem('token');
const currentStoreId = JSON.parse(localStorage.getItem("store"))?.id; 


  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/owner/my-categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Failed to fetch categories.";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {

      await axios.delete(`http://127.0.0.1:8000/api/owner/categories/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` } ,
        data: { store_id: currentStoreId }
      });
      setMessage("Category deleted successfully.");
      setIsError(false);
      fetchCategories(); 
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Failed to delete category.";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div className="categories-container">
      <h2 className="categories-header">My Categories</h2>
      {message && (
        <p className={`categories-message ${isError ? 'error' : ''}`}>
          {message}
        </p>
      )}
      <Link to="/owner/categories/create" className="add-category-btn">
        Add New Category
      </Link>
      <ul className="categories-list">
        {categories.map(cat => (
          <li key={cat.id} className="category-item">
            <strong className="category-name">{cat.name}</strong>
            <span className="category-description">- {cat.description}</span>
            <div className="category-actions">
              <Link 
                to={`/owner/categories/edit/${cat.id}`} 
                className="edit-category-link"
              >
                Edit
              </Link>
              <Link 
  to={`/owner/categories/show/${cat.id}`} 
  className="edit-category-link"
>
  Show
</Link>

              <button 
                onClick={() => handleDelete(cat.id)} 
                className="delete-category-btn"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
