import { useEffect, useState } from "react";
import axios from "axios";
import '../../../assets/css/adminStyles/OrderList.css';
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const navigate = useNavigate(); 

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [search, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (search) {
      filtered = filtered.filter((order) =>
        order.user?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleView = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/orders/${id}/edit`);
  };

  return (
    <div className="order-list-container">
      <h1 className="title">Orders</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by user name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-select"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Store</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.full_name}</td>
              <td>{order.store?.store_name}</td>
              <td>${order.total_price}</td>
              <td>{order.status}</td>
              <td>
                <button className="view-btn" onClick={() => handleView(order.id)}>View</button>
                <button className="edit-btn" onClick={() => handleEdit(order.id)}>Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}

          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan="6" className="no-orders">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
