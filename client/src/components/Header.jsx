import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const isAuth = Boolean(localStorage.getItem('token'));

  let isAdmin = false;
  if (isAuth) {
    try {
      const payload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      isAdmin = payload.role === 'ADMIN';
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="global-header">
      <Link to="/users" className="logo">BuyDevice</Link>
      <nav>
        {isAdmin && <Link to="/admin" className="admin">Admin</Link>}
        <Link to="/cart" className="cart" title="Cart"></Link>
        {isAuth ? (
          <span className="logout" style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</span>
        ) : (
          <Link to="/login" className="logout">Login</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;