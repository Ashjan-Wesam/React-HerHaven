import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [oldImage, setOldImage] = useState(null);

  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    store_id: '',
    category_id: '',
    image_url: null,
    request: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`http://127.0.0.1:8000/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const product = productRes.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          stock_quantity: product.stock_quantity || '',
          store_id: product.store_id || '',
          category_id: product.category_id || '',
          image_url: product.image_url || null,
          request: product.request || ''
        });
        setOldImage(product.image_url);

        const storeRes = await axios.get('http://127.0.0.1:8000/api/stores', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStores(storeRes.data);

        const catRes = await axios.get('http://127.0.0.1:8000/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
        setError('⚠️ Failed to fetch data.');
      }
    };

    fetchData();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (!formData.price) errors.price = 'Price is required.';
    if (!formData.stock_quantity) errors.stock_quantity = 'Stock quantity is required.';
    if (!formData.store_id) errors.store_id = 'Please select a store.';
    if (!formData.category_id) errors.category_id = 'Please select a category.';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Swal.fire('Please fix the errors', 'Some fields are missing or invalid.', 'warning');
      return;
    }

    setValidationErrors({}); // clear errors

    const form = new FormData();
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        form.append(key, formData[key]);
      }
    }

    try {
      await axios.post(`http://127.0.0.1:8000/api/admin/products/${id}?_method=PUT`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire('Success', 'Product updated successfully!', 'success').then(() => {
        navigate('/admin/products');
      });
    } catch (error) {
      console.error("There was an error updating the product:", error);
      Swal.fire('Error', 'Failed to update product.', 'error');
    }
  };

  return (
    <div className="admin-edit-product-container">
      <h2 className="admin-title">Edit Product</h2>
      {error && <p className="admin-error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {validationErrors.name && <p className="admin-error-text">{validationErrors.name}</p>}
        </div>

        <div className="admin-form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="admin-form-group">
          <label>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} />
          {validationErrors.price && <p className="admin-error-text">{validationErrors.price}</p>}
        </div>

        <div className="admin-form-group">
          <label>Stock Quantity</label>
          <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} />
          {validationErrors.stock_quantity && <p className="admin-error-text">{validationErrors.stock_quantity}</p>}
        </div>

        <div className="admin-form-group">
          <label>Store</label>
          <select name="store_id" value={formData.store_id} onChange={handleChange}>
            <option value="">Select Store</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.store_name}</option>
            ))}
          </select>
          {validationErrors.store_id && <p className="admin-error-text">{validationErrors.store_id}</p>}
        </div>

        <div className="admin-form-group">
          <label>Category</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange}>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {validationErrors.category_id && <p className="admin-error-text">{validationErrors.category_id}</p>}
        </div>

        <div className="admin-form-group">
          <label>Current Image</label>
          {oldImage && <img src={`http://127.0.0.1:8000/${formData.image_url}`} alt="Old Product" className="admin-old-image" />}
        </div>

        <div className="admin-form-group">
          <label>New Image (optional)</label>
          <input type="file" name="image_url" accept="image/*" onChange={handleChange} />
        </div>

        <div className="admin-form-group">
          <label>Request</label>
          <select name="request" value={formData.request} onChange={handleChange}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <button type="submit" className="admin-btn-edit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
