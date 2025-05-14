import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../assets/css/adminStyles/UserCreate.css';
import Loading from  "../../../Owner/Components/Loading"

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
    profile_picture: null, 
    logo_url: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.full_name.trim()) newErrors.full_name = 'Full name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Email is invalid.';
    if (!form.phone_number.trim()) newErrors.phone_number = 'Phone number is required.';
    if (!form.password.trim()) newErrors.password = 'Password is required.';
    if (!form.profile_picture) newErrors.profile_picture = 'Profile picture is required.';

    if (form.role === 'owner') {
      if (!form.store_name.trim()) newErrors.store_name = 'Store name is required.';
      if (!form.logo_url) newErrors.logo_url = 'Store logo is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the highlighted fields.',
      });
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value);
      }
    });

    setLoading(true); 

    try {
      await axios.post('http://127.0.0.1:8000/api/admin/users', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'User Created',
        text: 'The user was successfully created.',
      }).then(() => navigate('/admin/users'));

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
        Swal.fire({
          icon: 'error',
          title: 'Validation Failed',
          text: 'Please check the fields and try again.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-form-title">Create New User</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="admin-form-input"
        />
        {errors.full_name && <p className="admin-error-text">{errors.full_name}</p>}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="admin-form-input"
        />
        {errors.email && <p className="admin-error-text">{errors.email}</p>}

        <input
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
          className="admin-form-input"
        />
        {errors.phone_number && <p className="admin-error-text">{errors.phone_number}</p>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="admin-form-input"
        />
        {errors.password && <p className="admin-error-text">{errors.password}</p>}

        <input
          name="profile_picture"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="admin-form-input"
        />
        {errors.profile_picture && <p className="admin-error-text">{errors.profile_picture}</p>}

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="admin-form-select"
        >
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="admin-error-text">{errors.role}</p>}

        {form.role === 'owner' && (
          <>
            <input
              name="store_name"
              placeholder="Store Name"
              value={form.store_name}
              onChange={handleChange}
              className="admin-form-input"
            />
            {errors.store_name && <p className="admin-error-text">{errors.store_name}</p>}

            <input
              name="description"
              placeholder="Store Description"
              value={form.description}
              onChange={handleChange}
              className="admin-form-input"
            />

            <input
              name="logo_url"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="admin-form-input"
            />
            {errors.logo_url && <p className="admin-error-text">{errors.logo_url}</p>}
          </>
        )}

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="admin-form-select"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="admin-error-text">{errors.status}</p>}

        <button type="submit" className="admin-form-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>

      {loading && (
        <Loading />
      )}
    </div>
  );
};

export default UserCreate;
