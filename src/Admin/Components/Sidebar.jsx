import { NavLink } from "react-router-dom";
import img2 from "../../assets/img/sidebar7.jpg"

const Sidebar = () => {
  return (
    <div className="sidebar" data-color="purple" data-image={img2}>
      <div className="sidebar-wrapper">
        <div className="logo">
          <a href="#" className="simple-text">
            Admin Name
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
            <NavLink to="/admin/stores" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-user"></i>
              <p>Categories Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-note2"></i>
              <p>Orders Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/discounts" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-news-paper"></i>
              <p>Discounts Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/reviews" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="pe-7s-science"></i>
              <p>Reviews Management</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
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
