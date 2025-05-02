import '../assets/css/Login.css'; 
import LoginImg from "../assets/img/download (30).jpg";
import { useNavigate } from 'react-router-dom';

const RegisterSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    if (type === "customer") navigate("/register-customer");
    else if (type === "owner") navigate("/register-owner");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-image">
          <img src={LoginImg} alt="Register Illustration" />
        </div>
        <div className="login-form">
          <h2 className="logo">Her<span>Haven</span></h2>
          <p className="register-prompt">Select your registration type</p>

          <div className="register-options">
            <button 
              className='loginBtn customer-btn' 
              onClick={() => handleSelect("customer")}
            >
              I'm a Customer
            </button>
            <button 
              className='loginBtn owner-btn' 
              onClick={() => handleSelect("owner")}
            >
              I'm a Store Owner
            </button>
          </div>

          <p className="register-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelect;