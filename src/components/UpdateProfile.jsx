
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTint } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import '../css/updateprofile.css';
import Navbar from './Navbar';
import Footer from './Footer';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    userName: '',
    contactNumber: '',
    address: '',
    bloodGroup: '',
    lastDonation: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            userName: userData.userName || '',
            contactNumber: userData.contactNumber || '',
            address: userData.address || '',
            bloodGroup: userData.bloodGroup || '',
            lastDonation: userData.lastDonation || '',
            email: auth.currentUser.email
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error fetching user data',
          confirmButtonColor: 'var(--primary-color)'
        });
        console.error(err);
      }
    };

    if (auth.currentUser) {
      fetchUserData();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const updateData = {
        userName: formData.userName,
        contactNumber: formData.contactNumber,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        lastDonation: formData.lastDonation
      };

      await updateDoc(userRef, updateData);
      
      // Show success message using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your profile has been updated successfully',
        showConfirmButton: true,
        confirmButtonColor: 'var(--primary-color)',
        timer: 3000,
        timerProgressBar: true
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating profile',
        confirmButtonColor: 'var(--primary-color)'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="donors-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="search-filters"
        >
          <h2>Update Profile</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="search-row">
              <div className="input-group">
                <FaUser />
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="search-input"
                  required
                />
              </div>
            </div>

            <div className="search-row">
              <div className="input-group">
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="search-input"
                  disabled
                />
              </div>
            </div>

            <div className="search-row">
              <div className="input-group">
                <FaPhone />
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className="search-input"
                  required
                />
              </div>
            </div>

            <div className="search-row">
              <div className="input-group">
                <FaMapMarkerAlt />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="search-input"
                  required
                />
              </div>
            </div>

            <div className="search-row">
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="blood-group-select"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="search-row">
              <div className="input-group">
                <FaTint />
                <input
                  type="date"
                  name="lastDonation"
                  value={formData.lastDonation}
                  onChange={handleChange}
                  className="search-input"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="contact-btn" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateProfile;

