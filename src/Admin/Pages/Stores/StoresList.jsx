import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../assets/css/adminStyles/storelist.css';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // للحقل البحث
  const [filterCategory, setFilterCategory] = useState(''); // للفلتر

  // جلب المتاجر من الـ API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/admin/stores', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(stores.filter(store => store.id !== id));
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  // تصفية المتاجر بناءً على البحث والفلتر
  const filteredStores = stores.filter(store => {
    // البحث
    const matchesSearchQuery = store.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               store.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // الفلتر حسب الفئة (إذا كانت محددة)
    const matchesCategory = filterCategory ? store.category === filterCategory : true;

    return matchesSearchQuery && matchesCategory;
  });

  return (
    <div className="stores-list-container">
      <h2 className="stores-list-title">All Stores</h2>
      
      {/* حقل البحث */}
      <input
        type="text"
        placeholder="Search stores by name or description"
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      {/* فلتر الفئة */}
      <select
        className="filter-select"
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="groceries">Groceries</option>
    
      </select>
    
      <Link to="/admin/stores/create" className="add-store-btn">Add New Store</Link>
    
      <div className="card-grid">
        {filteredStores.map(store => (
          <div key={store.id} className="store-card">
            <div>
              <img src={`http://127.0.0.1:8000/storage/logo/${store.logo_url}`} className='user-img' alt={store.store_name} />
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
    </div>
  );
};

export default StoresList;
