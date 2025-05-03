import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaBox, FaCheckCircle, FaMoneyBillWave, FaStar, 
  FaTags, FaClock, FaPalette, FaShoppingCart,
  FaChartLine, FaListAlt
} from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import "../../assets/css/ownerStyles/dashboard.css";

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    products_count: 0,
    completed_orders_count: 0,
    pending_orders_count: 0,
    reviews_count: 0,
    categories_count: 0,
    design_requests_count: 0,
    sold_products_count: 0,
    revenue: 0,
    top_selling_products: [],
    recent_orders: [],
    products_per_category: [],
  
  });

  const store = JSON.parse(localStorage.getItem("store"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/owner/dashboard/${store.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    if (store?.id) {
      fetchStats();
    }
  }, [store?.id, token]);

  // Prepare chart data
  // Prepare chart data

  const categoryChartData = {
    labels: stats.products_per_category?.map(item => item.name),
    datasets: [
      {
        label: 'Products per Category',
        data: stats.products_per_category?.map(item => item.products_count),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };
  
  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  


 

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Store Dashboard</h1>
      </div>

      {/* First Row - Key Metrics */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="card-icon products">
            <FaBox />
          </div>
          <div className="card-content">
            <h4>Products</h4>
            <p>{stats.products_count}</p>
            <span className="card-subtext">Available in store</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon orders">
            <FaCheckCircle />
          </div>
          <div className="card-content">
            <h4>Completed Orders</h4>
            <p>{stats.completed_orders_count}</p>
            <span className="card-subtext">Successful deliveries</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div className="card-content">
            <h4>Revenue</h4>
            <p>{stats.revenue?.toLocaleString()} JD</p>
            <span className="card-subtext">Total earnings</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon reviews">
            <FaStar />
          </div>
          <div className="card-content">
            <h4>Reviews</h4>
            <p>{stats.reviews_count}</p>
            <span className="card-subtext">Customer feedback</span>
          </div>
        </div>
      </div>

      {/* Second Row - Additional Metrics */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="card-icon categories">
            <FaTags />
          </div>
          <div className="card-content">
            <h4>Categories</h4>
            <p>{stats.categories_count}</p>
            <span className="card-subtext">Product categories</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon pending">
            <FaClock />
          </div>
          <div className="card-content">
            <h4>Pending Orders</h4>
            <p>{stats.pending_orders_count}</p>
            <span className="card-subtext">Awaiting fulfillment</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon designs">
            <FaPalette />
          </div>
          <div className="card-content">
            <h4>Design Requests</h4>
            <p>{stats.design_requests_count}</p>
            <span className="card-subtext">Custom designs</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon sold">
            <FaShoppingCart />
          </div>
          <div className="card-content">
            <h4>Products Sold</h4>
            <p>{stats.sold_products_count}</p>
            <span className="card-subtext">Total products sold</span>
          </div>
        </div>
      </div>


      <div className="dashboard-row">

      <div className="dashboard-card large-card">
  <h4><FaChartLine /> Products by Category</h4>
  <div className="chart-container">
    <Bar data={categoryChartData} options={categoryChartOptions} />
  </div>
</div>
</div>

     

      {/* Fourth Row - Lists */}
      <div className="dashboard-row">
        <div className="dashboard-card large-card">
          <h4><FaListAlt /> Top Selling Products</h4>
          <ul className="card-list">
            {stats.top_selling_products?.map((product, index) => (
              <li key={index}>
                <span>{product.name}</span>
                <span><strong>{product.sold}</strong> sold</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="dashboard-card large-card">
          <h4><FaListAlt /> Recent Orders</h4>
          <ul className="card-list">
            {stats.recent_orders?.map((order) => (
              <li key={order.id}>
                <div>
                  <span>Order #{order.id}</span>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;