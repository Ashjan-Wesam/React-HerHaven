import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../assets/css/Login.css';
import LoginImg from "../assets/img/download (30).jpg";
import CreatableSelect from 'react-select/creatable';

const RegisterOwner = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    profile_picture: null,
    shipping_address: '',
    store_name: '',
    description: '',
    logo_url: null,
    category_ids: [],
  });

  const [errors, setErrors] = useState({}); // لتخزين الأخطاء
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  const customSelectStyles = {
    option: (provided) => ({ ...provided, color: 'black' }),
    multiValueLabel: (provided) => ({ ...provided, color: 'black' }),
    input: (provided) => ({ ...provided, color: 'black' }),
    singleValue: (provided) => ({ ...provided, color: 'black' }),
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/all-categories');
      setCategories(response.data);
    } catch {
      setMessage('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // إزالة رسالة الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });

    // إزالة رسالة الخطأ عند رفع ملف
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  // دالة للتحقق من بيانات الخطوة 1
  const validateStep1 = () => {
    let stepErrors = {};

    if (!formData.full_name.trim()) stepErrors.full_name = "Full Name is required";
    if (!formData.email.trim()) stepErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) stepErrors.email = "Invalid email format";

    if (!formData.phone_number.trim()) stepErrors.phone_number = "Phone Number is required";
    else if (!/^\+?\d{7,15}$/.test(formData.phone_number)) stepErrors.phone_number = "Invalid phone number";

    if (!formData.password) stepErrors.password = "Password is required";
    else if (formData.password.length < 6) stepErrors.password = "Password must be at least 6 characters";

    if (!formData.shipping_address.trim()) stepErrors.shipping_address = "Shipping Address is required";

    // ملف الصورة اختياري، لكن لو حبيت تخليه مطلوب:
    // if (!formData.profile_picture) stepErrors.profile_picture = "Profile Image is required";

    setErrors(stepErrors);

    return Object.keys(stepErrors).length === 0;
  };

  // دالة للتحقق من بيانات الخطوة 2
  const validateStep2 = () => {
    let stepErrors = {};

    if (!formData.store_name.trim()) stepErrors.store_name = "Store Name is required";

    if (!formData.logo_url) stepErrors.logo_url = "Store Logo is required";

    if (formData.category_ids.length === 0) stepErrors.category_ids = "Please select or add at least one category";

    setErrors(stepErrors);

    return Object.keys(stepErrors).length === 0;
  };

  // الانتقال للخطوة الثانية بعد التحقق من الخطوة الأولى
  const goToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // إرسال الفورم مع التحقق
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    try {
      const existingCategoryIds = formData.category_ids.filter(id => !id.startsWith('new-'));
      const newCategoryNames = formData.category_ids
        .filter(id => id.startsWith('new-'))
        .map(id => id.split('-').slice(1, -1).join('-'));

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'category_ids') {
          if (formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      existingCategoryIds.forEach(id => {
        formDataToSend.append('category_ids[]', id);
      });

      newCategoryNames.forEach(name => {
        formDataToSend.append('new_categories[]', name);
      });

      const response = await axios.post('http://127.0.0.1:8000/api/register-owner', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(response.data.message || "Store registered successfully");
      setErrors({});
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration Failed');
    }
  };

  const renderStep1 = () => (
    <div>
      <h2 className="logo">Her<span>Haven</span></h2>
      <p className="register-prompt">Personal Information</p>
      <form className="loginForm" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        {errors.full_name && <p className="error">{errors.full_name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        {errors.phone_number && <p className="error">{errors.phone_number}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <p>Profile Image</p>
        <input
          type="file"
          name="profile_picture"
          onChange={handleFileChange}
          accept="image/*"
        />
        {errors.profile_picture && <p className="error">{errors.profile_picture}</p>}

        <input
          type="text"
          name="shipping_address"
          placeholder="Shipping Address"
          value={formData.shipping_address}
          onChange={handleChange}
          required
        />
        {errors.shipping_address && <p className="error">{errors.shipping_address}</p>}

        <button type="button" className="loginBtn" onClick={goToStep2}>Next</button>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="logo">Her<span>Haven</span></h2>
      <p className="register-prompt">Store Information</p>
      <form className="loginForm" onSubmit={handleRegister}>
        <input
          type="text"
          name="store_name"
          placeholder="Store Name"
          value={formData.store_name}
          onChange={handleChange}
          required
        />
        {errors.store_name && <p className="error">{errors.store_name}</p>}

        <textarea
          style={{ color: 'black' }}
          name="description"
          placeholder="Store Description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <p>Store Logo</p>
        <input
          type="file"
          name="logo_url"
          onChange={handleFileChange}
          accept="image/*"
        />
        {errors.logo_url && <p className="error">{errors.logo_url}</p>}

        <p>Select or Add Categories</p>
        <CreatableSelect
          isMulti
          options={categories.map(cat => ({ value: String(cat.id), label: cat.name }))}
          styles={customSelectStyles}
          onChange={(selectedOptions) => {
            const values = selectedOptions.map(opt => opt.value);
            setFormData({ ...formData, category_ids: values });
            if (errors.category_ids) setErrors(prev => ({ ...prev, category_ids: '' }));
          }}
          onCreateOption={(inputValue) => {
            const fakeId = `new-${inputValue}-${Date.now()}`;
            const newCat = { id: fakeId, name: inputValue };
            setCategories(prev => [newCat, ...prev]);
            setFormData(prev => ({
              ...prev,
              category_ids: [...prev.category_ids, fakeId]
            }));
            setMessage('Category added locally. It will be created after registration.');
            if (errors.category_ids) setErrors(prev => ({ ...prev, category_ids: '' }));
          }}
          value={categories.filter(cat => formData.category_ids.includes(String(cat.id))).map(cat => ({ value: String(cat.id), label: cat.name }))}
        />
        {errors.category_ids && <p className="error">{errors.category_ids}</p>}

        <button type="submit" className="loginBtn" style={{ margin: "16px 0" }}>Register Store</button>
      </form>
      <button type="button" className="loginBtn" onClick={() => setCurrentStep(1)}>Back</button>
      <p className="register-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );

  return (
    <div className="login-box">
      <div className="login-image">
        <img src={LoginImg} alt="Register Illustration" />
      </div>
      <div className="login-form">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterOwner;
