import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/css/adminStyles/UserEdit.css'

const UserEdit = () => {
    const [form, setForm] = useState({});
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
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://127.0.0.1:8000/api/admin/users/${id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          navigate('/admin/users');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        alert('حدث خطأ أثناء تحديث البيانات');
      }
    };
  
    return (
      <div className="container">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className='editInput'
            name="full_name" 
            value={form.full_name || ''} 
            placeholder="الاسم الكامل" 
            onChange={handleChange} 
          />
          <input 
            className='editInput'
            name="email" 
            value={form.email || ''} 
            placeholder="الإيميل" 
            onChange={handleChange} 
          />
          <input 
            className='editInput'
            name="phone_number" 
            value={form.phone_number || ''} 
            placeholder="رقم الهاتف" 
            onChange={handleChange} 
          />
  
          <select 
            className='editInput'
            name="role" 
            value={form.role || ''} 
            onChange={handleChange}
          >
            <option value="customer">Admin</option>
            <option value="owner">Owner</option>
            <option value="admin">Customer</option>
          </select>
  
          {form.role === 'owner' && (
            <>
              <input 
               className='editInput'
                name="store_name" 
                value={form.store_name || ''} 
                placeholder="اسم المتجر" 
                onChange={handleChange} 
              />
              <input 
               className='editInput'
                name="description" 
                value={form.description || ''} 
                placeholder="وصف المتجر" 
                onChange={handleChange} 
              />
              <input 
               className='editInput'
                name="logo_url" 
                value={form.logo_url || ''} 
                placeholder="رابط الشعار" 
                onChange={handleChange} 
              />
            </>
          )}
  
          <select 
            className='editInput'
            name="status" 
            value={form.status || ''} 
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Blocked</option>
          </select>
  
          <button 
          type="submit"
          className='editBtn' >Update
          </button>
        </form>
      </div>
    );
  };
  
  export default UserEdit;
