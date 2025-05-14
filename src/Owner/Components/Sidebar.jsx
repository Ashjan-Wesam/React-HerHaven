import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import img2 from "../../assets/img/sidebar7.jpg";

const Sidebar = () => {
  const { user } = useAuth();
  const [showOrdersSubMenu, setShowOrdersSubMenu] = useState(false);
  const [showReviewsSubMenu, setShowReviewsSubMenu] = useState(false);

  return (
    <div className="sidebar" data-color="purple" data-image={img2}>
      <div className="sidebar-wrapper">
        <div className="logo">
          <a href="#" className="simple-text" style={{ fontWeight: "bold", textAlign: "center" }}>
            Welcome {user.name}
          </a>
        </div>
        <ul className="nav">
          <li>
            <NavLink to="/owner" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-graph"></i>
              <p>Dashboard</p>
            </NavLink>
          </li>

          <li>
            <NavLink to="/owner/categories" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-user"></i>
              <p>Categories Management</p>
            </NavLink>
          </li>

          <li>
            <NavLink to="/owner/products" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-box2"></i>
              <p>Products Management</p>
            </NavLink>
          </li>

          <li>
              <NavLink to="/owner/orders" className={({ isActive }) => isActive ? "active" : ""}  onClick={() => {
              setShowOrdersSubMenu(!showOrdersSubMenu);
            }}>
                <i className="pe-7s-note2"></i>
                <p>Orders Management</p>
              </NavLink>

            {showOrdersSubMenu && (
              <ul className="submenu">
                <li>
                  <NavLink to="/owner/orders" className={({ isActive }) => isActive ? "active" : ""}>
                    Store Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/owner/orders-req" className={({ isActive }) => isActive ? "active" : ""}>
                    Design Requests
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink to="/owner/discounts" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-news-paper"></i>
              <p>Discounts Management</p>
            </NavLink>
          </li>

          <li>
              <NavLink to="/owner/reviews" className={({ isActive }) => isActive ? "active" : ""} onClick={() => {
              setShowReviewsSubMenu(!showReviewsSubMenu);
              setShowOrdersSubMenu(false); 
            }}>
                <i className="pe-7s-star"></i>
                <p>Reviews Management</p>
              </NavLink>
        

            {showReviewsSubMenu && (
              <ul className="submenu">
                <li>
                  <NavLink to="/owner/reviews" className={({ isActive }) => isActive ? "active" : ""}>
                    HerHaven Reviews
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/owner/reviewsStore" className={({ isActive }) => isActive ? "active" : ""}>
                    Store Reviews
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/owner/productsStore" className={({ isActive }) => isActive ? "active" : ""}>
                    Products Reviews
                  </NavLink>
                </li>
              </ul>
            )}
          </li>


          <li>
            <NavLink to="/owner/settings" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-tools"></i>
              <p>Store Setting</p>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
