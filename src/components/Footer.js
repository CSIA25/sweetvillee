import React from "react";
import { Link } from "react-router-dom";
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Navigation Links */}
        <div className="footer-section">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
            <li><a href="#about">About Us</a></li>
          </ul>
        </div>

        {/* Company Info */}
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><a href="#our-story">Our Story</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li>Email: <a href="mailto:info@bakerydelight.com">info@bakerydelight.com</a></li>
            <li>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></li>
            <li>Address: 123 Bakery Lane, Sweet City</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <ul className="social-links">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bakery Delight. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;