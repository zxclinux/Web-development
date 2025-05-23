import React, { useEffect, useState } from 'react';
import UserList from '../components/UserList';
import { fetchUsers, deleteUser } from '../api/user';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => {
        if (err.message.includes('403') || err.message.includes('401')) {
          setError('Access denied. Only admin can view users.');
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="main-section">
      <div className="user-listing-container">
        <h1 style={{ textAlign: 'center' }}>Users</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && <UserList users={users} onDelete={handleDelete} />}
      </div>
    </main>
  );
}

export default UsersPage;