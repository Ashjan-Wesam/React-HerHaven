import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../assets/css/adminStyles/UserEdit.css';
import Loading from  "../../../Owner/Components/Loading"



const UserEdit = () => {
  const [form, setForm] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://127.0.0.1:8000/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm(res.data);
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'profile_picture') {
      setProfilePicture(files[0]);
    } else if (name === 'logo_url') {
      setLogo(files[0]);
    }
  };

  // تحقق من صحة النموذج
  const validateForm = () => {
    const newErrors = {};

    // التحقق من الحقول المطلوبة
    if (!form.full_name || form.full_name.trim() === '') newErrors.full_name = 'Full name is required';
    if (!form.email || form.email.trim() === '') newErrors.email = 'Email is required';
    if (!form.phone_number || form.phone_number.trim() === '') newErrors.phone_number = 'Phone number is required';
    
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }

    const phoneRegex = /^(077|078|079)[0-9]{7}$/;
    if (form.phone_number && !phoneRegex.test(form.phone_number)) {
      newErrors.phone_number = 'Phone number must start with 077, 078, or 079 and be exactly 10 digits';
    }

    if (!form.role) newErrors.role = 'Role is required';
    if (!form.status) newErrors.status = 'Status is required';

    if (form.role === 'owner') {
      if (!form.store_name || form.store_name.trim() === '') newErrors.store_name = 'Store name is required';
      if (!form.description || form.description.trim() === '') newErrors.description = 'Description is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill in all required fields',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('full_name', form.full_name);
    formData.append('email', form.email);
    formData.append('phone_number', form.phone_number);
    formData.append('role', form.role);
    formData.append('status', form.status);
    formData.append('shipping_address', form.shipping_address || '');

    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }
    if (logo) {
      formData.append('logo_url', logo);
    }

    if (form.role === 'owner') {
      formData.append('store_name', form.store_name || '');
      formData.append('description', form.description || '');
    }

    try {
      setIsLoading(true); 

      const token = localStorage.getItem('token');
      const response = await axios.put(`http://127.0.0.1:8000/api/admin/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'User Updated',
          text: 'The user has been updated successfully!',
        }).then(() => {
          navigate('/admin/users');
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);

      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please correct the highlighted errors.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred. Please try again later.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-form-title">Edit User</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="admin-form-group">
            <input
              className="admin-form-input"
              name="full_name"
              value={form.full_name || ''}
              placeholder="Full Name"
              onChange={handleChange}
            />
            {errors.full_name && <p className="admin-form-error">{errors.full_name}</p>}
          </div>

          <div className="admin-form-group">
            <input
              className="admin-form-input"
              name="email"
              value={form.email || ''}
              placeholder="Email"
              onChange={handleChange}
            />
            {errors.email && <p className="admin-form-error">{errors.email}</p>}
          </div>

          <div className="admin-form-group">
            <input
              className="admin-form-input"
              name="phone_number"
              value={form.phone_number || ''}
              placeholder="Phone Number"
              onChange={handleChange}
            />
            {errors.phone_number && <p className="admin-form-error">{errors.phone_number}</p>}
          </div>

          <div className="admin-form-group">
            <select
              className="admin-form-select"
              name="role"
              value={form.role || ''}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
              <option value="customer">Customer</option>
            </select>
            {errors.role && <p className="admin-form-error">{errors.role}</p>}
          </div>

          {form.role === 'owner' && (
            <>
              <div className="admin-form-group">
                <input
                  className="admin-form-input"
                  name="store_name"
                  value={form.store_name || ''}
                  placeholder="Store Name"
                  onChange={handleChange}
                />
                {errors.store_name && <p className="admin-form-error">{errors.store_name}</p>}
              </div>

              <div className="admin-form-group">
                <input
                  className="admin-form-input"
                  name="description"
                  value={form.description || ''}
                  placeholder="Description"
                  onChange={handleChange}
                />
                {errors.description && <p className="admin-form-error">{errors.description}</p>}
              </div>

              <div className="admin-form-group">
                <input
                  className="admin-form-input"
                  name="logo_url"
                  type="file"
                  onChange={handleFileChange}
                />
                {errors.logo_url && <p className="admin-form-error">{errors.logo_url}</p>}
              </div>
            </>
          )}

          <div className="admin-form-group">
            <input
              className="admin-form-input"
              name="profile_picture"
              type="file"
              onChange={handleFileChange}
            />
            {errors.profile_picture && <p className="admin-form-error">{errors.profile_picture}</p>}
          </div>

          <div className="admin-form-group">
            <select
              className="admin-form-select"
              name="status"
              value={form.status || ''}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Blocked</option>
            </select>
            {errors.status && <p className="admin-form-error">{errors.status}</p>}
          </div>

          <button type="submit" className="admin-form-submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default UserEdit;
