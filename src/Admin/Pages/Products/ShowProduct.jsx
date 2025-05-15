import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Loading from '../../../Owner/Components/Loading';

const ShowProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <Loading />;

  return (
    <div className="admin-show-product-page">
  <h2>{product.name}</h2>
  <img src={`http://127.0.0.1:8000/${product.image_url}`} alt={product.name} style={{ maxWidth: '300px' }} />
  <p><strong>Description:</strong> {product.description}</p>
  <p><strong>Price:</strong> ${product.price}</p>
  <p><strong>Stock Quantity:</strong> {product.stock_quantity}</p>
  <p><strong>Store:</strong> {product.store?.store_name}</p>
  <p><strong>Category:</strong> {product.category?.name}</p>
  <p><strong>Request Custom Design:</strong> {product.request}</p>

  <Link to="/admin/products" className="admin-back-btn">Back to Products</Link>
</div>

  );
};

export default ShowProduct;
