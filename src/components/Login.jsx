import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import Swal from 'sweetalert2';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate loading
  setTimeout(() => {
    setLoading(false);
  }, 1500);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
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
      navigate('/');
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      handleSuccess();
      // Successfully logged in
      
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="pulse-loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-card" style={{
        // boxShadow: '0 4px 20px rgba(226, 54, 54, 0.9)',
        // borderRadius: '12px',
        // background: 'rgba(255, 255, 255, 0.95)',
        // padding: '2.5rem',
      }}>
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Together we can save lives</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label">Email Address</label>
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

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            style={{
              background: 'var(--primary-color)',
              border: 'none',
              padding: '12px',
              fontSize: '1.1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>Don't have an account? <a href="/signup" className="text-primary">Sign up here</a></p>
        </div>

        <div className="mt-3 text-center">
          <small style={{color: 'var(--text-dark)', opacity: '0.7'}}>
            By logging in, you agree to help save lives through blood donation
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
