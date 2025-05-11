import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; 

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  const goToProfile = () => {
    navigate('/owner/edit-profile');
  };

  const getPageTitle = (path) => {
    if (path.includes("/owner/edit-profile")) return "Edit Profile";
    if (path.includes("/owner/settings")) return "Store Settings";
    if (path.includes("/owner/orders")) return "Orders Management";
    if (path.includes("/owner/products")) return "Products Management";
    if (path.includes("/owner/categories")) return "Categories Management";
    if (path.includes("/owner/reviews")) return "Reviews Management";
    if (path.includes("/owner/products")) return "Products Management";
    if (path.includes("/owner/discounts")) return "Discounts Management";
    return "Dashboard";
  };

  return (
    <nav className="navbar navbar-default navbar-fixed header">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">
            {getPageTitle(location.pathname)}
          </a>
        </div>
        <div className="collapse navbar-collapse">
          <ul className="nav navbar-nav navbar-left">
            <li>
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <p className="hidden-lg hidden-md">Dashboard</p>
              </a>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <button onClick={goToProfile} className="btn btn-link">
                <p>Account</p>
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-link">
                <p>Log out</p>
              </button>
            </li>
            <li className="separator hidden-lg"></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
