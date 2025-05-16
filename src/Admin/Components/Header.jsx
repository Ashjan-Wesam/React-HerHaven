import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; 

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  const location = useLocation();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  const goToProfile = () => {
    navigate('/admin/edit-profile');
  };
    const getPageTitle = (path) => {

    //User Management
    if (path.includes("/admin/users")) return "Users Management";

    //Store Management
    if (path === "/admin/stores") return "Stores Management";
    if (path === "/admin/stores/create") return "Stores Management / Create New Store";
    if (path.startsWith("/admin/stores/edit/")) return "Stores Management / Edit Store";
    if (path.startsWith("/admin/stores/") && !path.includes("edit")) return "Stores Management / Store Details";

    //categories Management
    if (path === "/admin/categories") return "Categories Management";

    //Products Management
    if (path === "/admin/products") return "Products Management";
    if (path === "/admin/products/create") return "Products Management / Create New Product";
    if (path.startsWith("/admin/products/edit/")) return "Products Management / Edit Product";
    if (path.startsWith("/admin/products/") && !path.includes("edit")) return "Products Management / Product Details";

    //Orders Management
    if (path === "/admin/orders") return "Orders Management";
    if (path.startsWith("/admin/orders/") && !path.includes("edit")) return "Orders Management / Order Details";

    //Discounts Management
    if (path === "/admin/discounts") return "Discounts Management";
    if (path === "/admin/discounts/add") return "Discounts Management / Add New Discount";
    if (path.startsWith("/admin/discounts/edit/") ) return "Discounts Management / Edit Discount";

    //Reviews Management
    if (path === "/admin/reviews/sites") return "HerHaven Reviews";
    if (path === "/admin/reviews/stores") return "Stores Reviews";
    if (path === "/admin/reviews/products") return "Products Reviews";
   
    // Profile MAnagement


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
          <a className="navbar-brand" href="#"> {getPageTitle(location.pathname)}</a>
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
