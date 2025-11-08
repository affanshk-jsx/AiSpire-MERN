import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  // Works with either isAdmin or role === 'admin'
  const isAdmin = useMemo(() => {
    if (!user) return false;
    if (typeof user.isAdmin !== 'undefined') return Boolean(user.isAdmin);
    return user.role === 'admin';
  }, [user]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Aispire</Link>

        <ul className="nav-menu">
          <li><Link to="/careers">Careers</Link></li>
          <li><Link to="/assessments">Assessments</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="nav-auth">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard" className="btn btn-admin">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/profile" className="btn btn-profile">Profile</Link>
              <button onClick={logout} className="btn btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-profile">Login</Link>
              <Link to="/signup" className="btn btn-logout">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
