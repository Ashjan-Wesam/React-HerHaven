import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/css/adminStyles/UserView.css';

const UserView = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://127.0.0.1:8000/api/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2 className="title">User Details</h2>
      <div className="details">
        <img src={user.profile_image || 'default-image.jpg'} alt="User" />
        <div className="user-info">
          <p><strong>Name:</strong> {user.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone_number}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.status}</p>

          {user.role === 'owner' && user.store && (
            <>
              <p><strong>Store Name:</strong> {user.store.store_name}</p>
              <p><strong>Store Description:</strong> {user.store.description}</p>
              <p><strong>Store Logo:</strong> <img src={user.store.logo_url} alt="Store Logo" className="w-24 h-24" /></p>
            </>
          )}

          <div className="button-container">
            <Link to={`/admin/users/${id}/edit`} className="button button-edit">Edit</Link>
            <button onClick={handleDelete} className="button button-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
