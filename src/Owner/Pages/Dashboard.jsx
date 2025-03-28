import "./assets/css/ownerStyles/dashboard.css"; 

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      
      <div className="row">
        <div className="col">
          <div className="card">
            <h4>Products</h4>
            <p>120 Available</p>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <h4>Orders</h4>
            <p>35 Active</p>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <h4>Revenue</h4>
            <p>$5,000</p>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <h4>Customers</h4>
            <p>250 Registered</p>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <div className="card">
            <h4>Top Selling Products</h4>
            <p>Product A - 500 Sales</p>
            <p>Product B - 320 Sales</p>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <h4>Recent Orders</h4>
            <p>Order #1234 - $50</p>
            <p>Order #1235 - $120</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

