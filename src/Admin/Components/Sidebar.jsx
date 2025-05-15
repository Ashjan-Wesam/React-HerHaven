import { NavLink } from "react-router-dom";
import img2 from "../../assets/img/sidebar7.jpg"
import { useState } from "react";
import { useAuth } from "../../AuthContext";

 




const Sidebar = () => {

 const { user } = useAuth();
  const [showOrdersSubMenu, setShowOrdersSubMenu] = useState(false);
  const [showReviewsSubMenu, setShowReviewsSubMenu] = useState(false);



  return (
    <div className="sidebar" data-color="purple" data-image={img2}>
      <div className="sidebar-wrapper">
        <div className="logo">
          <a href="#" className="simple-text">
             Welcome {user.name}
          </a>
        </div>
        <ul className="nav">
          <li>
            <NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-graph"></i>
              <p>Dashboard</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-user"></i>
              <p>Users Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/stores" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-user"></i>
              <p>Stores Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-user"></i>
              <p>Categories Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-user"></i>
              <p>Products Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-note2"></i>
              <p>Orders Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/discounts" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-news-paper"></i>
              <p>Discounts Management</p>
            </NavLink>
          </li>
          <li>  
            <NavLink to="/admin/reviews/sites" className={({ isActive }) => isActive ? "active" : ""} onClick={() => {
              setShowReviewsSubMenu(!showReviewsSubMenu);
              setShowOrdersSubMenu(false); 
            }}> 
              <i className="pe-7s-science"></i>
              <p>Reviews Management</p>
            </NavLink>
             {showReviewsSubMenu && (
              <ul className="submenu">
                <li>
                  <NavLink to="/admin/reviews/sites" className={({ isActive }) => isActive ? "active" : ""}>
                    HerHaven Reviews
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/reviews/stores" className={({ isActive }) => isActive ? "active" : ""}>
                    Store Reviews
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/reviews/products" className={({ isActive }) => isActive ? "active" : ""}>
                    Products Reviews
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="/admin/profile" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-bell"></i>
              <p>Profile Setting</p>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
