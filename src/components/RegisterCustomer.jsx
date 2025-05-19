import { useState } from 'react';
import axios from 'axios';
import '../assets/css/Login.css';
import LoginImg from "../assets/img/download (30).jpg";

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
    const file = e.target.files[0];
    setFormData({ ...formData, profile_picture: file });
  };

  // ✅ Validations
  const isValidPassword = (password) => {
    const minLength = password.length >= 8;
    const startsWithCapital = /^[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && startsWithCapital && hasSpecialChar;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{8,15}$/;
    return phoneRegex.test(phone);
  };

  const isValidImage = (file) => {
    if (!file) return true; // Not required but if provided, validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    return allowedTypes.includes(file.type);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!isValidPhone(formData.phone_number)) {
      setMessage("Phone number must be numeric and 8–15 digits.");
      return;
    }

    if (!isValidPassword(formData.password)) {
      setMessage("Password must start with a capital letter, be at least 8 characters, and include a special character.");
      return;
    }

    if (!isValidImage(formData.profile_picture)) {
      setMessage("Profile picture must be an image (jpg, jpeg, or png).");
      return;
    }

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
          <h2 className="logo">Her<span>Haven</span></h2>
          <p className="register-prompt">Shop unique home products</p>
          <form className="loginForm" onSubmit={handleRegister}>
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
