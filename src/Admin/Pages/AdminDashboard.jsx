import "../../assets/css/ownerStyles/dashboard.css";
import { useEffect, useState } from "react";

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
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0,
    owners:0,
    reviews:0
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
      <div className="dashboard-container"  style={{ backgroundColor: 'white' }}>
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ color: purpleTheme.primary }}
        >
          <i className="fas fa-circle-notch fa-3x"></i>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" >
      <motion.h2 
        className="dashboard-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ color: purpleTheme.text }}
      >
        
      </motion.h2>
      
      <div className="stats-grid">
  <motion.div className="stat-card" whileHover={{ scale: 1.03 }}
    style={{
      background: `linear-gradient(135deg, ${purpleTheme.light} 0%, white 100%)`
    }}>
    <div className="card-icon" >
      <i className="fas fa-box-open"></i>
    </div>
    <h3 style={{ color: purpleTheme.text }}>Products</h3>
    <motion.p style={{ color: purpleTheme.dark }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
      {stats.products.toLocaleString()}
    </motion.p>
    <div className="card-footer">Available</div>
  </motion.div>

  <motion.div className="stat-card" whileHover={{ scale: 1.03 }}
    style={{
      background: `linear-gradient(135deg, ${purpleTheme.light} 0%, white 100%)`
    }}>
    <div className="card-icon">
      <i className="fas fa-shopping-cart"></i>
    </div>
    <h3 style={{ color: purpleTheme.text }}>Orders</h3>
    <motion.p style={{ color: purpleTheme.dark }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
      {stats.orders.toLocaleString()}
    </motion.p>
    <div className="card-footer">Active</div>
  </motion.div>

  <motion.div className="stat-card" whileHover={{ scale: 1.03 }}
    style={{
      background: `linear-gradient(135deg, ${purpleTheme.light} 0%, white 100%)`
    }}>
    <div className="card-icon" >
      <i className="fas fa-dollar-sign"></i>
    </div>
    <h3 style={{ color: purpleTheme.text }}>Revenue</h3>
    <motion.p style={{ color: purpleTheme.dark }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
      ${stats.revenue.toLocaleString()}
    </motion.p>
    <div className="card-footer">Total</div>
  </motion.div>

  <motion.div className="stat-card" whileHover={{ scale: 1.03 }}
    style={{
      background: `linear-gradient(135deg, ${purpleTheme.light} 0%, white 100%)`
    }}>
    <div className="card-icon">
      <i className="fas fa-user-friends"></i>
    </div>
    <h3 style={{ color: purpleTheme.text }}>Customers</h3>
    <motion.p style={{ color: purpleTheme.dark }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
      {stats.customers.toLocaleString()}
    </motion.p>
    <div className="card-footer">Registered</div>
  </motion.div>

  <motion.div className="stat-card" whileHover={{ scale: 1.03 }}
    style={{
      background: `linear-gradient(135deg, ${purpleTheme.light} 0%, white 100%)`
    }}>
    <div className="card-icon" >
      <i className="fas fa-star"></i>
    </div>
    <h3 style={{ color: purpleTheme.text }}>Reviews</h3>
    <motion.p style={{ color: purpleTheme.dark }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
      {stats.reviews.toLocaleString()}
    </motion.p>
    <div className="card-footer">Submitted</div>
  </motion.div>

  <motion.div className="stat-card" whileHover={{ scale: 1.03 }}
    style={{
      background: `linear-gradient(135deg, ${purpleTheme.light} 0%, white 100%)`
    }}>
    <div className="card-icon" >
      <i className="fas fa-user-tie"></i>
    </div>
    <h3 style={{ color: purpleTheme.text }}>Owners</h3>
    <motion.p style={{ color: purpleTheme.dark }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
      {stats.owners.toLocaleString()}
    </motion.p>
    <div className="card-footer">Registered</div>
  </motion.div>
</div>


 {/* Charts Section */}
      <div className="charts-grid">
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="chart-header">
            <i className="fas fa-chart-line" style={{ color: purpleTheme.accent }}></i>
            <h3>Sales Trend</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke={purpleTheme.primary} 
                  strokeWidth={3}
                  dot={{ fill: purpleTheme.accent, r: 5 }}
                  activeDot={{ r: 8, fill: purpleTheme.dark }}
                />
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="chart-header">
            <i className="fas fa-chart-pie" style={{ color: purpleTheme.accent }}></i>
            <h3>Sales Distribution</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* Top Products and Recent Orders */}
      <div className="content-grid">
        <motion.div 
          className="content-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-header" style={{ borderBottom: `2px solid ${purpleTheme.light}` }}>
            <i className="fas fa-trophy" style={{ color: purpleTheme.accent }}></i>
            <h3>Top Selling Products</h3>
          </div>
          <div className="product-list">
            {topProducts.map((product, index) => (
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
                    width: `${(product.sales / topProducts[0].sales) * 100}%`,
                    background: COLORS[index % COLORS.length]
                  }}
                ></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="content-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-header" style={{ borderBottom: `2px solid ${purpleTheme.light}` }}>
            <i className="fas fa-bolt" style={{ color: purpleTheme.accent }}></i>
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
                  <span>#{order.id}</span>
                </div>
                <div className="order-amount" style={{ color: purpleTheme.primary }}>
                  ${order.amount.toLocaleString()}
                </div>
                <div className="order-status" style={{ 
                  background: order.status === 'completed' ? purpleTheme.success : purpleTheme.warning,
                  color: 'white'
                }}>
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