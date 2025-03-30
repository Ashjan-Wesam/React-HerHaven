
import { Link } from "react-router-dom";
import Homeimg from "../../userTemplate/img/icons/bag.png"

const Header = () => {
  return (
    <header className="header-section">
      <div className="container-fluid">
        {/* Logo */}
        <div className="site-logo">
          <h2>
            <span style={{ color: "#fff" }}>Her</span>Haven
          </h2>
        </div>
        {/* Responsive Menu */}
        <div className="nav-switch">
          <i className="fa fa-bars"></i>
        </div>
        {/* Cart Icon */}
        <div className="header-right">
          <Link to="/cart" className="card-bag">
            <img src={Homeimg} alt="cart" />
            <span>2</span>
          </Link>
        </div>
        {/* Navigation Menu */}
        <ul className="main-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/stores">Stores</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
