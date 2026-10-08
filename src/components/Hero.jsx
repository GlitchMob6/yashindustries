import { scrollToSection } from '../utils/scroll';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-pattern" />
      <div className="hero-image-wrapper">
        <img src="/images/hero_bg_1791436349487.jpg" className="hero-image" loading="lazy" alt="Yash Industries" />
        <div className="hero-image-gradient" />
      </div>
      <div className="container hero-content">
        <div className="hero-text">
          <p className="hero-subtitle">Welcome to Yash Industries</p>
          <h1 className="hero-title">LV Panel Manufacturers &amp; Electrical Solutions</h1>
          <p className="hero-description">
            We design and manufacture premium Low Voltage panels — MCC, PCC, VFD, APFC, Distribution
            Boards, and Custom Control Panels — built for reliability across every industry.
          </p>
          <div className="hero-buttons">
            <a href="#products" className="btn-primary" onClick={(e) => scrollToSection(e, '#products')}>
              Explore Products
            </a>
            <a href="#contact" className="btn-outline" onClick={(e) => scrollToSection(e, '#contact')}>
              Contact Us
            </a>
          </div>
        </div>
        <div className="stats-grid">
          <div><p className="stat-number">10+</p><p className="stat-label">Years Experience</p></div>
          <div><p className="stat-number">500+</p><p className="stat-label">Panels Delivered</p></div>
          <div><p className="stat-number">50+</p><p className="stat-label">Industry Awards</p></div>
          <div><p className="stat-number">100%</p><p className="stat-label">Client Satisfaction</p></div>
        </div>
      </div>
    </section>
  );
}
