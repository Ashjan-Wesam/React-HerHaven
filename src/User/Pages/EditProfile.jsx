import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './editProfile.css'

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    shipping_address: '',
    profile_picture: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }
  
      console.log("Token:", token); // عرض التوكن في الـ console
  
      const res = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // عرض استجابة الـ API بالكامل في الـ console
      console.log('API Response:', res);
  
      // الوصول للبيانات داخل user
      if (res.data && res.data.user) {
        setUser(res.data.user);
        setFormData({
          full_name: res.data.user.full_name || '',
          email: res.data.user.email || '',
          phone_number: res.data.user.phone_number || '',
          shipping_address: res.data.user.shipping_address || '',
          profile_picture: null,
        });
      } else {
        setError('Invalid user data.');
      }
  
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
      setError('Error fetching profile data.');
      Swal.fire('Error', 'There was an issue fetching your profile data.', 'error');
    }
  };
  
  

  const handleChange = (e) => {
    if (e.target.name === 'profile_picture') {
      setFormData({ ...formData, profile_picture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('full_name', formData.full_name);
      data.append('email', formData.email);
      data.append('phone_number', formData.phone_number);
      data.append('shipping_address', formData.shipping_address);
      if (formData.profile_picture) {
        data.append('profile_picture', formData.profile_picture);
      }

      const res = await axios.post('http://127.0.0.1:8000/api/user/update', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Update Response:', res); 
      Swal.fire('Success', 'Profile updated successfully!', 'success');
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire('Error', 'There was a problem updating your profile.', 'error');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>; 

  return (
    <div className="edit-profile-page" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '15px' }}>
          <label>Full Name:</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Shipping Address:</label>
          <input
            type="text"
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Profile Picture:</label>
          <input
            type="file"
            name="profile_picture"
            onChange={handleChange}
            accept="image/*"
            style={{ width: '100%', padding: '8px' }}
          />
          {user.profile_picture && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={`http://127.0.0.1:8000/storage/${user.profile_picture}`}
                alt="Profile"
                style={{ width: '100px', borderRadius: '8px' }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(to right, rgb(240, 249, 255) 0%, rgb(170, 122, 208) 0%, rgb(208, 122, 205) 100%)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
