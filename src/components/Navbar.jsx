import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { scrollToSection } from '../utils/scroll';

const navLinks = [
  { href: '#home',         label: 'Home' },
  { href: '#about',        label: 'About' },
  { href: '#products',     label: 'Products' },
  { href: '#projects',     label: 'Projects' },
  { href: '#industries',   label: 'Industries' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#careers',      label: 'Careers' },
  { href: '#contact',      label: 'Contact' },
];

export default function Navbar({ onOpenQuote }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAnchorClick = (e, href) => {
    scrollToSection(e, href, setMenuOpen);
  };

  const handleQuoteClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    onOpenQuote(null); // generic quote — no product preselected
  };

  return (
    <nav id="nav" className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="nav-container">
          <a href="#home" className="nav-brand" onClick={(e) => handleAnchorClick(e, '#home')}>
            Yash Industries
          </a>
          <div className="nav-links">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={(e) => handleAnchorClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <button
              className="btn-quote"
              onClick={handleQuoteClick}
              aria-label="Get a Quote"
            >
              Get a Quote
            </button>
            <button
              className="toggle"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`menu${menuOpen ? ' active' : ''}`}>
        <div className="menu-inner">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <button
            className="menu-quote-btn"
            onClick={handleQuoteClick}
          >
            Get a Quote
          </button>
        </div>
      </div>
    </nav>
  );
}
