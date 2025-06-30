import { useEffect, useState } from "react";
import axios from "axios";
import '../../../assets/css/adminStyles/OrderList.css';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const OrderList = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 12;

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
  const lowerSearch = search.toLowerCase();
  filtered = filtered.filter((order) =>
    order.user?.full_name?.toLowerCase().includes(lowerSearch) ||
    order.store?.store_name?.toLowerCase().includes(lowerSearch)
  );
}


    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleEdit = (order) => {
    setEditingOrderId(order.id);
    setEditStatus(order.status);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/admin/orders/${editingOrderId}`, {
        status: editStatus,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      Swal.fire("Updated!", "Order status has been updated.", "success");
      fetchOrders();
      setEditingOrderId(null);
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the order permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/admin/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        Swal.fire("Deleted!", "The order has been deleted.", "success");
        fetchOrders();
      } catch (err) {
        Swal.fire("Error", "Failed to delete the order.", "error");
      }
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="order-list-container">
      <div className="filters">
        <div className="cat-search-container">
          <input
            type="text"
            placeholder="Search by user name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cat-search-input"
          />
          <i className="fas fa-search cat-search-icon"></i>
        </div>

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
          {currentOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.full_name}</td>
              <td>{order.store?.store_name}</td>
              <td>JOD{order.total_price}</td>
              <td>
                {editingOrderId === order.id ? (
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  order.status
                )}
              </td>
              <td>
                {editingOrderId === order.id ? (
                  <>
                    <button className="save-btn" onClick={handleUpdate}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingOrderId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button  onClick={() => navigate(`/admin/orders/${order.id}`)} className="show-category-btn"><i className="fas fa-eye"></i></button>
                    <button  onClick={() => handleEdit(order)} className="edit-category-btn"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDelete(order.id)} className="delete-category-btn"><i className="fas fa-trash-alt"></i></button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {currentOrders.length === 0 && (
            <tr>
              <td colSpan="6" className="no-orders">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
   <div className="owner-pagination">
  <button
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    <i className="fas fa-chevron-left"></i>
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      className={currentPage === i + 1 ? "active" : ""}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    <i className="fas fa-chevron-right"></i>
  </button>
</div>

    </div>
  );
};

export default OrderList;
 