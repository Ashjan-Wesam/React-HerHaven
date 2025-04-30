import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';  // استيراد SweetAlert
import '../../../assets/css/ownerStyles/CateoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // حالة لتخزين الفئة التي سيتم تعديلها
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const currentStoreId = JSON.parse(localStorage.getItem("store"))?.id;

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/owner/my-categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCategories(res.data);

      const formatted = res.data.map(cat => ({
        label: cat.name,
        value: cat.name
      }));

      setOptions(formatted);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Failed to fetch categories.";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/owner/categories/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          data: { store_id: currentStoreId }
        });
        setMessage("Category deleted successfully.");
        setIsError(false);
        fetchCategories();
        Swal.fire(
          'Deleted!',
          'Your category has been deleted.',
          'success'
        );
      } catch (error) {
        const errorMessage = error.response ? error.response.data.message : "Failed to delete category.";
        setMessage(errorMessage);
        setIsError(true);
        Swal.fire(
          'Error!',
          'There was an error deleting the category.',
          'error'
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const unique = [...new Set(selectedOptions.map(opt => opt.value))];

    if (!currentStoreId) {
      setMessage("Store ID not found.");
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/owner/categories', {
        categories: unique.map(name => ({ name })),
        store_id: currentStoreId
      });

      setMessage("Categories added successfully.");
      fetchCategories();
    } catch (err) {
      console.error(err);
      setMessage("Failed to add categories.");
    }
  };

  // دالة تعديل الفئة
  const handleEdit = (category) => {
    setEditingCategory(category); // تحديد الفئة التي سيتم تعديلها
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No category selected for update.',
      });
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/owner/categories/${editingCategory.id}`, {
        name: editingCategory.name,
        store_id: currentStoreId
      });

      setMessage("Category updated successfully.");
      setIsError(false);
      fetchCategories();
      Swal.fire(
        'Updated!',
        'Your category has been updated.',
        'success'
      );
      setEditingCategory(null); // إغلاق نافذة التعديل بعد النجاح
    } catch (err) {
      setMessage("Failed to update category.");
      setIsError(true);
      Swal.fire(
        'Error!',
        'There was an error updating the category.',
        'error'
      );
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

      {/* Form for adding new categories */}
      <form onSubmit={handleSubmit} className="category-form">
        <h3>Add or Select Categories</h3>
        <CreatableSelect
          isMulti
          options={options}
          onChange={handleChange}
          value={selectedOptions}
          placeholder="Select or create categories..."
        />
        <button type="submit">Add Categories</button>
      </form>

      {/* List of categories */}
      <ul className="categories-list">
        {categories.map(cat => (
          <li key={cat.id} className="category-item">
            <strong className="category-name">{cat.name}</strong>
            <span className="category-description">- {cat.description}</span>
            <div className="category-actions">
              <button
                onClick={() => handleEdit(cat)} 
                className="edit-category-btn"
              >
                Edit
              </button>
              <Link to={`/owner/categories/show/${cat.id}`} className="show-category-btn">
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

      {/* Modal for editing category */}
      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Category</h3>
            <form onSubmit={handleUpdateCategory}>
              <label>Category Name</label>
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              />
              <br />
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditingCategory(null)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;


