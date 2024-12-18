import React from 'react';
import { FaTint, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../css/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <FaTint className="footer-logo" />
            <h3>BLOOD BANK</h3>
          </div>
          <p>Connecting blood donors with those in need. Making a difference one donation at a time.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/donors">Find Donors</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <div className="contact-info">
            <p><FaPhone /> +92 (302) 1234567</p>
            <p><FaEnvelope /> codenetic@gmail.com.com</p>
            <p><FaMapMarkerAlt /> mithi, Tharparkar</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BloodBank. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
