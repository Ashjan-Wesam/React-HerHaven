import "../../assets/css/ownerStyles/dashboard.css";
import { useEffect, useState } from "react";
import Loading from "../../Owner/Components/Loading";
import "../../assets/css/adminStyles/dash.css";

import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  
} from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0,
    owners: 0,
    reviews: 0
  });

  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/owner/dashboard-stats")
      .then((response) => {
        const data = response.data;
        setStats({
          products: data.products,
          orders: data.orders,
          revenue: data.revenue,
          customers: data.customers,
          owners: data.owners,
          reviews: data.reviews,
        });
        setTopProducts(data.topProducts);
        setRecentOrders(data.recentOrders);
        setChartData(data.chartData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      });
  }, []);

  const purpleTheme = {
    primary: '#7E57C2',
    secondary: '#9575CD',
    light: '#D1C4E9',
    dark: '#5E35B1',
    background: 'linear-gradient(135deg, #F3E5F5 0%, #EDE7F6 100%)',
    accent: '#B388FF',
    text: '#311B92',
    success: '#7CB342',
    warning: '#FFA000',
    info: '#00ACC1'
  };

  const COLORS = ['#7E57C2', '#9575CD', '#B39DDB', '#D1C4E9', '#EDE7F6'];

  if (loading) {
    return (
      <Loading />
    );
  }

  const modifiedChartData = chartData.map(item => ({
    ...item,
    month: `Admin ${item.month}`
  }));

  const modifiedTopProducts = topProducts.map(product => ({
    ...product,
    name: `Admin ${product.name}`
  }));

  return (
    <div className="dashboard-container">
    
      
      <div className="stats-grid">
        <motion.div className="stat-card admin-stat-card" whileHover={{ scale: 1.03 }}
         >
          <div className="card-icon">
            <i className="fas fa-box-open"></i>
          </div>
          <div className="admin-card-dash">
          <h3>Products</h3>
          <motion.p style={{ color: "#444" }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            {stats.products.toLocaleString()}
          </motion.p>
          <div className="card-footer">Available</div>
          </div>
        </motion.div>

        <motion.div className="stat-card admin-stat-card" whileHover={{ scale: 1.03 }}>
          <div className="card-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="admin-card-dash">
          <h3>Orders</h3>
          <motion.p style={{ color:"#444" }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            {stats.orders.toLocaleString()}
          </motion.p>
          <div className="card-footer">Active</div>
          </div>
        </motion.div>

        <motion.div className="stat-card admin-stat-card" whileHover={{ scale: 1.03 }}>
          <div className="card-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="admin-card-dash">
          <h3>Revenue</h3>
          <motion.p style={{ color: "#444" }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            JOD {stats.revenue.toLocaleString()}
          </motion.p>
          <div className="card-footer">Total</div>
          </div>
        </motion.div>

        <motion.div className="stat-card admin-stat-card" whileHover={{ scale: 1.03 }}>
          <div className="card-icon">
            <i className="fas fa-user-friends"></i>
          </div>
           <div className="admin-card-dash">
          <h3>Customers</h3>
          <motion.p style={{ color: "#444"}} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            {stats.customers.toLocaleString()}
          </motion.p>
          <div className="card-footer">Registered</div>
          </div>
        </motion.div>

        <motion.div className="stat-card admin-stat-card" whileHover={{ scale: 1.03 }}>
          <div className="card-icon">
            <i className="fas fa-star"></i>
          </div>
           <div className="admin-card-dash">
          <h3>Reviews</h3>
          <motion.p style={{ color: "#444" }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            {stats.reviews.toLocaleString()}
          </motion.p>
          <div className="card-footer">Submitted</div>
          </div>
        </motion.div>

        <motion.div className="stat-card admin-stat-card" whileHover={{ scale: 1.03 }}>
          <div className="card-icon">
            <i className="fas fa-user-tie"></i>
          </div>
           <div className="admin-card-dash">
          <h3 >Owners</h3>
          <motion.p style={{ color: "#444" }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            {stats.owners.toLocaleString()}
          </motion.p>
          <div className="card-footer">Registered</div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
    
       
        <motion.div 
          className="chart-card-admin"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modifiedChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={purpleTheme.light} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: purpleTheme.text }}
                />
                <YAxis 
                  tick={{ fill: purpleTheme.text }}
                />
                <Tooltip 
                  contentStyle={{
                    background: purpleTheme.dark,
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    boxShadow: `0 4px 12px ${purpleTheme.light}`
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="sales" 
                  fill={purpleTheme.primary} 
                  name="Admin Sales"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        
      
      {/* Top Products and Recent Orders */}
      <div className="content-flex-admin">
        <motion.div 
          className="content-card content-card-admin"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-header-admin" >
            <h3>Top Selling Products</h3>
          </div>
          <div className="order-list">
            {modifiedTopProducts.map((product, index) => (
              <motion.div 
                key={index} 
                className="product-item"
                whileHover={{ x: 5 }}
                style={{ borderBottom: `1px dashed ${purpleTheme.light}` }}
              >
                <div className="product-rank" style={{ background: COLORS[index % COLORS.length] }}>
                  #{index + 1}
                </div>
                <div className="product-info">
                  <span style={{ color: purpleTheme.text }}>{product.name}</span>
                  <span style={{ color: purpleTheme.dark }}>{product.sales} Sales</span>
                </div>
                <div 
                  className="sales-bar" 
                  style={{ 
                    width: `${(product.sales / modifiedTopProducts[0].sales) * 100}%`,
                    background: COLORS[index % COLORS.length]
                  }}
                ></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="content-card content-card-admin"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-header-admin" >
            <h3>Recent Orders</h3>
          </div>
          <div className="order-list">
            {recentOrders.map((order) => (
              <motion.div 
                key={order.id} 
                className="order-item"
                whileHover={{ x: 5 }}
                style={{ borderBottom: `1px dashed ${purpleTheme.light}` }}
              >
                <div className="order-id">
                  <i className="fas fa-receipt" style={{ color: purpleTheme.secondary }}></i>
                  <span> {order.id}</span>
                </div>
                <div className="order-amount" style={{ color: purpleTheme.primary }}>
                  JOD{order.amount.toLocaleString()}
                </div>
                <div className="order-status">
                  {order.status}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;