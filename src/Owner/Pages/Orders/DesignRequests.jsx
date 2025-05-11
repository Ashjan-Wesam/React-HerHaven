import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../../../assets/css/ownerStyles/DesignRequests.css";
import Loading from '../../Components/Loading';
import notfound from '../../../assets/img/nofound.jpg';

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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load design requests',
        });
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
      const result = await Swal.fire({
        title: `Are you sure you want to ${action} this design?`,
        text: action === 'approved' 
          ? 'The design will be approved and the customer will be notified.' 
          : 'The design will be rejected and the customer will be notified.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: action === 'approved' ? '#3085d6' : '#d33',
        cancelButtonColor: '#aaa',
        confirmButtonText: `Yes, ${action} it!`,
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await axios.post(
          `http://127.0.0.1:8000/api/owner/design-requests/${id}/update`,
          { status: action },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        setRequests(prev =>
          prev.map(item =>
            item.design_request.id === id
              ? { ...item, design_request: { ...item.design_request, status: action } }
              : item
          )
        );

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Design has been ${action} successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Action failed", error.response?.data || error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${action} design. Please try again.`,
      });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  

  return (
    <div className="design-requests-container">

         <div className="cat-search-container">
          <input
            type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
            className="cat-search-input"
          />
          <i className="fas fa-search cat-search-icon"></i>
        </div>

      <div className="filter-bar">
        

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
       <Loading />
      ) : currentItems.length === 0 ? (
        
          <div style={{ margin: "auto" }} className="cat-no-products">
             <img src={notfound} alt="No products" className="cat-no-products-img" />
             <p>No design requests found matching your criteria.</p>
          </div>
      ) : (
        <>
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

          {totalPages > 1 && (
            <div className="owner-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
               <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DesignRequests;