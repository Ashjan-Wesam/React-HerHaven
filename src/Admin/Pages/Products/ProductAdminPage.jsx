import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../assets/css/adminStyles/Products.css';
import notfound from '../../../assets/img/nofound.jpg';
import Loading from '../../../Owner/Components/Loading';

const ProductAdminPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ store_id: '', category_id: '', search: '' });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
    setCurrentPage(1); // reset page when filter changes
  };

  const handleClearFilters = () => {
    setFilters({ store_id: '', category_id: '', search: '' });
    setCurrentPage(1); // reset page when filters cleared
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't delete this product!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(products.filter(product => product.id !== productId));
        Swal.fire(
          'Deleted!',
          'Your product has been deleted.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire(
          'Error!',
          'Failed to delete the product',
          'error'
        );
      }
    }
  };

  // Pagination slice
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="admin-products-container">
      <div className="cat-search-container">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          value={filters.search}
          onChange={handleFilterChange}
          className="cat-search-input"
        />
        <i className="fas fa-search cat-search-icon"></i>
      </div>

      <div className="filter-bar">
        <Link to="/admin/products/create" className="add-user-btn">+ Add New Product</Link>

        <div className="filters-group">
          <select name="store_id" value={filters.store_id} onChange={handleFilterChange} className="input-filter">
            <option value="">All Stores</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.store_name}</option>
            ))}
          </select>

          <select name="category_id" value={filters.category_id} onChange={handleFilterChange} className="input-filter">
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button onClick={handleClearFilters} className="clear-filter-btn">
            <i className="fas fa-filter-circle-xmark" style={{ marginRight: '8px' }}></i>
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : products.length > 0 ? (
        <>
          <div className="admin-card-grid">
            {paginatedProducts.map((product) => (
              <div className="admin-product-card" key={product.id}>
                <img
                  src={`http://127.0.0.1:8000/${product.image_url}`}
                  alt={product.name}
                />
                <div style={{ padding: "20px" }} >
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p><strong>Price:</strong> ${product.price}</p>

                  <div className="admin-product-actions">
                    <button onClick={() => handleDelete(product.id)} className="delete-category-btn"><i className="fas fa-trash-alt"></i></button>
                    <Link to={`/admin/products/edit/${product.id}`} className="edit-category-btn"><i className="fas fa-edit"></i></Link>
                    <Link to={`/admin/products/show/${product.id}`} className="show-category-btn"><i className="fas fa-eye"></i></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="owner-pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className='div-nums'>
              {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </>
      ) : (
        <div style={{ margin: "auto" }} className="cat-no-products">
          <img src={notfound} alt="No products" className="cat-no-products-img" />
          <p>No products match your search/filter.</p>
        </div>
      )}
    </div>
  );
};

export default ProductAdminPage;
