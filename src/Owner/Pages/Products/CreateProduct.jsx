import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    image_url: '',
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/owner/my-categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log("Fetched Categories:", res.data); 
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err.response?.data || err.message);
    }
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/owner/products', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(form);
      navigate('/owner/products');
    } catch (err) {
      console.error('Error creating product:', err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="stock_quantity"
          placeholder="Stock Quantity"
          value={form.stock_quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Save
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
