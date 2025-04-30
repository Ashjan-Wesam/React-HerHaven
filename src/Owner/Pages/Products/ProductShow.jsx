import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ProductShow = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

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
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      {product.image_url && (
        <img src={product.image_url} alt={product.name} className="w-64 h-64 object-cover mb-4" />
      )}
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Stock:</strong> {product.stock_quantity}</p>
      <p><strong>Category:</strong> {product.category?.name || 'N/A'}</p>
      <p><strong>Store:</strong> {product.store?.name || 'N/A'}</p>

      <Link to="/owner/products" className="mt-4 inline-block text-blue-600">Back to Products</Link>
    </div>
  );
};

export default ProductShow;
