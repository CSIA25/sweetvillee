import React, { useState } from "react";
import mapImage from "../assets/map.webp"; // Import the map image
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000); // Reset message after 3s
    }
  };

  return (
    <div className="contact">
      <header className="contact-header">
        <h1>Get in Touch</h1>
        <p>We’d love to hear from you—drop us a note!</p>
      </header>

      <div className="contact-container">
        <section className="contact-form-section">
          <h2>Contact Us</h2>
          {submitted ? (
            <p className="success-message">Thanks for your message! We’ll get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="form-input"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="form-input"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="form-textarea"
                rows="5"
                required
              />
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          )}
        </section>

        <section className="contact-info">
          <h2>Visit Us</h2>
          <p>123 Bakery Lane, Sweetville, CA 90210</p>
          <p>Email: hello@ourbakery.com</p>
          <p>Phone: (555) 123-4567</p>
          <div className="map-container">
            <img src={mapImage} alt="Bakery Location Map" className="map-image" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;