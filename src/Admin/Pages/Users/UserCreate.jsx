import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/adminStyles/UserCreate.css'

const UserCreate = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'customer',
    status: 'active',
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
      await axios.post('http://127.0.0.1:8000/api/admin/users', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/admin/users');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred while creating the user');
    }
  };

  return (
    <div className="container">
      <h2 className="form-title">Create New User</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          name="full_name"
          placeholder="Full Name"
          onChange={handleChange}
          className="form-input"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="form-input"
        />
        <input
          name="phone_number"
          placeholder="Phone Number"
          onChange={handleChange}
          className="form-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="form-input"
        />

        <select
          name="role"
          onChange={handleChange}
          className="form-select"
        >
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>

        {form.role === 'owner' && (
          <>
            <input
              name="store_name"
              placeholder="Store Name"
              onChange={handleChange}
              className="form-input"
            />
            <input
              name="description"
              placeholder="Store Description"
              onChange={handleChange}
              className="form-input"
            />
            <input
              name="logo_url"
              placeholder="Logo URL"
              onChange={handleChange}
              className="form-input"
            />
          </>
        )}

        <select
          name="status"
          onChange={handleChange}
          className="form-select"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button type="submit" className="form-button">Save</button>
      </form>
    </div>
  );
};

export default UserCreate;
