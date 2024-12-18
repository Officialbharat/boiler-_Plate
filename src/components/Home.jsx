import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from "./Footer";
import "../css/home.css";
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { 
  FaUsers, 
  FaHandHoldingHeart, 
  FaUserInjured,
  FaHeartbeat,
  FaCheckCircle,
  FaHeart,
  FaTrophy,
  FaHospital,
  FaQuoteLeft,
  FaTint
} from 'react-icons/fa';
import { 
  FaUserMd, 
  FaPhone, 
  FaEnvelope 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    donors: 0,
    recipients: 0
  });
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [bloodStock, setBloodStock] = useState([]);
  const navigate = useNavigate();
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    fetchStats();
    fetchBloodStock();
  }, []);

  const fetchStats = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const donorsQuery = query(collection(db, 'users'), where('userType', '==', 'donor'));
      const recipientsQuery = query(collection(db, 'users'), where('userType', '==', 'receiver'));
      
      const [donorsSnap, recipientsSnap] = await Promise.all([
        getDocs(donorsQuery),
        getDocs(recipientsQuery)
      ]);

      setStats({
        totalUsers: usersSnap.size,
        donors: donorsSnap.size,
        recipients: recipientsSnap.size
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchBloodStock = async () => {
    try {
      const stockRef = collection(db, 'bloodStock');
      const stockSnap = await getDocs(stockRef);
      const stockData = stockSnap.docs.map(doc => ({
        type: doc.data().bloodGroup,
        units: doc.data().units || 0
      }));
      setBloodStock(stockData);
    } catch (error) {
      console.error("Error fetching blood stock:", error);
    }
  };

  const handleSearch = async () => {
    if (!selectedBloodGroup) return;
    
    setLoading(true);
    try {
      const recipientsRef = collection(db, 'users');
      const q = query(
        recipientsRef, 
        where('userType', '==', 'receiver'),
        where('bloodGroup', '==', selectedBloodGroup)
      );
      const recipientsSnap = await getDocs(q);
      
      const recipientsData = recipientsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRecipients(recipientsData);
    } catch (error) {
      console.error("Error fetching recipients:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>      <Navbar />
<div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Give Blood, Save Lives
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your donation can make a difference
            </motion.p>
            <div className="blood-group-search">
              <select 
                className="blood-group-dropdown"
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              <button 
                className="search-btn" 
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Find Recipients'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recipients Section - Moved below hero */}
      {recipients.length > 0 && (
        <div className="recipients-section">
          <h2 className='text-center'>Recipients Needing Your Help</h2>
          <div className="recipients-grid">
            {recipients.map(recipient => (
              <motion.div 
                key={recipient.id}
                className="recipient-card"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={recipient.profileImageUrl} 
                  alt={recipient.userName}
                  className="recipient-image"
                />
                <div className="recipient-info">
                  <h3>{recipient.userName.toUpperCase()}</h3>
                  <div className="recipient-details">
                    <p><strong>Age:</strong> {recipient.age}</p>
                    <p><strong>Blood Group:</strong> {recipient.bloodGroup}</p>
                    <p><strong>Contact:</strong> {recipient.contactNumber}</p>
                    <p><strong>Location:</strong> {recipient.address}</p>
                    <p><strong>Email:</strong> {recipient.email}</p>
                  </div>
                  <button className="help-button">Offer Help</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    

      <div className="stats-section">
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.05 }}
        >
          <FaUsers className="stat-icon" />
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </motion.div>
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.05 }}
        >
          <FaHandHoldingHeart className="stat-icon" />
          <h3>Donors</h3>
          <p>{stats.donors}</p>
        </motion.div>
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.05 }}
        >
          <FaUserInjured className="stat-icon" />
          <h3>Recipients</h3>
          <p>{stats.recipients}</p>
        </motion.div>
      </div>

     

      <div className="benefits-section">
        <div className="benefits-content">
          <h2 className="text-center">Benefits of Blood Donation</h2>
          <div className="benefits-grid">
            <motion.div 
              className="benefit-card"
              whileHover={{ scale: 1.05 }}
            >
              <FaHeartbeat className="benefit-icon" />
              <h3>Saves Lives</h3>
              <p>One donation can save up to three lives and help countless others</p>
            </motion.div>
            <motion.div 
              className="benefit-card"
              whileHover={{ scale: 1.05 }}
            >
              <FaCheckCircle className="benefit-icon" />
              <h3>Health Check</h3>
              <p>Free mini health screening and blood type testing with each donation</p>
            </motion.div>
            <motion.div 
              className="benefit-card"
              whileHover={{ scale: 1.05 }}
            >
              <FaHeart className="benefit-icon" />
              <h3>Heart Health</h3>
              <p>Reduces risk of heart disease and helps maintain healthy iron levels</p>
            </motion.div>
          </div>
        </div>
      </div>
     

      <div className="benefits">
        <h2>Impact Statistics</h2>
        <div className="benefit-grid">
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05 }}
          >
            <FaUsers className="stat-icon" />
            <h3>Lives Impacted</h3>
            <p>10,000+</p>
          </motion.div>

          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05 }}
          >
            <FaTint className="stat-icon" />
            <h3>Units Collected</h3>
            <p>25,000+</p>
          </motion.div>

          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05 }}
          >
            <FaHospital className="stat-icon" />
            <h3>Partner Hospitals</h3>
            <p>50+</p>
          </motion.div>

          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05 }}
          >
            <FaHospital className="stat-icon" />
            <h3>Annual Drives</h3>
            <p>100+</p>
          </motion.div>
        </div>
      </div>
      <div className="testimonials benefits">
        <h2>What Our Donors Say</h2>
        <div className="benefit-grid">
          <motion.div 
            className="benefit-card"
            whileHover={{ scale: 1.05 }}
          >
            <FaQuoteLeft className="benefit-icon" />
            <p>"Donating blood is such a simple way to make a huge difference. I'm grateful to be able to help others in need."</p>
            <h4>Madan Bhanani</h4>
            <span>Regular Donor</span>
          </motion.div>

          <motion.div 
            className="benefit-card"
            whileHover={{ scale: 1.05 }}
          >
            <FaQuoteLeft className="benefit-icon" />
            <p>"The staff made me feel so comfortable during my first donation. Now I encourage everyone I know to donate."</p>
            <h4>Akash</h4>
            <span>First-time Donor</span>
          </motion.div>

          <motion.div 
            className="benefit-card"
            whileHover={{ scale: 1.05 }}
          >
            <FaQuoteLeft className="benefit-icon" />
            <p>"After my accident, blood donors saved my life. Now I donate regularly to pay it forward."</p>
            <h4>Netesh Suther</h4>
            <span>Regular Donor</span>
          </motion.div>
        </div>
      </div>
     
      <Footer />
     
      </>


         
     
        
          
  );
}

export default Home;



