import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/signup.css';
import Swal from 'sweetalert2';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    age: '',
    bloodGroup: '',
    contactNumber: '',
    address: '',
    userType: '' // New field for user type (donor/receiver)
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSuccess = () => {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Your account has been created successfully',
      showConfirmButton: true,
      confirmButtonColor: 'var(--primary-color)',
      timer: 3000,
      timerProgressBar: true
    }).then(() => {
      navigate('/login');
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.userName || !formData.email || !formData.password || 
        !formData.bloodGroup || !formData.contactNumber || !formData.address || !formData.userType) {
      setError('Please fill in all required fields');
      return false;
    }

    // Age validation
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18 || age > 55) {
      setError('Age must be between 18 and 55 years');
      return false;
    }

    // Contact number validation
    if (!/^\d{11}$/.test(formData.contactNumber)) {
      setError('Contact number must be exactly 11 digits');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        userName: formData.userName,
        email: formData.email,
        age: formData.age,
        bloodGroup: formData.bloodGroup,
        contactNumber: formData.contactNumber,
        address: formData.address,
        profileImageUrl: formData.profileImageUrl,
        userType: formData.userType,
        createdAt: new Date().toISOString()
      });
      handleSuccess();

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="form-title">Join Our Blood Bank Community</h2>
        <p className="form-subtitle">Connect to save lives</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userType" className="form-label">I am a*</label>
            <select
              className="form-select"
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="">Select your role</option>
              <option value="donor">Blood Donor</option>
              <option value="receiver">Blood Receiver</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="userName" className="form-label">Full Name*</label>
            <input
              type="text"
              className="form-control"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address*</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password*</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age* (18-55 years)</label>
            <input
              type="number"
              className="form-control"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              min="18"
              max="55"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="bloodGroup" className="form-label">Blood Group*</label>
            <select
              className="form-select"
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
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

          <div className="mb-3">
            <label htmlFor="contactNumber" className="form-label">Contact Number* (11 digits)</label>
            <input
              type="tel"
              className="form-control"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter your contact number"
              pattern="[0-9]{11}"
              required
            />
          </div>

          
          <div className="mb-3">
            <label htmlFor="profileImageUrl" className="form-label">Profile Image URL</label>
            <input
              type="url"
              className="form-control"
              id="profileImageUrl"
              name="profileImageUrl"
              value={formData.profileImageUrl}
              onChange={handleChange}
              placeholder="Enter URL of your profile image"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address*</label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete address"
              rows="3"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {formData.userType === 'donor' ? 'Register as Donor' : 'Register as Receiver'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <p>Already have an account? <a href="/login" className="text-primary">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;





