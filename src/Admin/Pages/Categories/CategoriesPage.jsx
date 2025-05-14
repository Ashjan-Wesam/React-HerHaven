import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../assets/css/adminStyles/category.css'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      fetchCategories();
    } catch (err) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
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

      <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

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
        <button type="submit">{editId ? 'Update' : 'Create'} Category</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ name: '', description: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <>
          <table className="categories-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td>
                    <button onClick={() => handleEdit(cat)}>Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesPage;
