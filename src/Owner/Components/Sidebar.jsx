const Sidebar = ({ setActiveComponent }) => {
    return (
      <div className="sidebar" data-color="purple" data-image="assets/img/sidebar7.jpg">
        <div className="sidebar-wrapper">
          <div className="logo">
            <a href="#" className="simple-text">
              Owner Name
            </a>
          </div>
          <ul className="nav">
            <li onClick={() => setActiveComponent("Dashboard")}>
              <a href="#">
                <i className="pe-7s-graph"></i>
                <p>Dashboard</p>
              </a>
            </li>
            <li onClick={() => setActiveComponent("Products")}>
              <a href="#">
                <i className="pe-7s-user"></i>
                <p>Products Management</p>
              </a>
            </li>
            <li onClick={() => setActiveComponent("Orders")}>
              <a href="#">
                <i className="pe-7s-note2"></i>
                <p>Orders Management</p>
              </a>
            </li>
            <li onClick={() => setActiveComponent("Discounts")}>
              <a href="#">
                <i className="pe-7s-news-paper"></i>
                <p>Discounts Management</p>
              </a>
            </li>
            <li onClick={() => setActiveComponent("Reviews")}>
              <a href="#">
                <i className="pe-7s-science"></i>
                <p>Reviews Management</p>
              </a>
            </li>
            <li onClick={() => setActiveComponent("Settings")}>
              <a href="#">
                <i className="pe-7s-bell"></i>
                <p>Store Setting</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default Sidebar;
  
