import  { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../assets/css/adminStyles/storelist.css'


const StoresList = () => {
  const [stores, setStores] = useState([]);

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

  return (
    <div className="stores-container">
    <h2 className="page-title">All Stores</h2>
    <Link to="/admin/stores/create" className="add-store-btn">Add New Store</Link>
  
    <div className="store-grid">
      {stores.map(store => (
        <div key={store.id} className="store-card">
          <div className="store-header">
            <h3>{store.store_name}</h3>
          </div>
          <p className="store-desc">{store.description}</p>
          <div className="store-actions">
            <Link to={`/admin/stores/${store.id}`} className="btn-view">View</Link>
            <Link to={`/admin/stores/edit/${store.id}`} className="btn-edit">Edit</Link>
            <button onClick={() => handleDelete(store.id)} className="btn-delete">Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default StoresList;
