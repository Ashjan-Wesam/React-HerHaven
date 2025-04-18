import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const StoreEdit = () => {
  const [form, setForm] = useState({
    store_name: '',
    description: '',
    logo_url: '',
    full_name: '',
    email: '',
    phone_number: '',
    role: 'owner', 
    status: 'active',
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/admin/stores/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const store = res.data.store;
        const owner = res.data.owner;

        setForm({
          store_name: store.store_name || '',
          description: store.description || '',
          logo_url: store.logo_url || '',
          full_name: owner.full_name || '',
          email: owner.email || '',
          phone_number: owner.phone_number || '',
          role: owner.role || 'owner',
          status: store.status || 'active',
        });
      } catch (error) {
        console.error('Error fetching store:', error);
      }
    };
    fetchStore();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/admin/stores/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        navigate('/admin/stores');
      }
    } catch (error) {
      console.error('Error updating store:', error);
      alert('حدث خطأ أثناء تحديث البيانات');
    }
  };

  return (
    <div className="container">
      <h2>Edit Store</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3>Owner Info</h3>
        <input
          className="editInput"
          name="full_name"
          value={form.full_name}
          placeholder="Owner Name"
          onChange={handleChange}
        />
        <input
          className="editInput"
          name="email"
          value={form.email}
          placeholder="Owner Email"
          onChange={handleChange}
          type="email"
        />
        <input
          className="editInput"
          name="phone_number"
          value={form.phone_number}
          placeholder="Owner Phone Number"
          onChange={handleChange}
        />

        <h3>Store Info</h3>
        <input
          className="editInput"
          name="store_name"
          value={form.store_name}
          placeholder="Store Name"
          onChange={handleChange}
        />
        <input
          className="editInput"
          name="description"
          value={form.description}
          placeholder="Store Description"
          onChange={handleChange}
        />
        <input
          className="editInput"
          name="logo_url"
          value={form.logo_url}
          placeholder="Logo URL"
          onChange={handleChange}
        />

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

        <button type="submit" className="editBtn">
          Update
        </button>
      </form>
    </div>
  );
};

export default StoreEdit;
