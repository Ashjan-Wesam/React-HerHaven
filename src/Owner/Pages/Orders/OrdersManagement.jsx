import "../../../assets/css/ownerStyles/Orders.css";
import { useEffect, useState } from "react";
import axios from "axios";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("orders");
  const [stats, setStats] = useState({
    completed: 0,
    notCompleted: 0,
    pendingRequests: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrdersAndRequests = async () => {
      try {
        const [ordersRes, designsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/owner/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/owner/orders-with-designs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const ordersData = ordersRes.data;
        const designOrders = designsRes.data;

        setOrders(view === "orders" ? ordersData : designOrders);

        let completed = 0;
        let notCompleted = 0;
        let pendingRequests = 0;

        ordersData.forEach((order) => {
          if (order.status === "completed") completed++;
          else notCompleted++;
        });

        designOrders.forEach((order) => {
          order.order_details.forEach((detail) => {
            detail.product.design_requests?.forEach((dr) => {
              if (dr.status === "pending") pendingRequests++;
            });
          });
        });

        setStats({ completed, notCompleted, pendingRequests });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchOrdersAndRequests();
  }, [view, token]);

  const updateOrderStatus = async (orderId, status) => {
    await axios.post(
      `http://127.0.0.1:8000/api/owner/orders/${orderId}/complete`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const updateDesignStatus = async (id, status) => {
    await axios.post(
      `http://127.0.0.1:8000/api/owner/design-requests/${id}/update`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setOrders((prev) =>
      prev.map((order) => ({
        ...order,
        order_details: order.order_details.map((detail) => ({
          ...detail,
          product: {
            ...detail.product,
            design_requests: detail.product.design_requests.map((dr) =>
              dr.id === id ? { ...dr, status } : dr
            ),
          },
        })),
      }))
    );
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setSelectedRequest(null);
    setShowModal(true);
  };

  const openRequestModal = (product, request, quantity) => {
    setSelectedRequest({ product, request, quantity });
    setSelectedOrder(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setSelectedRequest(null);
    setShowModal(false);
  };

  return (
    <div className="orders-container">
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
        <div className="stat-card pending">
          <i className="fas fa-palette"></i>
          <div>
            <h4>Pending Requests</h4>
            <p>{stats.pendingRequests}</p>
          </div>
        </div>
      </div>

      <div className="tab-buttons">
        <button
          className={view === "orders" ? "active" : ""}
          onClick={() => setView("orders")}
        >
          Orders
        </button>
        <button
          className={view === "requests" ? "active" : ""}
          onClick={() => setView("requests")}
        >
          Pending Requests
        </button>
      </div>

      <div className="orders-div">

      {view === "orders" &&
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>Order #{order.id}</h3>
            <p>Customer: {order.user.full_name}</p>
            <p>Status: {order.status}</p>

            {order.status !== "completed" && (
              <button onClick={() => updateOrderStatus(order.id, "completed")}>
                Mark as Completed
              </button>
            )}

            <button className="view-btn" onClick={() => openModal(order)}>
              View
            </button>
          </div>
        ))}
    </div>
    <div className="orders-div">
      {view === "requests" &&
        orders
          .flatMap((order) =>
            order.order_details.flatMap((detail) =>
              (detail.product.design_requests || []).map((dr) => ({
                designRequest: dr,
                product: detail.product,
                quantity: detail.quantity,
              }))
            )
          )
          .map(({ designRequest, product, quantity }) => (
            <div key={designRequest.id} className="order-card">
              <h3>{product.name}</h3>
              <div>
              <p>
                <strong>Quantity:</strong> {quantity}
              </p>
              <p>
                <strong>Design:</strong> {designRequest.design_details}
              </p>
              <p>Status: {designRequest.status}</p>
</div>
              {designRequest.status === "pending" && (
                <div>
                  <button onClick={() => updateDesignStatus(designRequest.id, "approved")}>
                    Approve
                  </button>
                  <button onClick={() => updateDesignStatus(designRequest.id, "rejected")}>
                    Reject
                  </button>
                </div>
              )}

              <button
                className="view-btn"
                onClick={() => openRequestModal(product, designRequest, quantity)}
              >
                View
              </button>
            </div>
          ))}
          </div>

      {showModal && (selectedOrder || selectedRequest) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {selectedOrder && (
              <>
                <h3>Order #{selectedOrder.id} - Design Requests</h3>
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
                    {detail.product.design_requests?.map((dr) => (
                      <div key={dr.id} className="modal-design-request">
                        <p><strong>Design Details:</strong> {dr.design_details}</p>
                        <p><strong>Status:</strong> {dr.status}</p>
                        {dr.status === "pending" && (
                          <div className="modal-actions">
                            <button onClick={() => updateDesignStatus(dr.id, "approved")}>Approve</button>
                            <button onClick={() => updateDesignStatus(dr.id, "rejected")}>Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}

            {selectedRequest && (
              <>
                <h3>Design Request - {selectedRequest.product.name}</h3>
                <div className="modal-product-block">
                  <div className="modal-product-info">
                    <img
                      src={`http://127.0.0.1:8000/${selectedRequest.product.image_url}`}
                      alt={selectedRequest.product.name}
                      className="modal-product-image"
                    />
                    <div className="modal-product-text">
                      <p><strong>Product:</strong> {selectedRequest.product.name}</p>
                      <p><strong>Price:</strong> ${selectedRequest.product.price}</p>
                      <p><strong>Quantity:</strong> {selectedRequest.quantity}</p>
                      <p><strong>Design Details:</strong> {selectedRequest.request.design_details}</p>
                      <p><strong>Status:</strong> {selectedRequest.request.status}</p>
                      {selectedRequest.request.status === "pending" && (
                        <div className="modal-actions">
                          <button onClick={() => updateDesignStatus(selectedRequest.request.id, "approved")}>Approve</button>
                          <button onClick={() => updateDesignStatus(selectedRequest.request.id, "rejected")}>Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
