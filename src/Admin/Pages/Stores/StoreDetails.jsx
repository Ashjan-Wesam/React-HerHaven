import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../../assets/css/adminStyles/storelist.css';
import Loading from  "../../../Owner/Components/Loading";

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
    return <Loading />;
  }

  return (
    <div className="admin-store-container">
        <img src={`http://127.0.0.1:8000/storage/logo/${store.logo_url}`} alt="Store Logo" />
        <h3>{store.store_name}</h3>
        <p><strong>Owner:</strong> {store.owner.full_name}</p>
        <p><strong>Email:</strong> {store.owner.email}</p>
        <p><strong>Phone Number:</strong> {store.owner.phone_number}</p>
        <p><strong>Description:</strong> {store.description}</p>
     
     
      </div>
   
  );
};

export default StoreDetails;
