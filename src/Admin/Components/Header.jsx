import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; 

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  const goToProfile = () => {
    navigate('/admin/edit-profile');
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
          <a className="navbar-brand" href="#">Dashboard</a>
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
