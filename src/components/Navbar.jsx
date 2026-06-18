import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? { color: 'var(--primary-color)' } : {};

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        AeroMarket
      </Link>
      <div className="nav-links">
        <Link style={isActive('/')} to="/">Explore</Link>
        {user ? (
          <>
            <Link style={isActive('/cart')} to="/cart">
              Cart 
              {cartItems.length > 0 && (
                <span style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  marginLeft: '4px',
                  fontWeight: 'bold'
                }}>
                  {cartItems.length}
                </span>
              )}
            </Link>
            <Link style={isActive('/profile')} to="/profile">Profile</Link>
            {user.isAdmin && <Link style={isActive('/admin')} to="/admin">Admin</Link>}
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1.2rem', marginLeft: '1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link style={isActive('/login')} to="/login">Sign In</Link>
            <Link to="/signup" className="btn" style={{ padding: '0.5rem 1.2rem' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
