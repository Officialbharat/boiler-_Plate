import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaTint } from 'react-icons/fa';
import '../css/navbar.css';


const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    // Add fixed navbar functionality
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 0) {
        navbar.classList.add('fixed');
      } else {
        navbar.classList.remove('fixed');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  const location = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar fixed-top">
      <div className="nav-brand">
        <FaTint className="logo-icon" />
        <span>BLOOD-BANK</span>
      </div>
      
      <div className="nav-toggle" onClick={toggleNav}>
        {isNavOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`nav-links ${isNavOpen ? 'active' : ''}`}>
        <a href="/" className={`nav-link ${isActive('/')}`}>Home</a>
        <a href="/donors" className={`nav-link ${isActive('/donors')}`}>Donors</a>
        <a href="/profile" className={`nav-link ${isActive('/profile')}`}>Profile</a>
        
        <div className="user-section">
          {user && (
            <>
              <div className="user-info">
                <FaUserCircle />
                <span>{user.email}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
