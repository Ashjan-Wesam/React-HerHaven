import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './UserOrders.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Required',
          text: 'Please log in to view your orders',
          confirmButtonText: 'OK'
        });
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load orders. Please try again later.',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load order details. Please try again.',
        confirmButtonText: 'OK'
      });
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="user-orders">
      <h2 className="user-orders__title">My Orders</h2>

      {orders.length === 0 ? (
        <div className="user-orders__empty">
          <p className="user-orders__empty-text">You don't have any orders yet.</p>
        </div>
      ) : (
        <div className="user-orders__table-container">
          <table className="user-orders__table">
            <thead className="user-orders__table-header">
              <tr>
                <th className="user-orders__table-th">#</th>
                <th className="user-orders__table-th">Total Price</th>
                <th className="user-orders__table-th">Status</th>
                <th className="user-orders__table-th">Payment Method</th>
                <th className="user-orders__table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="user-orders__table-body">
              {orders.map((order, index) => (
                <tr key={order.id} className="user-orders__table-row">
                  <td className="user-orders__table-td">{index + 1}</td>
                  <td className="user-orders__table-td">{order.total_price} JD</td>
                  <td className="user-orders__table-td">
                    <span className={`user-orders__status user-orders__status--${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="user-orders__table-td">{order.payment?.method || 'N/A'}</td>
                  <td className="user-orders__table-td user-orders__actions">
                    <button 
                      className="user-orders__button user-orders__button--view"
                      onClick={() => handleShowDetails(order.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="user-orders__modal-overlay" onClick={closeModal}>
          <div className="user-orders__modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="user-orders__modal-close" onClick={closeModal}>&times;</button>
            <h3 className="user-orders__modal-title">Order Details #{selectedOrder.id}</h3>
            
            <div className="user-orders__modal-summary">
              <div className="user-orders__modal-summary-item">
                <span className="user-orders__modal-summary-label">Total Amount:</span>
                <span className="user-orders__modal-summary-value">{selectedOrder.total_price} JD</span>
              </div>
              <div className="user-orders__modal-summary-item">
                <span className="user-orders__modal-summary-label">Status:</span>
                <span className={`user-orders__status user-orders__status--${selectedOrder.status.toLowerCase()}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="user-orders__modal-summary-item">
                <span className="user-orders__modal-summary-label">Payment Method:</span>
                <span className="user-orders__modal-summary-value">
                  {selectedOrder.payment?.method || 'Not specified'}
                </span>
              </div>
            </div>

            <h4 className="user-orders__modal-subtitle">Order Items</h4>
            <ul className="user-orders__modal-items">
              {selectedOrder.order_details.map((item) => (
                <li key={item.id} className="user-orders__modal-item">
                  <div className="user-orders__modal-item-info">
                    <span className="user-orders__modal-item-product">
                      Product: {item.product?.name || 'N/A'}
                    </span>
                    <span className="user-orders__modal-item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <div className="user-orders__modal-item-price">{item.total_price} JD</div>

                  {item.design_request && (
                    <div className="user-orders__modal-design">
                      <p><strong>Design Request:</strong></p>
                      <p>Details: {item.design_request.design_details}</p>
                      <p>Status: <span className={`user-orders__status user-orders__status--${item.design_request.status.toLowerCase()}`}>{item.design_request.status}</span></p>
                    </div>
                  )}
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
