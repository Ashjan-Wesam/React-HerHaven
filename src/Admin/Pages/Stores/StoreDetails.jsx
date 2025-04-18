import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StoreDetails = () => {
  const { id } = useParams(); 
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/admin/stores/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStore(res.data);
      } catch (error) {
        console.error('Error fetching store details:', error);
      }
    };

    fetchStore();
  }, [id]);

  if (!store) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="container">
      <h2>Store Details</h2>
      <div className="store-detail">
        <h3>{store.store_name}</h3>
        <p><strong>Owner:</strong> {store.owner.full_name}</p>
        <p><strong>Email:</strong> {store.owner.email}</p>
        <p><strong>Phone Number:</strong> {store.owner.phone_number}</p>
        <p><strong>Description:</strong> {store.description}</p>
        <p><strong>Status:</strong> {store.status}</p>
        <img src={store.logo_url} alt="Store Logo" style={{ width: '150px', height: '150px' }} />
      </div>
    </div>
  );
};

export default StoreDetails;

