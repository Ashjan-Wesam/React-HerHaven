import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/adminStyles/storecreate.css'

const StoreCreate = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'owner',
    status: 'active',
    profile_picture: '',
    shipping_address: '',
    store_name: '',
    description: '',
    logo_url: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://127.0.0.1:8000/api/admin/stores', form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });      
      navigate('/admin/stores');
    } catch (error) {
      console.error('Error creating store and owner:', error);
    }
  };

  return (
    <div className="create-store-container">
    <h2 className="page-title">Add New Store and Owner</h2>
    <form onSubmit={handleSubmit} className="form-container">
      <div className="card-section">
        <h3 className="section-title">Owner Info</h3>
        <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} type="email" />
        <input name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} type="password" />
        <input name="profile_picture" placeholder="Profile Picture URL (optional)" value={form.profile_picture} onChange={handleChange} />
        <input name="shipping_address" placeholder="Shipping Address (optional)" value={form.shipping_address} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="card-section">
        <h3 className="section-title">Store Info</h3>
        <input name="store_name" placeholder="Store Name" value={form.store_name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="logo_url" placeholder="Logo URL" value={form.logo_url} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button type="submit" className="submit-btn">Save</button>
    </form>
  </div>
  );
};

export default StoreCreate;
