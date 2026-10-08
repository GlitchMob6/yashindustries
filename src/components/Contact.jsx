import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import useFadeIn from '../hooks/useFadeIn';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', requirement: '', message: '',
  });
  const [status, setStatus] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const ref = useFadeIn();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = [];
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push('Enter a valid email');
    if (!formData.message.trim()) errors.push('Message is required');

    if (errors.length > 0) {
      setStatus({ text: errors.join('. ') + '.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setStatus({ text: 'Thank you! We will get back to you shortly.', type: 'success' });
      setFormData({ name: '', company: '', email: '', phone: '', requirement: '', message: '' });
      setSubmitting(false);
    }, 800);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div ref={ref} className="contact-grid fade">
          <div>
            <h2 className="contact-title">Get in Touch</h2>
            <p className="contact-text">We would love to hear from you.</p>
            <div className="contact-details">
              <div className="contact-item"><Phone /><p>+91 98765 43210</p></div>
              <div className="contact-item"><Mail /><p>contact@yashindustries.com</p></div>
              <div className="contact-item"><MapPin /><p>MIDC Industrial Area, Nashik, Maharashtra</p></div>
              <div className="contact-item"><Clock /><p>Mon–Sat: 9:00 AM – 6:00 PM</p></div>
            </div>
            <div className="map-placeholder">
              <p>[Google Maps / Location Embed]</p>
            </div>
          </div>
          <div>
            <form id="form" className="contact-form" onSubmit={handleSubmit}>
              <div className="form-fields">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input id="name" type="text" required className="form-input" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="company" className="form-label">Company</label>
                  <input id="company" type="text" className="form-input" value={formData.company} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" type="email" required className="form-input" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input id="phone" type="tel" className="form-input" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="requirement" className="form-label">Product / Requirement</label>
                  <input id="requirement" type="text" className="form-input" value={formData.requirement} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea id="message" rows={4} className="form-textarea" value={formData.message} onChange={handleChange} />
                </div>
                <button id="submit" type="submit" className="submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
                {status.text && (
                  <p className={`status ${status.type}`}>{status.text}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
