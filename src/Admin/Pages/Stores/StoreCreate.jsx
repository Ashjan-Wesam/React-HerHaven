import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/adminStyles/storecreate.css';

const StoreCreate = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'owner',
    status: 'active',
    profile_picture: null,
    shipping_address: '',
    store_name: '',
    description: '',
    logo_url: null,
    category: [], // Array to store multiple categories
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/categories');
        const formatted = res.data.map(cat => ({
          label: cat.name,
          value: cat.id,
        }));
        setCategories(formatted);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCategoryChange = (selectedCategories) => {
    setForm({ ...form, category: selectedCategories }); // Store selected categories as an array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    const formData = new FormData();
    formData.append('full_name', form.full_name);
    formData.append('email', form.email);
    formData.append('phone_number', form.phone_number);
    formData.append('password', form.password);
    formData.append('role', form.role);
    formData.append('status', form.status);
    formData.append('shipping_address', form.shipping_address);
    formData.append('store_name', form.store_name);
    formData.append('description', form.description);
  
    if (form.profile_picture) {
      formData.append('profile_picture', form.profile_picture);
    }
  
    if (form.logo_url) {
      formData.append('logo_url', form.logo_url);
    }
  
    // Ensure the categories are sent by ID only
    if (form.category.length > 0) {
      form.category.forEach(category => {
        formData.append('categories[]', category.value); // Append category ID only
      });
    }
  
    try {
      await axios.post('http://127.0.0.1:8000/api/admin/stores', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/stores');
    } catch (error) {
      console.error('Error creating store and owner:', error);
    }
  };
  

  return (
    <div className="create-store-container">
     
      <form onSubmit={handleSubmit} className="form-container">
        <div className="card-section">
          <h3 style={{ fontSize: "3rem", marginBottom: "2rem" }}>Owner Info</h3>
          <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} type="email" />
          <input name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} />
          <input name="password" placeholder="Password" value={form.password} onChange={handleChange} type="password" />
          <input 
            name="profile_picture" 
            placeholder="Profile Picture (optional)" 
            type="file" 
            onChange={handleChange} 
          />
          <input name="shipping_address" placeholder="Shipping Address (optional)" value={form.shipping_address} onChange={handleChange} />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="card-section">
          <h3  style={{ fontSize: "3rem", marginBottom: "2rem" }}>Store Info</h3>
          <input name="store_name" placeholder="Store Name" value={form.store_name} onChange={handleChange} />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input 
            name="logo_url" 
            placeholder="Logo (optional)" 
            type="file"  
            onChange={handleChange} 
          />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Add the multiple category selection */}
          <div>
            <h4>Select Categories</h4>
            <CreatableSelect
              isMulti
              isClearable
              options={categories}
              onChange={handleCategoryChange}
              value={form.category}
              placeholder="Select or create categories"
            />
          </div>
        </div>

        <button type="submit" className="editBtn">Save</button>
      </form>
    </div>
  );
};

export default StoreCreate;
