import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/css/ownerStyles/CateoriesPage.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    image_url: '', // صورة حالية
    request: 'no',
    product_image: null // الصورة الجديدة
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/owner/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProduct({
        ...res.data,
        product_image: null // Reset upload image
      });
    } catch (error) {
      console.error('Error fetching product:', error.response?.data || error.message);
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setProduct({ ...product, product_image: files[0] });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name', product.name);
    fd.append('description', product.description);
    fd.append('price', product.price);
    fd.append('stock_quantity', product.stock_quantity);
    fd.append('category_id', product.category_id);
    fd.append('request', product.request);

    if (product.product_image) {
      fd.append('image_url', product.product_image); // الاسم يطابق ما يستخدمه Laravel
    }

    // Debug: show what's being sent
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }

    try {
      await axios.post(`http://127.0.0.1:8000/api/owner/products/${id}?_method=PUT`, fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert('Product updated successfully!');
      navigate('/owner/products');
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
    }
  };

  return (
    <div className="owner-container">
      <h2 className="owner-header">Edit Product</h2>
      <form onSubmit={handleSubmit} className="owner-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
        />

        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <label>Stock Quantity:</label>
        <input
          type="number"
          name="stock_quantity"
          value={product.stock_quantity}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select
          name="category_id"
          value={product.category_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Design Request:</label>
        <select
          name="request"
          value={product.request}
          onChange={handleChange}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>

        <label>Product Image:</label>
        <input
          type="file"
          name="product_image"
          accept="image/*"
          onChange={handleChange}
        />
        {product.image_url && (
          <img
            src={`http://127.0.0.1:8000/${product.image_url}`}
            alt="Product"
            className="product-image-preview"
          />
        )}

        <button type="submit" className="owner-add-btn mt-4">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
