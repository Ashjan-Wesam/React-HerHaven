import { useState } from 'react';
import axios from 'axios';
import '../assets/css/Login.css';
import LoginImg from "../assets/img/login2.jpg";
import Header from '../User/Components/Header';

const RegisterCustomer = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    profile_picture: null,
    shipping_address: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_picture: e.target.files[0] });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register-customer', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div>
      <div className="login-box">
        <div className="login-image">
          <img src={LoginImg} alt="Register Illustration" />
        </div>
        <div className="login-form">
          <h2 className="logo">Shop unique home products</h2>
          <form onSubmit={handleRegister}>
            <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <p>Profile Image</p>
            <input type="file" name="profile_picture" onChange={handleFileChange} accept="image/*" />
            <input type="text" name="shipping_address" placeholder="Shipping Address" value={formData.shipping_address} onChange={handleChange} required />
            <button className='loginBtn' type="submit">REGISTER</button>
          </form>
          {message && <p className="message">{message}</p>}
          <p className="register-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCustomer;


