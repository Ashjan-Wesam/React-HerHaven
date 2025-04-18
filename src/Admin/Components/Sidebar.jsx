import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar" data-color="purple" data-image="assets/img/sidebar7.jpg">
      <div className="sidebar-wrapper">
        <div className="logo">
          <a href="#" className="simple-text">
            Owner Name
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
            <NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>
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
            <NavLink to="/reviews" className={({ isActive }) => isActive ? "active" : ""}>
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
