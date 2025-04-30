import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // استيراد SweetAlert2
import '../../../assets/css/adminStyles/UserEdit.css';

const UserEdit = () => {
  const [form, setForm] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({}); // لحفظ الرسائل الخاصة بالأخطاء
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('full_name', form.full_name);
    formData.append('email', form.email);
    formData.append('phone_number', form.phone_number);
    formData.append('role', form.role);
    formData.append('status', form.status);
    formData.append('shipping_address', form.shipping_address);

    // إضافة الصورة (إذا تم رفعها)
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }
    if (logo) {
      formData.append('logo_url', logo);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://127.0.0.1:8000/api/admin/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // تأكد من إرسال البيانات كـ FormData
        },
      });

      if (response.status === 200) {
        // عرض رسالة النجاح باستخدام SweetAlert فقط إذا لم تكن هناك أخطاء
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

      // التحقق من وجود رسائل من الـ API وإظهارها
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // حفظ الأخطاء في حالة وجودها
      } else {
        // عرض رسالة عامة في حال حدوث أي خطأ غير متوقع
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred. Please try again later.',
        });
      }
    }
  };

  return (
    <div className="container">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input 
          className="editInput"
          name="full_name" 
          value={form.full_name || ''} 
          placeholder="Full Name" 
          onChange={handleChange} 
          style={{ color: '#444' }}
        />
        {errors.full_name && <p className="text-red-500">{errors.full_name[0]}</p>} {/* عرض رسالة الخطأ هنا */}

        <input 
          className="editInput"
          name="email" 
          value={form.email || ''} 
          placeholder="Email" 
          onChange={handleChange} 
          style={{ color: '#444' }}
        />
        {errors.email && <p className="text-red-500">{errors.email[0]}</p>} {/* عرض رسالة الخطأ هنا */}

        <input 
          className="editInput"
          name="phone_number" 
          value={form.phone_number || ''} 
          placeholder="Phone Number" 
          onChange={handleChange} 
          style={{ color: '#444' }}
        />
        {errors.phone_number && <p className="text-red-500">{errors.phone_number[0]}</p>} {/* عرض رسالة الخطأ هنا */}

        <select 
          className="editInput"
          name="role" 
          value={form.role || ''} 
          onChange={handleChange}
        >
          <option value="customer">Admin</option>
          <option value="owner">Owner</option>
          <option value="admin">Customer</option>
        </select>
        {errors.role && <p className="text-red-500">{errors.role[0]}</p>} {/* عرض رسالة الخطأ هنا */}

        {form.role === 'owner' && (
          <>
            <input 
              className="editInput"
              name="store_name" 
              value={form.store_name || ''} 
              placeholder="Store Name" 
              onChange={handleChange} 
            />
            {errors.store_name && <p className="text-red-500">{errors.store_name[0]}</p>} {/* عرض رسالة الخطأ هنا */}

            <input 
              className="editInput"
              name="description" 
              value={form.description || ''} 
              placeholder="Description" 
              onChange={handleChange} 
            />
            {errors.description && <p className="text-red-500">{errors.description[0]}</p>} {/* عرض رسالة الخطأ هنا */}

            <input 
              className="editInput"
              name="logo_url" 
              type="file"
              onChange={handleFileChange} 
            />
            {errors.logo_url && <p className="text-red-500">{errors.logo_url[0]}</p>} {/* عرض رسالة الخطأ هنا */}
          </>
        )}

        <input 
          className="editInput"
          name="profile_picture" 
          type="file"
          onChange={handleFileChange} 
        />
        {errors.profile_picture && <p className="text-red-500">{errors.profile_picture[0]}</p>} {/* عرض رسالة الخطأ هنا */}

        <select 
          className="editInput"
          name="status" 
          value={form.status || ''} 
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Blocked</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status[0]}</p>} {/* عرض رسالة الخطأ هنا */}

        <button type="submit" className="editBtn">
          Update
        </button>
      </form>
    </div>
  );
};

export default UserEdit;
