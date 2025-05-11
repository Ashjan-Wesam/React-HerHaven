import "../../../assets/css/ownerStyles/Orders.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    completed: 0,
    notCompleted: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRes = await axios.get("http://127.0.0.1:8000/api/owner/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ordersData = ordersRes.data;
        setOrders(ordersData);
        setFilteredOrders(ordersData);

        let completed = 0;
        let notCompleted = 0;

        ordersData.forEach((order) => {
          if (order.status === "completed") completed++;
          else notCompleted++;
        });

        setStats({ completed, notCompleted });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchOrders();
  }, [token]);

  useEffect(() => {
    // Apply filters whenever searchTerm or statusFilter changes
    let result = orders;

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toString().includes(term) ||
        order.user.full_name.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to mark this order as completed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, mark as completed!",
      });

      if (result.isConfirmed) {
        await axios.post(
          `http://127.0.0.1:8000/api/owner/orders/${orderId}/complete`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedOrders = orders.map((order) => 
          order.id === orderId ? { ...order, status } : order
        );

        setOrders(updatedOrders);
        
        // Update stats
        setStats({
          completed: status === "completed" ? stats.completed + 1 : stats.completed - 1,
          notCompleted: status === "completed" ? stats.notCompleted - 1 : stats.notCompleted + 1,
        });

        Swal.fire(
          "Completed!",
          "The order has been marked as completed.",
          "success"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        "There was an error updating the order status.",
        "error"
      );
      console.error("Failed to update order status:", error);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const handleNavigateToDesignRequests = () => {
    navigate("/owner/orders-req"); 
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          
          <div className="status-filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              {/* Add other status options as needed */}
            </select>
          </div>
        </div>

        <div className="orders-stats">
          <div className="stat-card completed">
            <i className="fas fa-check-circle"></i>
            <div>
              <h4>Completed Orders</h4>
              <p>{stats.completed}</p>
            </div>
          </div>
          <div className="stat-card not-completed">
            <i className="fas fa-hourglass-half"></i>
            <div>
              <h4>Not Completed Orders</h4>
              <p>{stats.notCompleted}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-buttons">
        <button className="active">
          Orders
        </button>
        <button onClick={handleNavigateToDesignRequests}>
          Pending Requests
        </button>
      </div>

      <div className="orders-div">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>Order #{order.id}</h3>
              <p>Customer: {order.user.full_name}</p>
              <p>Status: 
                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>
              </p>

              {order.status !== "completed" && (
                <button onClick={() => updateOrderStatus(order.id, "completed")}>
                  Mark as Completed
                </button>
              )}

              <button className="view-btn" onClick={() => openModal(order)}>
                View
              </button>
            </div>
          ))
        ) : (
          <div className="no-orders-found">
            <p>No orders found matching your criteria</p>
          </div>
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Order #{selectedOrder.id}</h3>
            {selectedOrder.order_details.map((detail) => (
              <div key={detail.id} className="modal-product-block">
                <div className="modal-product-info">
                  <img
                    src={`http://127.0.0.1:8000/${detail.product.image_url}`}
                    alt={detail.product.name}
                    className="modal-product-image"
                  />
                  <div className="modal-product-text">
                    <p><strong>Product:</strong> {detail.product.name}</p>
                    <p><strong>Price:</strong> ${detail.product.price}</p>
                    <p><strong>Quantity:</strong> {detail.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;