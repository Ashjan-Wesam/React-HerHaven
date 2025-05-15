import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import '../../../assets/css/adminStyles/discount.css';
import Loading from '../../../Owner/Components/Loading';

const DiscountList = () => {
  const [discounts, setDiscounts] = useState([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPercentage, setFilterPercentage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchDiscounts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin/discounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data.data || res.data;
      setDiscounts(data);
      setFilteredDiscounts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to load discounts', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  useEffect(() => {
    let temp = [...discounts];

    if (filterPercentage !== 'all') {
      const numFilter = Number(filterPercentage);
      temp = temp.filter(d => d.discount_percentage >= numFilter);
    }

    if (searchTerm.trim() !== '') {
      temp = temp.filter(d => {
        const storeName = (d.store?.store_name || d.store?.name || '').toLowerCase();
        const desc = (d.description || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return storeName.includes(term) || desc.includes(term);
      });
    }

    setFilteredDiscounts(temp);
    setCurrentPage(1); 
  }, [searchTerm, filterPercentage, discounts]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredDiscounts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This discount will be deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/admin/discounts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('Deleted!', 'Discount has been deleted.', 'success');
          fetchDiscounts();
        } catch (error) {
          console.error(error);
          Swal.fire('Error', 'Failed to delete discount.', 'error');
        }
      }
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-discount-list" style={{ maxWidth: 1000, margin: 'auto' }}>
    

       <div className="cat-search-container">
       
      <input
        type="text"
        placeholder="Search by store or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
         className="cat-search-input"
      />
        <i className="fas fa-search cat-search-icon"></i>
      </div>
      <div className="filter-bar">
       <button onClick={() => navigate('/admin/discounts/add')} className="add-user-btn" >
        Add New Discount
      </button>
      <select
        value={filterPercentage}
        onChange={e => setFilterPercentage(e.target.value)}
        className="input-filter"
        style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
      >
        <option value="all">All Discounts</option>
        <option value="10">10% and above</option>
        <option value="20">20% and above</option>
        <option value="30">30% and above</option>
        <option value="50">50% and above</option>
      </select>
</div>
      {filteredDiscounts.length === 0 ? (
        <p className="admin-no-discounts" style={{ marginTop: 20 }}>No discounts found.</p>
      ) : (
        <>
          <table className="admin-discount-table" border="1" cellPadding="8" style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
            <thead>
              <tr className="admin-table-header" style={{ backgroundColor: '#eee' }}>
                <th>ID</th>
                <th>Store</th>
                <th>Discount %</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(discount => (
                <tr key={discount.id} className="admin-table-row">
                  <td>{discount.id}</td>
                  <td>{discount.store?.store_name || discount.store?.name || 'N/A'}</td>
                  <td>{discount.discount_percentage}%</td>
                  <td>{discount.start_date}</td>
                  <td>{discount.end_date}</td>
                  <td>{discount.description}</td>
                  <td>
                    <Link to={`/admin/discounts/edit/${discount.id}`}  className="edit-category-btn"><i className="fas fa-edit"></i>
                    </Link>
                    <button onClick={() => handleDelete(discount.id)} className="delete-category-btn"><i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* أزرار الصفحات */}
          <div className="owner-pagination" >
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1} >
               <i className="fas fa-chevron-left"></i>
          </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
             
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DiscountList;


 