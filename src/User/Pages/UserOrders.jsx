import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './UserOrders.css';
import Loading from "../../Owner/Components/Loading";
import no_order from  "../../userTemplate/img/noOrder.jpg"

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter]);

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
      setOrders(res.data.orders || []);
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

  const applyFilters = () => {
    let filtered = [...orders];

    // Search by product name
    if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(order =>
      order.order_details?.some(detail =>
        detail.product?.name?.toLowerCase().includes(term) ||
        detail.product?.store?.store_name?.toLowerCase().includes(term)
      )
    );
  }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page after filtering
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

  useEffect(() => {
  if (selectedOrder) {
    console.log("Selected Order:", selectedOrder);
  }
}, [selectedOrder]);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <Loading />;

  return (
    <div className="user-orders">
      <h2 className="text-2xl font-bold mb-4 page-user-title">My Orders</h2>

      <div className="user-orders__controls">
          <div className="cat-search-container">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
           className="cat-search-input"
          />
          <i className="fas fa-search cat-search-icon"></i>
</div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-filter"
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Approved</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
         <div style={{ margin: "auto" }} className="cat-no-products">
                        <img src={no_order} alt="No products" className="cat-no-products-img" />
                        <p>No Orders Found.</p>
                      </div>
      ) : (
        <>
          <div className="user-orders__table-container">
            <table className="user-orders__table">
            <thead className="orderr-thead">
  <tr>
    <th>#</th>
    <th>Total Price</th>
    <th>Status</th>
    <th>Payment</th>
    <th>Store</th>
    <th>Actions</th>
  </tr>
</thead>

              <tbody>
                {paginatedOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{order.total_price} JD</td>
                    <td>
                      <span className={`user-orders__status user-orders__status--${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.payment?.method || 'N/A'}</td>
                    <td>
  {
    order.order_details?.[0]?.product?.store?.store_name || 'N/A'
  }
</td>
<td>
  <button className="user-orders__button user-orders__button--view" onClick={() => handleShowDetails(order.id)}>
    View Details
  </button>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
          <div className="owner-pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
           <div className='div-nums'>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}</div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
               <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
        </>
      )}

      {selectedOrder && (
        <div className="user-orders__modal-overlay" onClick={closeModal}>
          <div className="user-orders__modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="user-orders__modal-close" onClick={closeModal}>&times;</button>
            <h3 className="user-orders__modal-title">Order #{selectedOrder.id}</h3>

            <div className="user-orders__modal-summary">
              <p>Total: {selectedOrder.total_price} JD</p>
              <p>Status: <span className={`user-orders__status user-orders__status--${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span></p>
              <p>Payment Method: {selectedOrder.payment?.method || 'Not specified'}</p>
            </div>

            <h4>Order Items</h4>
         <ul>
  {selectedOrder.order_details.map((item) => (
    <li key={item.id} className="user-orders__modal-item">
      <p>Product: {item.product?.name || 'N/A'} (x{item.quantity})</p>
      <p><strong>Store:</strong> {item.product?.store?.store_name || 'N/A'}</p>
      <p>Total: {item.total_price} JOD</p>
      {item.design_request && (
        <div className="user-orders__modal-design">
          <p><strong>Design Request:</strong> {item.design_request.design_details}</p>
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
