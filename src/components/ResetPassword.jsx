import { useState } from "react";
import "../assets/css/Login.css";
import LoginImg from "../assets/img/login2.jpg";
import Header from "../User/Components/Header";
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
        
      const response = await axios.post("http://localhost/api/reset-password", {
        email,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div>
      <div className="login-box">
        <div className="login-image">
          <img src={LoginImg} alt="Reset Password Illustration" />
        </div>
        <div className="login-form">
          <h2 className="logo">Her<span>Haven</span></h2>
          <p>Reset your password</p>
          <form onSubmit={handleReset}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="loginBtn" type="submit">Send Reset Link</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
