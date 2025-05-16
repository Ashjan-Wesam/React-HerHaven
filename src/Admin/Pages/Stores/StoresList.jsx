import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../assets/css/adminStyles/storelist.css';
import Loading from  "../../../Owner/Components/Loading";
import notfound from '../../../assets/img/nofound.jpg';
import Swal from 'sweetalert2';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 12;

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      setLoading(true);
      try {
        const [storeRes, categoryRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/admin/stores', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://127.0.0.1:8000/api/all-categories'),
        ]);
        setStores(storeRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the store.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://127.0.0.1:8000/api/admin/stores/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStores(prev => prev.filter(store => store.id !== id));

        Swal.fire('Deleted!', 'The store has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting store:', error);
        Swal.fire('Error', 'There was a problem deleting the store.', 'error');
      }
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory
      ? store.categories?.some(cat => cat.name === filterCategory)
      : true;

    return matchesSearch && matchesCategory;
  });

  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="stores-list-container">
      <div className="controls">
        <input
          type="text"
          placeholder="Search stores by name or description"
          className="search-input"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // reset to first page
          }}
        />

        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1); // reset to first page
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <Link to="/admin/stores/create" className="add-store-btn">Add New Store</Link>
      </div>

      {loading ? (
       <Loading />
      ) : (
        <>
          {currentStores.length === 0 ? (
            <div style={{ margin: "auto" }} className="cat-no-products">
              <img src={notfound} alt="No products" className="cat-no-products-img" />
              <p>No stores found for the current search or filter.</p>
            </div>
          ) : (
            <div className="card-grid">
              {currentStores.map(store => (
                <div key={store.id} className="store-card">
                  <div>
                    <img
                      src={`http://127.0.0.1:8000/storage/logo/${store.logo_url}`}
                      className='user-img'
                      alt={store.store_name}
                    />
                    <h3>{store.store_name}</h3>
                  </div>
                  <p className="store-desc">{store.description}</p>
                  <div className="store-actions">
                    <Link to={`/admin/stores/${store.id}`} className="view">View</Link>
                    <Link to={`/admin/stores/edit/${store.id}`} className="edit">Edit</Link>
                    <button onClick={() => handleDelete(store.id)} className="delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="owner-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <div className='div-nums'>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
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

export default StoresList;
