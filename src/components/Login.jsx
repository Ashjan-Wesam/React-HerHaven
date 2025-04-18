import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext"; 
import "../assets/css/Login.css"; 
import LoginImg from "../assets/img/login2.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
            email,
            password,
          });
          
          const userData = {
            id: response.data.user.id,
            name: response.data.user.name,
            role: response.data.user.role,
            token: response.data.token,
          };

          localStorage.setItem("user", JSON.stringify(userData)); 
          localStorage.setItem("token", response.data.token);
          if (userData.role === "owner" && response.data.store) {
            localStorage.setItem("store", JSON.stringify(response.data.store));
          }
          
          
          login(userData); 
          
          switch (userData.role) {
           
            case "owner":
              navigate("/owner");
              break;
            case "admin":
              navigate("/admin");
              break;
            default:
              navigate("/");
              break;
          }
          
    } catch (error) {
      setMessage(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div>
      <div className="login-box">
        <div className="login-image">
          <img src={LoginImg} alt="Login Illustration" />
        </div>
        <div className="login-form">
          <h2 className="logo">
            Her<span>Haven</span>
          </h2>
          <p>Sign into your account</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="loginBtn" type="submit">
              LOGIN
            </button>
          </form>
          {message && <p className="message">{message}</p>}
          <p className="register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p className="forgot-password">
            <Link to="/reset-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
