import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../../../assets/css/adminStyles/UserView.css';
import defaultImg from '../../../assets/img/userImg.jpg';
import Loading from  "../../../Owner/Components/Loading"

const MySwal = withReactContent(Swal);

const UserView = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

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
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching user:', error);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch user details',
          background: '#1e272e',
          color: '#f5f6fa',
          confirmButtonColor: '#6c5ce7',
        });
        setLoading(false); // Set loading to false in case of an error
      }
    };
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6c5ce7',
      cancelButtonColor: '#ff7675',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e272e',
      color: '#f5f6fa',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        await MySwal.fire({
          title: 'Deleted!',
          text: 'User has been deleted.',
          icon: 'success',
          background: '#1e272e',
          color: '#f5f6fa',
          confirmButtonColor: '#6c5ce7',
        });
        
        navigate('/admin/users');
      } catch (error) {
        console.error('Error deleting user:', error);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete user',
          background: '#1e272e',
          color: '#f5f6fa',
          confirmButtonColor: '#6c5ce7',
        });
      }
    }
  };

  if (loading) {
    return <Loading />; // Show loading component while data is being fetched
  }

  return (
    <div className="admin-container">
      <h2 className="admin-title"> 
        <img 
          src={user.profile_picture ? `http://127.0.0.1:8000/storage/profile/${user.profile_picture}` : defaultImg} 
          alt="User" 
          className="admin-profile-image"
        />
        <h3>{user.full_name}</h3>
      </h2>
      <div className="admin-details">
        <div className="admin-user-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone_number}</p>
          <p className={`admin-role ${user.role}`}><strong>Role:</strong> {user.role}</p>
          <p className={`admin-status ${user.status}`}><strong>Status:</strong> {user.status}</p>

          {user.role === 'owner' && user.store && (
            <div className="admin-store-info">
              <h3>Store Details</h3>
              <p><strong>Store Name:</strong> {user.store.store_name}</p>
              <p><strong>Store Description:</strong> {user.store.description}</p>
              {user.store.logo_url && (
                <div className="admin-store-logo-container">
                  <strong>Store Logo:</strong>
                  <img 
                    src={`http://127.0.0.1:8000/storage/profile/${user.store.logo_url}`} 
                    alt="Store Logo" 
                    className="admin-store-logo"
                  />
                </div>
              )}
            </div>
          )}

          <div className="admin-button-container">
            <Link to={`/admin/users/${id}/edit`} className="admin-button admin-button-edit">Edit</Link>
            <button onClick={handleDelete} className="admin-button admin-button-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
