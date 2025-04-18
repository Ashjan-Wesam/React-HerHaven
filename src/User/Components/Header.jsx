import { Link } from "react-router-dom";
import Homeimg from "../../userTemplate/img/icons/bag.png";
import { useAuth } from "../../AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header-section">
      <div className="container-fluid">
        {/* logo */}
        <div className="site-logo">
          <h2>
            <span style={{ color: "#fff" }}>Her</span>Haven
          </h2>
        </div>

        {/* responsive */}
        <div className="nav-switch">
          <i className="fa fa-bars"></i>
        </div>

        {/* header icons */}
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* cart */}
          <Link to="/cart" className="card-bag">
            <img src={Homeimg} alt="Cart" />
            <span>2</span>
          </Link>

          {/* auth buttons */}
          {!user ? (
            <>
              <Link to="/login" className="auth-btn" style={buttonStyle}>
                <i className="fa fa-sign-in"></i> Login
              </Link>
              <Link to="/register" className="auth-btn" style={buttonStyle}>
                <i className="fa fa-user-plus"></i> Register
              </Link>
            </>
          ) : (
            <button onClick={logout} style={{ ...buttonStyle, background: '#414141' }}>
              <i className="fa fa-sign-out"></i> Logout
            </button>
          )}
        </div>

        {/* site menu */}
        <ul className="main-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="#">Stores</Link></li>
          <li><Link to="#">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </header>
  );
};

// Simple inline style for buttons
const buttonStyle = {
  color: "#fff",
  background: "#414141",
  padding: "6px 12px",
  borderRadius: "4px",
  textDecoration: "none",
  border: "none",
  fontSize: "14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

export default Header;
