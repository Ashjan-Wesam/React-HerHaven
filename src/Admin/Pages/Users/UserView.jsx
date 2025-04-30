import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../../../assets/css/adminStyles/UserView.css';
import defaultImg from '../../../assets/img/userImg.jpg';

const MySwal = withReactContent(Swal);

const UserView = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
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

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h2 className="title">User Details</h2>
      <div className="details">
        <img 
          src={user.profile_picture ? `http://127.0.0.1:8000/storage/profile/${user.profile_picture}` : defaultImg} 
          alt="User" 
          className="profile-image"
        />
        <div className="user-info">
          <p><strong>Name:</strong> {user.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone_number}</p>
          <p className={`role ${user.role}`}><strong>Role:</strong> {user.role}</p>
          <p className={`status ${user.status}`}><strong>Status:</strong> {user.status}</p>

          {user.role === 'owner' && user.store && (
            <div className="store-info">
              <h3>Store Details</h3>
              <p><strong>Store Name:</strong> {user.store.store_name}</p>
              <p><strong>Store Description:</strong> {user.store.description}</p>
              {user.store.logo_url && (
                <div className="store-logo-container">
                  <strong>Store Logo:</strong>
                  <img 
                    src={`http://127.0.0.1:8000/storage/profile/${user.store.logo_url}`} 
                    alt="Store Logo" 
                    className="store-logo"
                  />
                </div>
              )}
            </div>
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