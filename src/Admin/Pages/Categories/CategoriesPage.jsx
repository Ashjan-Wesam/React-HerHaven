import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../assets/css/adminStyles/category.css';
import notfound from '../../../assets/img/nofound.jpg';
import Loading from '../../../Owner/Components/Loading';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 12;
  const token = localStorage.getItem('token');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.name.trim().length < 3 || formData.name.trim().length > 100) {
      Swal.fire('Validation Error', 'Name must be between 3 and 100 characters.', 'warning');
      return;
    }

    if (formData.description && formData.description.length > 300) {
      Swal.fire('Validation Error', 'Description must not exceed 300 characters.', 'warning');
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://127.0.0.1:8000/api/admin/categories/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Updated!', 'Category updated successfully', 'success');
      } else {
        await axios.post('http://127.0.0.1:8000/api/admin/categories', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Created!', 'Category created successfully', 'success');
      }
      setFormData({ name: '', description: '' });
      setEditId(null);
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/admin/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        fetchCategories();
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete category.', 'error');
      }
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <div className="categories-container">
      <div className="cat-header" style={{ marginBottom: "2rem" }}>
        <div className="cat-search-container">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cat-search-input"
          />
          <i className="fas fa-search cat-search-icon"></i>
        </div>
        <button className="add-user-btn" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Add Category
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <table className="admin-table">
            <thead className="admin-thead">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>
                    <td>{cat.description}</td>
                    <td style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center" }}>
                      <button onClick={() => handleEdit(cat)} className="edit-category-btn">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="delete-category-btn">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '1rem', fontStyle: 'italic', color: '#888' }}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="owner-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <div className='div-nums'>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editId ? 'Edit Category' : 'Add Category'}</h3>
            <form className="category-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Category Name"
                value={formData.name}
                maxLength={100}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                maxLength={300}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="modal-buttons">
                <button type="submit" className='editBtn'>
                  {editId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className='cancelBtn'
                  onClick={() => {
                    setEditId(null);
                    setFormData({ name: '', description: '' });
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
