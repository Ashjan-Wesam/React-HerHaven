import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import Homeimg from "../../userTemplate/img/icons/bag.png";
import "./Header.css";
import axios from "axios"; 

const Header = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0); 
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 700);
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/cart/count", {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },
        });
        setCartCount(response.data.count);
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [user]);

  return (
    <header className={`header-section ${scrolled ? "scrolled" : ""}`}>
      <div className="container-flui">
        {/* Logo */}
        <div className="site-logo">
          <h2><span>Her</span>Haven</h2>
        </div>

        <div className="nav-switch"><i className="fa fa-bars"></i></div>

        {/* Main menu */}
        <ul className="main-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Stores</Link></li>
          <li><Link to="/about-us">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="header-icons">
          <Link to="/wishlist" className="icon-btn">
            <i className="fa fa-heart"></i>
          </Link>

          {/* Cart */}
          <Link to="/customer/cart" className="icon-btn card-bag">
            <img src={Homeimg} alt="cart" />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          {/* User dropdown */}
          <div className="icon-btn user-btn" onClick={() => setOpen(!open)}>
            <i className="fa fa-user-circle"></i>
            <ul className={`dropdown ${open ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>
              {!user ? (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/customer/edit-profile">Your Profile</Link></li>
                  <li><Link to="/customer/my-orders">My Orders</Link></li>
                  <li><button onClick={logout}>Logout</button></li>
                </>
              )}
            </ul>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
