import { NavLink } from "react-router-dom";
import { useAuth } from "../../AuthContext"; 
import img2 from "../../assets/img/sidebar7.jpg"

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="sidebar" data-color="purple" data-image={img2}>
      <div className="sidebar-wrapper">
        <div className="logo">
          <a href="#" className="simple-text" style={{ fontWeight: "bold" , textAlign: "center" }}>
            Welcome {user.name }
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
              <i className="pe-7s-user"></i>
              <p>Products Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/owner/orders" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-note2"></i>
              <p>Orders Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/owner/discounts" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-news-paper"></i>
              <p>Discounts Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/owner/reviews" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-science"></i>
              <p>Reviews Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/owner/settings" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-bell"></i>
              <p>Store Setting</p>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
