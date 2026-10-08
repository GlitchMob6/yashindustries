import { Share2, Globe, MessageCircle } from 'lucide-react';

const quickLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#products', label: 'Products' },
  { href: '#projects', label: 'Projects' },
  { href: '#careers', label: 'Careers' },
  { href: '#contact', label: 'Contact' },
];

const handleAnchor = (e, href) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">Yash Industries</p>
            <p className="footer-brand-text">
              Leading manufacturer of LV electrical panels — MCC, PCC, VFD, APFC & Control Panels.
            </p>
          </div>
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <nav className="footer-links">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="footer-link"
                  onClick={(e) => handleAnchor(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact-info">
              <p>+91 98765 43210</p>
              <p>contact@yashindustries.com</p>
              <p>MIDC Industrial Area, Nashik, MH</p>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="LinkedIn"><Share2 /></a>
              <a href="#" className="social-link" aria-label="Instagram"><Globe /></a>
              <a href="#" className="social-link" aria-label="Facebook"><MessageCircle /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© 2026 Yash Industries. All rights reserved.</p>
          <p className="footer-copyright">Privacy Policy • Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
