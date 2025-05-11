import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../assets/css/ownerStyles/Products.css';
import notfound from '../../../assets/img/nofound.jpg';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [discountActive, setDiscountActive] = useState(false); 
  const [discountPercentage, setDiscountPercentage] = useState(0); 
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchProducts();
    fetchDiscountStatus();
    fetchCategories();
  }, []);

  const clearFilters = () => {
  setSearchTerm('');
  setStockFilter('all');
  setSelectedCategory('all');
  setCurrentPage(1);
};

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/owner/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/owner/my-categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data || error.message);
    }
  };

  const fetchDiscountStatus = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/owner/discount-status', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.discount_active) {
        setDiscountActive(true);
        setDiscountPercentage(res.data.discount_percentage); 
      } else {
        setDiscountActive(false);
      }
    } catch (error) {
      console.error('Error checking discount status:', error.response?.data || error.message);
    }
  };

  const calculateDiscountedPrice = (price) => {
    if (!discountActive || !discountPercentage) return price;
    return (price - (price * (discountPercentage / 100))).toFixed(2);
  };

  const deleteProduct = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/owner/products/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setProducts(products.filter(p => p.id !== id));
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting product:', error.response?.data || error.message);
          Swal.fire('Error!', 'There was an error deleting the product.', 'error');
        }
      }
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'in' && p.stock_quantity > 0) ||
                        (stockFilter === 'out' && p.stock_quantity === 0);
    const matchesCategory = selectedCategory === 'all' || p.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesStock && matchesCategory;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="owner-container" style={{ padding: "30px" }}>
      <div className="filter-bar">
        <Link to="/owner/products/create" className="add-user-btn">+ Add New Product</Link>
        <div className="filters-group">
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="input-filter">
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input-filter">
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button onClick={clearFilters} className="clear-filter-btn">
             <i className="fas fa-filter-circle-xmark" style={{ marginRight: '8px' }}></i>
            Clear Filters
            </button>
        </div>
      </div>

      <div className="cat-search-container">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cat-search-input"
        />
        <i className="fas fa-search cat-search-icon"></i>
      </div>

    <div className="owner-products-flex">
  {currentProducts.map(p => (
    <div className="owner-product-card" key={p.id}>
      <div className="owner-product-image-container">
        <img src={`http://127.0.0.1:8000/${p.image_url}`} alt={p.name} className="product-image" />
        
        <div className="owner-product-category-badge">
          <p className='owner-badge-cat'>{p.category ? p.category.name : "Unknown"}</p>
        </div>
      </div>

      <div className="owner-product-info">
        <h3 className="owner-product-name">{p.name}</h3>

        {discountActive ? (
          <div className="owner-product-price">
            <span className="owner-old-price">JOD{parseFloat(p.price).toFixed(2)}</span>
            <span className="owner-new-price">JOD{calculateDiscountedPrice(p.price)}</span>
          </div>
        ) : (
          <p className="owner-product-stock">Price: JOD{parseFloat(p.price).toFixed(2)}</p>
        )}

        <p className="owner-product-stock">Stock: {p.stock_quantity}</p>

        <div className="category-actions" style={{ justifyContent: "center" }}>
           
          <Link to={`/owner/products/show/${p.id}`} className="show-category-btn"><i className="fas fa-eye"></i></Link>
          <Link to={`/owner/products/edit/${p.id}`} className="edit-category-btn"><i className="fas fa-edit"></i></Link>
          <button onClick={() => deleteProduct(p.id)} className="delete-category-btn"><i className="fas fa-trash-alt"></i></button>
        </div>
      </div>
    </div>
  ))}

  {filteredProducts.length === 0 && (
    <div style={{ margin: "auto" }} className="cat-no-products">
      <img src={notfound} alt="No products" className="cat-no-products-img" />
      <p>No products match your search/filter.</p>
    </div>
  )}
</div>




      {/* Pagination Buttons */}
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
          ))}</div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
             <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}


      {discountActive && <p className="discount-message">Discounts are applied to your products.</p>}
    </div>
  );
};

export default Product;
