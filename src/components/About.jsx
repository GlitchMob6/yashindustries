import useFadeIn from '../hooks/useFadeIn';

export default function About() {
  const ref = useFadeIn();

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div ref={ref} className="about-grid fade">
          <div>
            <h2 className="about-title">About Yash Industries</h2>
            <p className="about-text">
              Yash Industries is a leading manufacturer of Low Voltage (LV) electrical panels.
              With over a decade of expertise, we deliver precision-engineered MCC, PCC, VFD,
              APFC, Distribution Boards, and custom Control Panels for industries across the
              region. Our state-of-the-art facility and experienced team ensure every panel meets
              the highest safety and quality standards.
            </p>
            <div className="about-cards">
              <div className="about-card">
                <h4 className="about-card-title">Quality Assurance</h4>
                <p className="about-card-text">Uncompromising standards in every panel we build.</p>
              </div>
              <div className="about-card">
                <h4 className="about-card-title">Innovation</h4>
                <p className="about-card-text">Smarter panels for modern electrical systems.</p>
              </div>
              <div className="about-card">
                <h4 className="about-card-title">Reliability</h4>
                <p className="about-card-text">Built for long-term, fault-free performance.</p>
              </div>
              <div className="about-card">
                <h4 className="about-card-title">Sustainability</h4>
                <p className="about-card-text">Energy-efficient designs for a greener future.</p>
              </div>
            </div>
          </div>
          <div className="about-image-wrapper">
            <img src="/images/about_us_1791436369946.jpg" className="about-image" loading="lazy" alt="About Yash Industries" />
            <div className="about-decoration" />
          </div>
        </div>
      </div>
    </section>
  );
}
