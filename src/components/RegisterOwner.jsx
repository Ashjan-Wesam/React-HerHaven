import { useState, useEffect  } from 'react';
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

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/owner/categories');
      setCategories(response.data);
    } catch (error) {
      setMessage('Failed to load categories');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(item => formDataToSend.append(`${key}[]`, item));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register-owner', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration Failed');
    }
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const handleChange = (e) => {
    const { name, value, options } = e.target;
  
    if (name === 'category_ids') {
      const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
      setFormData({ ...formData, category_ids: selectedValues });
      setShowNewCategoryInput(selectedValues.includes('add_new'));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) {
      setMessage("Please enter a category name");
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/owner/categories', {
        categories: [
          {
            name: newCategoryName,
            description: newCategoryDesc
          }
        ]
      });
      

      const newCat = response.data.category;
      const updatedCategories = [...categories, newCat];
      const updatedCategoryIds = [...formData.category_ids, String(newCat.id)];

      setCategories(updatedCategories);
      setFormData({ ...formData, category_ids: updatedCategoryIds });
      setShowNewCategoryInput(false);
      setNewCategoryName('');
      setNewCategoryDesc('');
      setMessage('Category added and selected');
    } catch (error) {
      setMessage('Failed to add category');
    }
  };

  const renderStep1 = () => (
    <div>
       <h2 className="logo">
            Her<span>Haven</span>
          </h2>
      <p  className="register-prompt">Personal Information</p>
      <form className="loginForm">
        <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <p>Profile Image</p>
        <input type="file" name="profile_picture" onChange={handleFileChange} accept="image/*" />
        <input type="text" name="shipping_address" placeholder="Shipping Address" value={formData.shipping_address} onChange={handleChange} required />
        <button type="button" className="loginBtn" onClick={handleNextStep}>Next</button>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div>
        <h2 className="logo">
            Her<span>Haven</span>
          </h2>
      <p  className="register-prompt">Store Information</p>
      <form  className="loginForm"  onSubmit={handleRegister}>
        <input type="text" name="store_name" placeholder="Store Name" value={formData.store_name} onChange={handleChange} required />
        <textarea style={{ color: 'black' }} name="description" placeholder="Store Description" value={formData.description} onChange={handleChange}></textarea>
        <p>Store Logo</p>
        <input type="file" name="logo_url" onChange={handleFileChange} accept="image/*" />

        <p>Select or Add Categories</p>
<CreatableSelect 
  isMulti
  options={categories.map(cat => ({ value: String(cat.id), label: cat.name }))}
  onChange={(selectedOptions) => {
    const values = selectedOptions.map(opt => opt.value);
    setFormData({ ...formData, category_ids: values });
  }}
  onCreateOption={async (inputValue) => {
    try {
      const token = localStorage.getItem('token');

const response = await axios.post('http://127.0.0.1:8000/api/owner/categories', {
  categories: [{ name: inputValue, description: '' }]
}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      const newCategory = response.data.category;
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);

      setFormData((prevData) => ({
        ...prevData,
        category_ids: [...prevData.category_ids, String(newCategory.id)]
      }));

      setMessage('New category added and selected');
    } catch (error) {
      setMessage('Failed to create category');
    }
  }}
/>


        <button type="submit" className="loginBtn" style={{ margin: "16px 0" }}>Register Store</button>
      </form>
      <button type="button" className="loginBtn" onClick={handleBackStep}>Back</button>
      <p className="register-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
    </div>
  );

  return (
    <div>
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
    </div>
  );
};

export default RegisterOwner;

