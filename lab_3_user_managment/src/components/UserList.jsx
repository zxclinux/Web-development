import React from 'react';

function UserList({ users, onDelete }) {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created</th>
          <th>Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.createdAt}</td>
            <td>{u.updatedAt}</td>
            <td>
              <button className="btn btn--primary" onClick={() => onDelete(u.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserList;