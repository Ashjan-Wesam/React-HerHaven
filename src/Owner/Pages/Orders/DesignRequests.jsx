import { useEffect, useState } from 'react';
import axios from 'axios';
import "../../../assets/css/ownerStyles/DesignRequests.css";

const DesignRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/owner/orders-with-designs', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setRequests(res.data);
        setFilteredRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  useEffect(() => {
    const filtered = requests.filter(({ product, design_request }) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === '' || design_request.status === statusFilter)
    );
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [search, statusFilter, requests]);

  const handleAction = async (id, action) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/owner/design-requests/${id}/update`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

      setRequests(prev =>
        prev.map(item =>
          item.design_request.id === id
            ? { ...item, design_request: { ...item.design_request, status: action } }
            : item
        )
      );
    } catch (error) {
      console.error("Action failed", error.response?.data || error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="design-requests-container">
      <h2 className="design-requests-header">Design Requests</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="design-requests-search"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="design-requests-status-filter"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : currentItems.length === 0 ? (
        <div className="empty-state">No design requests found.</div>
      ) : (
        <div className="requests-grid">
          {currentItems.map(({ design_request, product }) => (
            <div key={design_request.id} className="request-card">
              <h3 className="request-product-name">{product.name}</h3>
              <img
                src={`http://127.0.0.1:8000/${product.image_url}`}
                alt={product.name}
                className="request-product-image"
              />
              <p className="request-details">
                <strong>Design Details:</strong> {design_request.design_details}
              </p>
              <p className="request-details">
                <strong>Status:</strong> 
                <span className={`request-status ${design_request.status}`}>
                  {design_request.status}
                </span>
              </p>

              {design_request.status === 'pending' && (
                <div className="request-actions">
                  <button
                    onClick={() => handleAction(design_request.id, 'approved')}
                    className="action-btn approve"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(design_request.id, 'rejected')}
                    className="action-btn reject"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DesignRequests;
