import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaTint, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import '../css/donors.css';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';


const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [compatibleGroups, setCompatibleGroups] = useState([]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const navigate = useNavigate();

  const bloodCompatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const donorsQuery = query(usersRef, where('userType', '==', 'donor'));
      const receiversQuery = query(usersRef, where('userType', '==', 'receiver'));

      const [donorsSnapshot, receiversSnapshot] = await Promise.all([
        getDocs(donorsQuery),
        getDocs(receiversQuery)
      ]);

      const donorsData = donorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const receiversData = receiversSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setDonors(donorsData);
      setReceivers(receiversData);
      setFilteredDonors(donorsData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleBloodGroupChange = (group) => {
    setSelectedBloodGroup(group);
    setCompatibleGroups(bloodCompatibility[group] || []);
    filterDonors(group, selectedCity);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    filterDonors(selectedBloodGroup, city);
  };

  const filterDonors = (bloodGroup, city) => {
    let filtered = [...donors];
    
    if (bloodGroup) {
      filtered = filtered.filter(donor => donor.bloodGroup === bloodGroup);
    }
    
    if (city) {
      filtered = filtered.filter(donor => 
        donor.address.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    setFilteredDonors(filtered);
  };

  const resetFilters = () => {
    setSelectedBloodGroup('');
    setSelectedCity('');
    setCompatibleGroups([]);
    setFilteredDonors(donors);
  };

  return (
    <div className="donors-page">
      <Navbar />
      
      <div className="donors-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="filters-section"
        >
          <h2>Find Blood Donors</h2>
          
          <div className="filters">
            <div className="filter-group">
              <select 
                value={selectedBloodGroup}
                onChange={(e) => handleBloodGroupChange(e.target.value)}
              >
                <option value="">All Blood Groups</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <div className="search-input">
                <input
                  type="text"
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  placeholder="Enter city name..."
                />
              </div>
            </div>

            <button className="reset-btn" onClick={resetFilters}>
              Show All Donors
            </button>
          </div>

          {selectedBloodGroup && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="compatibility-info"
            >
              <h3>Compatible Blood Groups:</h3>
              <div className="compatible-groups">
                {compatibleGroups.map(group => (
                  <span key={group} className="compatible-group">{group}</span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="donors-grid"
        >
          {filteredDonors.map((donor) => (
            <motion.div
              key={donor.id}
              whileHover={{ scale: 1.02 }}
              className="donor-card"
            >
              <div className="donor-image">
                <img src={donor.profileImageUrl || '/default-avatar.png'} alt={donor.userName} />
                <span className="blood-group-badge">{donor.bloodGroup}</span>
              </div>
              
              <div className="donor-info">
                <h3><FaUser /> {donor.userName}</h3>
                <p><FaMapMarkerAlt /> {donor.address}</p>
                <p><FaPhone /> {donor.contactNumber}</p>
                <p><FaEnvelope /> {donor.email}</p>
                <p><FaTint /> Last Donation: {donor.lastDonation || 'Not Available'}</p>
              </div>

              <button className="contact-btn">Contact Donor</button>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Donors;
