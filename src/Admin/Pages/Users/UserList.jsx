import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/css/adminStyles/UserList.css';
import defaultImg from '../../../assets/img/userImg.jpg'

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}` , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
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
        />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
          <option value="customer">Customer</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Link to="/admin/users/create" className="add-user-btn">Add User</Link>
      </div>

      <div className="card-grid">
        {currentUsers.map((user) => (
          <div className="user-card" key={user.id}>
            <img
              src={user.profile_picture || defaultImg}
              alt={user.full_name}
              className="user-img"
            />
            <h3>{user.full_name}</h3>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
            <p>Status: {user.status}</p>
            <div className="actions">
              <Link to={`/admin/users/${user.id}`} className="view">View</Link>
              <Link to={`/admin/users/${user.id}/edit`} className="edit">Edit</Link>
              <button onClick={() => deleteUser(user.id)} className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;
