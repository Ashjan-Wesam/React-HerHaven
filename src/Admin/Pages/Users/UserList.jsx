import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../../../assets/css/adminStyles/UserList.css';
import defaultImg from '../../../assets/img/userImg.jpg';
import Loading from  "../../../Owner/Components/Loading";
import notfound from '../../../assets/img/nofound.jpg';

const MySwal = withReactContent(Swal);

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch users',
        background: '#1e272e',
        color: '#f5f6fa',
        confirmButtonColor: '#6c5ce7',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
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

        fetchUsers();
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

  const filteredUsers = users.filter((user) =>
    (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterRole === '' || user.role === filterRole) &&
    (filterStatus === '' || user.status === filterStatus)
  );

  const usersPerPage = 12;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="user-list-container">
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
          <option value="customer">Customer</option>
        </select>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Link to="/admin/users/create" className="add-user-btn">Add User</Link>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="card-grid">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <div className="user-card" key={user.id}>
                  <img
                    src={user.profile_picture ? `http://127.0.0.1:8000/storage/profile/${user.profile_picture}` : defaultImg}
                    alt={user.full_name}
                    className="user-img"
                  />
                  <h3>{user.full_name}</h3>
                  <p className="user-email">{user.email}</p>
                  <p className={`user-role ${user.role}`}>Role: {user.role}</p>
                  <p className={`user-status ${user.status}`}>Status: {user.status}</p>
                  <div className="actions">
                    <Link to={`/admin/users/${user.id}`} className="view">View</Link>
                    <Link to={`/admin/users/${user.id}/edit`} className="edit">Edit</Link>
                    <button onClick={() => deleteUser(user.id)} className="delete">Delete</button>
                  </div>
                </div>
              ))
            ) : (
               <div style={{ margin: "auto" }} className="cat-no-products">
                    <img src={notfound} alt="No products" className="cat-no-products-img" />
                    <p>No Users match your search/filter.</p>
                  </div>
            )}
          </div>

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

export default UserList;
