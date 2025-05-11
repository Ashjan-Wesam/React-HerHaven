import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/ownerStyles/Products.css';
import Loading from '../../Components/Loading';


const ProductShow = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/owner/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProduct(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching product details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (isLoading) return (
   <Loading />
  );

  if (error) return (
    <div className="owner-product-error">
      <div className="owner-error-message">{error}</div>
      <Link to="/owner/products" className="owner-error-back-link">
        Back to Products
      </Link>
    </div>
  );

  return (
    <div className="owner-product-show-container">
      <div className="owner-product-card-show">
        <div className="owner-product-header">
          <h1 className="owner-product-title">{product.name}</h1>
          <span className="owner-product-category">{product.category?.name || 'N/A'}</span>
        </div>
        
        {product.image_url && (
          <div className="owner-product-image-container">
            <img 
              src={`http://127.0.0.1:8000/${product.image_url}`}
              alt={product.name} 
              className="owner-product-image" 
            />
          </div>
        )}
        
        <div className="owner-product-details">
          <p className="owner-product-description">{product.description}</p>
          
          <div className="owner-product-meta">
            <div className="owner-meta-item">
              <span className="owner-meta-label">Price</span>
              <span className="owner-meta-value">${product.price}</span>
            </div>
            <div className="owner-meta-item">
              <span className="owner-meta-label">Stock</span>
              <span className="owner-meta-value">{product.stock_quantity}</span>
            </div>
            <div className="owner-meta-item">
              <span className="owner-meta-label">Store</span>
              <span className="owner-meta-value">{product.request || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="owner-product-actions">
          <Link to="/owner/products" className="owner-back-button">
            &larr; Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductShow;