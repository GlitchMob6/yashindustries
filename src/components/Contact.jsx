import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import useFadeIn from '../hooks/useFadeIn';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', requirement: '', message: '',
  });
  const [status, setStatus] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const ref = useFadeIn();

  useEffect(() => {
    const handleProductSelect = (e) => {
      setFormData(prev => ({ ...prev, requirement: e.detail }));
    };
    window.addEventListener('selectProduct', handleProductSelect);
    return () => window.removeEventListener('selectProduct', handleProductSelect);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push('Enter a valid email');
    if (!formData.message.trim()) errors.push('Message is required');
    if (!formData.phone.trim()) errors.push('Phone is required');

    if (errors.length > 0) {
      setStatus({ text: errors.join('. ') + '.', type: 'error' });
      return;
    }

    setSubmitting(true);
    
    // Format the message to include company and requirement if present
    let fullMessage = formData.message;
    if (formData.company) fullMessage = `Company: ${formData.company}\n` + fullMessage;
    if (formData.requirement) fullMessage = `Requirement: ${formData.requirement}\n` + fullMessage;

    try {
      const response = await fetch('/api/index.php?route=quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: fullMessage
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus({ text: data.message || 'Thank you! We will get back to you shortly.', type: 'success' });
        setFormData({ name: '', company: '', email: '', phone: '', requirement: '', message: '' });
      } else {
        setStatus({ text: data.error || 'Submission failed. Please try again.', type: 'error' });
      }
    } catch (err) {
      setStatus({ text: 'A network error occurred. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div ref={ref} className="contact-grid fade">
          <div>
            <h2 className="contact-title">Get in Touch</h2>
            <p className="contact-text">We would love to hear from you.</p>
            <div className="contact-details">
              <div className="contact-item"><Phone /><a href="tel:+918805603951">+91 88056 03951</a></div>
              <div className="contact-item"><Mail /><a href="mailto:yashindustries@rediffmail.com">yashindustries@rediffmail.com</a></div>
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
                    <input id="phone" type="tel" required className="form-input" value={formData.phone} onChange={handleChange} />
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
