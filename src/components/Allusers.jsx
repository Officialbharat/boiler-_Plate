import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../css/donors.css';
import { FaUserAlt, FaPhoneAlt, FaMapMarkerAlt, FaTint } from 'react-icons/fa';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(usersData)
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = selectedBloodGroup === 'all' || user.bloodGroup === selectedBloodGroup;
    return matchesSearch && matchesBloodGroup;
  });

  return (
    <div className="donors-container">
      <div className="search-section">
        <div className="search-controls">
          <div className="blood-group-dropdown">
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
            >
              <option value="all">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <FaTint className="dropdown-icon" />
          </div>
          
          <div className="search-input">
            <input
              type="text"
              placeholder="Search by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaMapMarkerAlt className="search-icon" />
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="cards-grid">
          {filteredUsers.map(user => (
            <div key={user.id} className="donor-card">
              <div className="donor-image">
                <img src={user.profileImage || 'https://via.placeholder.com/300'} alt={user.name} />
                <div className="blood-group-badge">
                  <FaTint /> {user.bloodGroup}
                </div>
              </div>
              <div className="card-info" style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#2d3748'
                }}>
                  <FaUserAlt style={{ marginRight: '0.5rem' }} />
                  {user.name}
                </h3>
                <p style={{ 
                  color: '#4a5568',
                  marginBottom: '0.5rem'
                }}>
                  <FaPhoneAlt style={{ marginRight: '0.5rem' }} />
                  {user.phone}
                </p>
                <p style={{ 
                  color: '#4a5568',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
                  {user.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
