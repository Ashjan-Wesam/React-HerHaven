import { useEffect, useState } from "react";
import axios from "axios";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found, please log in again.");
        return;
      }

      const res = await axios.get("http://127.0.0.1:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (error) {
      alert("Failed to delete the order.");
    }
  };

  const handleShowDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://127.0.0.1:8000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedOrder(res.data.order);
    } catch (error) {
      alert("Failed to fetch order details.");
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="user-orders">
      <h2>My Orders</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Payment Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{order.total_price} JD</td>
              <td>{order.status}</td>
              <td>{order.payment?.method}</td>
              <td>
                <button onClick={() => handleShowDetails(order.id)}>View</button>
                {order.status === "pending" && order.payment?.method === "cod" && (
                  <button onClick={() => handleDelete(order.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>&times;</button>
            <h3>Order Details #{selectedOrder.id}</h3>
            <ul>
              {selectedOrder.order_details.map((item) => (
                <li key={item.id}>
                  Product ID: {item.product_id} — Quantity: {item.quantity} — Total: {item.total_price} JD
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
