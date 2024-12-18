import React, { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { FaUser, FaTint, FaCalendarAlt, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { MdEmail, MdBloodtype } from 'react-icons/md';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);



  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleEditProfile = () => {
    setIsEditing(true);
    // This will be used to toggle edit mode
    // Toggle edit mode off
    const handleCancelEdit = () => {
      setIsEditing(false);
    };

    // Save profile changes
    const handleSaveChanges = async () => {
      try {
        // Save logic will go here
        setIsEditing(false);
      } catch (err) {
        console.error("Error saving changes:", err);
      }
    };
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user profile data
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));

          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setError("User profile not found.");
          }

          // Fetch donation history if available (optional)
          // Replace 'donations' with your Firestore collection name
          const donationsSnapshot = await getDoc(doc(db, 'donations', user.uid));
          if (donationsSnapshot.exists()) {
            setDonationHistory(donationsSnapshot.data().history || []);
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load profile data.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Please log in to view your profile.");
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <div className="error-message">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
   
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-image">
              <img src={userData?.profileImageUrl || '/default-avatar.png'} alt="Profile" />
            </div>
            <div className="profile-details">
              <h1 className="profile-name">{userData?.userName.toUpperCase() || 'User Name'}</h1>
              <button className="contact-btn" onClick={() => navigate('/updateprofile')}>
        Update Profile
      </button>
              <div className="info-item">
                <FaUser />
                <span>Age: {userData?.age || 'Not specified'}</span>
              </div>
      
              <div className="info-item">
                <MdBloodtype />
                <span className="blood-group">Blood Group: {userData?.bloodGroup || 'Not specified'}</span>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt />
                <span>Location: {userData?.address || 'Not specified'}</span>
              </div>
              <div className="info-item">
                <FaPhone />
                <span>Phone: {userData?.contactNumber || 'Not specified'}</span>
              </div>
              <div className="info-item">
                <MdEmail />
                <span>Email: {userData?.email || 'Not specified'}</span>
              </div>
              
            </div>
          </div>
        </div>

        <div className="donation-history">
          <h2>Donation History</h2>
          {donationHistory.length > 0 ? (
            donationHistory.map((donation, index) => (
              <div key={index} className="history-card">
                <div className="history-icon">
                  <FaTint />
                </div>
                <div className="history-details">
                  <h3>Donation at {donation.location || 'Unknown Location'}</h3>
                  <p>Date: {donation.date || 'Unknown Date'}</p>
                  <span className="donation-type">{donation.type || 'N/A'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-donations">
              <p>No donation history available</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
