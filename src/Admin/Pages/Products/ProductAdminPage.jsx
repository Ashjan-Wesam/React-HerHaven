import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assets/css/adminStyles/Products.css';

const ProductAdminPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ store_id: '', category_id: '', search: '' });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStores();
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allProducts]);

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/stores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (error) {
      console.error('Failed to load stores:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllProducts(res.data); 
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    if (filters.store_id) {
      filtered = filtered.filter(p => p.store_id === parseInt(filters.store_id));
    }

    if (filters.category_id) {
      filtered = filtered.filter(p => p.category_id === parseInt(filters.category_id));
    }

    if (filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    setProducts(filtered);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (productId) => {
    // Redirect to the edit page or open a modal for editing
    window.location.href = `/admin/products/edit/${productId}`;
  };

  const handleShow = (productId) => {
    // Redirect to the product detail page or open a modal for viewing details
    window.location.href = `/admin/products/show/${productId}`;
  };

  return (
    <div className="admin-products-container">
      <div className="admin-filters">
        <select name="store_id" value={filters.store_id} onChange={handleFilterChange}>
          <option value="">All Stores</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>{store.store_name}</option>
          ))}
        </select>

        <select name="category_id" value={filters.category_id} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="search"
          placeholder="Search..."
          value={filters.search}
          onChange={handleFilterChange}
        />
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <div className="admin-card-grid">
          {products.map((product) => (
            <div className="admin-product-card" key={product.id}>
              <img
                src={`http://127.0.0.1:8000/${product.image_url}`}
                alt={product.name}
              />
              <div style={{ padding: "20px" }} >
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
             
              {/* Buttons for Edit, Delete, Show */}
              <div className="admin-product-actions">
                <button className='view' onClick={() => handleShow(product.id)}>Show</button>
                <button className='btn-edit' onClick={() => handleEdit(product.id)}>Edit</button>
                <button className='btn-delete' onClick={() => handleDelete(product.id)}>Delete</button>
              </div></div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductAdminPage;
