import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Bell, Home, PlusSquare } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">PWA Bulletin Board</Link>
        <div className="nav-links">
          <Link to="/" className="nav-item">
            <Home size={20} />
            <span>Home</span>
          </Link>
          {token ? (
            <>
              <Link to="/threads/new" className="nav-item">
                <PlusSquare size={20} />
                <span>New Thread</span>
              </Link>
              <Link to="/notifications" className="nav-item">
                <Bell size={20} />
                <span>Notifications</span>
              </Link>
              <button onClick={handleLogout} className="nav-item btn-link">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                <LogIn size={20} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="nav-item">
                <User size={20} />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
