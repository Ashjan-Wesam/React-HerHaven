import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../assets/css/ownerStyles/Products.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [discountActive, setDiscountActive] = useState(false); // حالة الخصم الفعال
  const [discountPercentage, setDiscountPercentage] = useState(0); // نسبة الخصم

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

  const fetchDiscountStatus = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/owner/discount-status', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // إذا كان الخصم فعالًا للستور الحالي
      if (res.data.discount_active) {
        setDiscountActive(true);
        setDiscountPercentage(res.data.discount_percentage); // تحديث نسبة الخصم
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

  useEffect(() => {
    fetchProducts();
    fetchDiscountStatus(); // تحقق من حالة الخصم عند تحميل الصفحة
  }, []);

  return (
    <div className="owner-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="owner-header">My Products</h2>
        <Link to="/owner/products/create" className="owner-add-btn">
          + Add Product
        </Link>
      </div>

      <div className="products-grid">
        {products.map(p => (
          <div className="product-card" key={p.id}>
            <img src={`http://127.0.0.1:8000/${p.image_url}`} alt={p.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{p.name}</h3>

              {/* عرض السعر مع الخصم إذا كان الخصم فعالًا */}
              {discountActive ? (
                <div className="product-price">
                  <span className="old-price">${parseFloat(p.price).toFixed(2)}</span>
                  <span className="new-price">${calculateDiscountedPrice(p.price)}</span>
                </div>
              ) : (
                <p className="product-price">${parseFloat(p.price).toFixed(2)}</p>
              )}

              <p className="product-stock">Stock: {p.stock_quantity}</p>

              <div className="product-actions">
                <Link to={`/owner/products/show/${p.id}`} className="owner-show-btn">Show</Link>
                <Link to={`/owner/products/edit/${p.id}`} className="owner-edit-btn">Edit</Link>
                <button onClick={() => deleteProduct(p.id)} className="owner-delete-btn">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="no-products">No products found.</p>
        )}
      </div>

      {discountActive && <p className="discount-message">Discounts are applied to your products.</p>}
    </div>
  );
};

export default Product;
