import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const { name, email, message } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page container">
      <div className="page-header">
        <h1>Get in Touch</h1>
        <p>
          Have questions or need personalized advice? Reach out to our team of
          experts.
        </p>
      </div>
      <div className="contact-content">
        <form onSubmit={onSubmit} className="contact-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea name="message" value={message} onChange={onChange} rows="6" required></textarea>
          </div>
          <button type="submit" className="btn-submit">
            Send Message
          </button>
        </form>
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>
            For direct inquiries, you can also reach us through the following channels.
          </p>
          <ul>
            <li><strong>Email:</strong> aispireproject@gmail.com</li>
            <li><strong>Phone:</strong> +91 7069131793</li>
            <li><strong>Address:</strong> Muglisara, Surat, Gujarat, India</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact;