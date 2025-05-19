import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../assets/css/adminStyles/Products.css';
import Loading from '../../../Owner/Components/Loading';

const CreateProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    store_id: '',
    category_id: '',
    image_file: null,
    request: 'no',
  });

  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeError, setStoreError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // جلب الستورز عند أول تحميل المكون
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storeRes = await axios.get('http://127.0.0.1:8000/api/stores', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(storeRes.data) && storeRes.data.length > 0) {
          setStores(storeRes.data);
          setStoreError('');
        } else {
          setStoreError('⚠️ No stores found.');
        }
      } catch (err) {
        console.error('Error fetching stores:', err);
        setStoreError('Failed to fetch stores.');
      }
    };

    fetchStores();
  }, [token]);

  // جلب الكاتيجوريز بناءً على store_id المختار مع تمرير التوكن
  useEffect(() => {
  const fetchStores = async () => {
    try {
      const storeRes = await axios.get('http://127.0.0.1:8000/api/stores', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(storeRes.data.data) && storeRes.data.data.length > 0) {
        setStores(storeRes.data.data);
        setStoreError('');
      } else {
        setStoreError('⚠️ No stores found.');
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
      setStoreError('Failed to fetch stores.');
    }
  };

  fetchStores();
}, [token]);

useEffect(() => {
  if (!form.store_id) {
    setCategories([]);
    setCategoryError('Please select a store to load categories.');
    return;
  }

  const fetchCategoriesByStore = async () => {
    try {
      const catRes = await axios.get(
        `http://127.0.0.1:8000/api/store-categories/${form.store_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(catRes.data.data) && catRes.data.data.length > 0) {
        setCategories(catRes.data.data);
        setCategoryError('');
      } else {
        setCategories([]);
        setCategoryError('⚠️ No categories found for this store.');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
      setCategoryError('Failed to fetch categories.');
    }
  };

  fetchCategoriesByStore();
}, [form.store_id, token]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'store_id') {
      // عند تغيير الستور نفرغ الكاتيجوري المحدد
      setForm((prev) => ({ ...prev, store_id: value, category_id: '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image_file: e.target.files[0] }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      Swal.fire('Error', 'Product name is required', 'error');
      return false;
    }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      Swal.fire('Error', 'Price must be a number greater than zero', 'error');
      return false;
    }
    if (
      !form.stock_quantity ||
      isNaN(form.stock_quantity) ||
      Number(form.stock_quantity) < 0
    ) {
      Swal.fire('Error', 'Stock quantity must be zero or more', 'error');
      return false;
    }
    if (!form.store_id) {
      Swal.fire('Error', 'Please select a store', 'error');
      return false;
    }
    if (!form.category_id) {
      Swal.fire('Error', 'Please select a category', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('stock_quantity', form.stock_quantity);
      formData.append('store_id', form.store_id);
      formData.append('category_id', form.category_id);
      formData.append('request', form.request);

      if (form.image_file) {
        formData.append('image_url', form.image_file);
      }

      await axios.post('http://127.0.0.1:8000/api/admin/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      Swal.fire('Success', 'Product created successfully', 'success').then(() => {
        navigate('/admin/products');
      });
    } catch (error) {
      setLoading(false);
      console.error('Error creating product:', error);
      Swal.fire('Error', 'An error occurred while creating the product', 'error');
    }
  };

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">Create New Product</h2>

      {storeError && <p className="admin-error-msg">{storeError}</p>}
      {categoryError && <p className="admin-error-msg">{categoryError}</p>}

      <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="admin-input"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="admin-textarea"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="admin-input"
          min="0.01"
          step="0.01"
          required
        />

        <input
          type="number"
          name="stock_quantity"
          value={form.stock_quantity}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className="admin-input"
          min="0"
          required
        />

        <select
          name="store_id"
          value={form.store_id}
          onChange={handleChange}
          className="admin-select"
          required
        >
          <option value="">Select Store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.store_name}
            </option>
          ))}
        </select>

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="admin-select"
          required
          disabled={!form.store_id || categories.length === 0}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          name="image_file"
          onChange={handleFileChange}
          className="admin-input"
          accept="image/*"
        />

        <select
          name="request"
          value={form.request}
          onChange={handleChange}
          className="admin-select"
        >
          <option value="no">Request: No</option>
          <option value="yes">Request: Yes</option>
        </select>

        <button type="submit" className="admin-submit-btn" disabled={loading}>
          {loading ? 'Loading...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
