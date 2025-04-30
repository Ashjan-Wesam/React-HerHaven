import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/adminStyles/UserCreate.css';

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
    profile_picture: null, // ⬅️ ملفات صور
    logo_url: null,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] }); // ⬅️ حفظ ملف واحد
    } else {
      setForm({ ...form, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value);
      }
    });

    try {
      await axios.post('http://127.0.0.1:8000/api/admin/users', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // مهم لرفع ملفات
        },
      });
      navigate('/admin/users');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error('Error creating user:', error);
        setGeneralError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <h2 className="form-title">Create New User</h2>
      <form onSubmit={handleSubmit} className="form">

        {generalError && <p className="error-text general-error">{generalError}</p>}

        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="form-input"
        />
        {errors.full_name && <p className="error-text">{errors.full_name[0]}</p>}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="form-input"
        />
        {errors.email && <p className="error-text">{errors.email[0]}</p>}

        <input
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
          className="form-input"
        />
        {errors.phone_number && <p className="error-text">{errors.phone_number[0]}</p>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="form-input"
        />
        {errors.password && <p className="error-text">{errors.password[0]}</p>}

        <input
          name="profile_picture"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="form-input"
        />
        {errors.profile_picture && <p className="error-text">{errors.profile_picture[0]}</p>}

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="form-select"
        >
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="error-text">{errors.role[0]}</p>}

        {form.role === 'owner' && (
          <>
            <input
              name="store_name"
              placeholder="Store Name"
              value={form.store_name}
              onChange={handleChange}
              className="form-input"
            />
            {errors.store_name && <p className="error-text">{errors.store_name[0]}</p>}

            <input
              name="description"
              placeholder="Store Description"
              value={form.description}
              onChange={handleChange}
              className="form-input"
            />

            <input
              name="logo_url"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="form-input"
            />
            {errors.logo_url && <p className="error-text">{errors.logo_url[0]}</p>}
          </>
        )}

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="form-select"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="error-text">{errors.status[0]}</p>}

        <button type="submit" className="form-button">Save</button>
      </form>
    </div>
  );
};

export default UserCreate;
