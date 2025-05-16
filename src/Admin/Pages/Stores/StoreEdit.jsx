import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const StoreEdit = () => {
  const [form, setForm] = useState({
    store_name: '',
    description: '',
    full_name: '',
    email: '',
    phone_number: '',
    role: 'owner',
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/admin/stores/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const store = res.data;
        const owner = store.owner;

        setForm({
          store_name: store.store_name || '',
          description: store.description || '',
          full_name: owner.full_name || '',
          email: owner.email || '',
          phone_number: owner.phone_number || '',
          role: owner.role || 'owner',
          status: store.status || 'active',
        });

        if (store.logo_url) {
          setLogoPreview(`http://127.0.0.1:8000/storage/logo/${store.logo_url}`);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load store data',
          confirmButtonColor: '#7E57C2',
        });
      }
    };

    fetchStore();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.store_name.trim()) {
      newErrors.store_name = 'Store name is required';
    }
    if (!form.full_name.trim()) {
      newErrors.full_name = 'Owner name is required';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (form.phone_number && !/^[0-9+]{8,15}$/.test(form.phone_number)) {
      newErrors.phone_number = 'Invalid phone number format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const result = await Swal.fire({
        title: 'Confirm Update',
        text: 'Are you sure you want to update this store?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#7E57C2',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
      });

      if (!result.isConfirmed) {
        setIsSubmitting(false);
        return;
      }

      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('store_name', form.store_name);
      formData.append('description', form.description);
      formData.append('status', form.status);
      formData.append('full_name', form.full_name);
      formData.append('email', form.email);
      formData.append('phone_number', form.phone_number);

      if (logoFile) {
        formData.append('logo_url', logoFile);
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/admin/stores/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Store has been updated successfully',
          confirmButtonColor: '#7E57C2',
        });
        navigate('/admin/stores');
      }
    } catch (error) {
      console.error('Error updating store:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update store',
        confirmButtonColor: '#7E57C2',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <h3>Owner Info</h3>

        <div className="form-group">
          <input
            className={`editInput ${errors.full_name ? 'error-border' : ''}`}
            name="full_name"
            value={form.full_name}
            placeholder="Owner Name"
            onChange={handleChange}
          />
          {errors.full_name && <p className="error-text">{errors.full_name}</p>}
        </div>

        <div className="form-group">
          <input
            className={`editInput ${errors.email ? 'error-border' : ''}`}
            name="email"
            value={form.email}
            placeholder="Owner Email"
            onChange={handleChange}
            type="email"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <input
            className={`editInput ${errors.phone_number ? 'error-border' : ''}`}
            name="phone_number"
            value={form.phone_number}
            placeholder="Owner Phone Number"
            onChange={handleChange}
          />
          {errors.phone_number && <p className="error-text">{errors.phone_number}</p>}
        </div>

        <h3>Store Info</h3>

        <div className="form-group">
          <input
            className={`editInput ${errors.store_name ? 'error-border' : ''}`}
            name="store_name"
            value={form.store_name}
            placeholder="Store Name"
            onChange={handleChange}
          />
          {errors.store_name && <p className="error-text">{errors.store_name}</p>}
        </div>

        <div className="form-group">
          <input
            className="editInput"
            name="description"
            value={form.description}
            placeholder="Store Description"
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Store Logo</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*" 
            className="editInput" 
          />
          {logoPreview && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={logoPreview}
                alt="Logo Preview"
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
              />
            </div>
          )}
        </div>

        <h3>Status</h3>
        <select
          className="editInput"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Blocked</option>
        </select>

        <button 
          type="submit" 
          className="editBtn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </form>

      <style>{`
        .error-text {
          color: red;
          font-size: 0.9rem;
          margin-top: 4px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .error-border {
          border-color: red;
        }
        .editBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default StoreEdit;