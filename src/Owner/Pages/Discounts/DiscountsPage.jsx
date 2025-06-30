import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../../../assets/css/ownerStyles/discount.css';
import Swal from "sweetalert2";
import Loading from "../../Components/Loading";
import notfound from '../../../assets/img/nofound.jpg';

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [discountsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");


  const fetchDiscounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/owner/discounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscounts(res.data);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load discounts' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://127.0.0.1:8000/api/owner/discounts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', 'Discount deleted successfully.', 'success');
        fetchDiscounts();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete discount.', 'error');
      }
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const filteredDiscounts = discounts.filter((d) => {
  const now = new Date();
  const startDate = new Date(d.start_date);
  const endDate = new Date(d.end_date);

  const matchesSearch =
    (d.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    d.discount_percentage?.toString().includes(searchTerm);

  let matchesPercentage = true;
  if (filterOption === "above50") matchesPercentage = d.discount_percentage > 50;
  else if (filterOption === "below50") matchesPercentage = d.discount_percentage <= 50;

  let matchesStatus = true;
  if (statusFilter === "active") matchesStatus = endDate >= now;
  else if (statusFilter === "expired") matchesStatus = endDate < now;

  let matchesDate = true;
  if (dateFilter === "today") {
    matchesDate =
      startDate.toDateString() === now.toDateString() ||
      endDate.toDateString() === now.toDateString();
  } else if (dateFilter === "this_week") {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    matchesDate = startDate <= weekEnd && endDate >= weekStart;
  } else if (dateFilter === "this_month") {
    matchesDate =
      startDate.getMonth() === now.getMonth() &&
      startDate.getFullYear() === now.getFullYear();
  }

  return matchesSearch && matchesPercentage && matchesStatus && matchesDate;
});


  const indexOfLast = currentPage * discountsPerPage;
  const indexOfFirst = indexOfLast - discountsPerPage;
  const currentDiscounts = filteredDiscounts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDiscounts.length / discountsPerPage);

  if (loading) return <Loading />;

  const getDiscountStatusClass = (discount) => {
  const now = new Date();
  const start = new Date(discount.start_date);
  const end = new Date(discount.end_date);

  if (now < start) return "discount-upcoming";   // لم يبدأ
  else if (now > end) return "discount-expired"; // منتهي
  else return "discount-active";                 // نشط
};

  return (
    <div className="owner-discounts-container">
      
<div className="cat-search-container">
  <input
    type="text"
    placeholder="Search by description or %"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
   className="cat-search-input"
        />
        <i className="fas fa-search cat-search-icon"></i>
</div>

<div className="owner-discounts-toolbar">
  <Link to="/owner/discounts/create" className="add-user-btn">
    <i className="fas fa-plus"></i> Add Discount
  </Link>
  <div className="filters-group"> 
    
    <select
      value={filterOption}
      onChange={(e) => setFilterOption(e.target.value)}
      className="input-filter"
    >
      <option value="all">All Percentages</option>
      <option value="above50">Above 50%</option>
      <option value="below50">50% or below</option>
    </select>

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="input-filter"
    >
      <option value="all">All Status</option>
      <option value="active">Active</option>
      <option value="expired">Expired</option>
    </select>

    <select
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
      className="input-filter"
    >
      <option value="all">All Dates</option>
      <option value="today">Today</option>
      <option value="this_week">This Week</option>
      <option value="this_month">This Month</option>
    </select>
     <button
      onClick={() => {
        setSearchTerm("");
        setFilterOption("all");
        setStatusFilter("all");
        setDateFilter("all");
        setCurrentPage(1);
      }}
      className="clear-filter-btn"
    >
      <i className="fas fa-filter-circle-xmark" style={{ marginRight: '8px' }}></i> Clear Filters
    </button>
 
  </div>

 
</div>


      <div className="owner-discounts-grid">
        {currentDiscounts.length > 0 ? currentDiscounts.map(d => (
          <div key={d.id} className="owner-discount-card">
           <div className={`owner-discount-header ${getDiscountStatusClass(d)}`}>
    <span className="owner-discount-percent">{d.discount_percentage}% OFF</span>
  </div>
            <p className="owner-discount-dates">
              <i className= "fas fa-calendar"></i>
              {new Date(d.start_date).toLocaleDateString()} - {new Date(d.end_date).toLocaleDateString()}
            </p>
            <p className="owner-discount-description">{d.description}</p>
            <div className="owner-discount-actions">
              <Link to={`/owner/discounts/edit/${d.id}`} className="edit-category-btn">
                <i className="fas fa-edit"></i> 
              </Link>
              <button onClick={() => handleDelete(d.id)} className="delete-category-btn">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        )) : (
          
           <div style={{ margin: "auto" }} className="cat-no-products">
                <img src={notfound} alt="No products" className="cat-no-products-img" />
                <p>No discounts found.</p>
              </div>
        )}
      </div>

      {filteredDiscounts.length > discountsPerPage && (
        <div className="owner-pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="owner-page-btn"
          >
            <i className="fas fa-chevron-left"></i> 
          </button>

 <div className='div-nums'>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`owner-page-btn ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}
</div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="owner-page-btn"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscountsPage;
