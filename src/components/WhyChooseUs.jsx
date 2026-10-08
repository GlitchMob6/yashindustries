import { ShieldCheck, Headphones, Settings, DollarSign, Zap } from 'lucide-react';
import useFadeIn from '../hooks/useFadeIn';

// W Layout: 3 on top row, 2 centered on bottom row
const topFeatures = [
  {
    icon: <ShieldCheck />,
    title: 'Best Build Quality',
    text: 'Every panel is built with premium-grade components and rigorous QA checks.',
  },
  {
    icon: <Zap />,
    title: 'Best Service',
    text: 'Timely delivery and professional installation at your facility.',
  },
  {
    icon: <Headphones />,
    title: 'Best Support',
    text: '24/7 after-sales support and on-site assistance whenever you need it.',
  },
];

const bottomFeatures = [
  {
    icon: <Settings />,
    title: 'Custom Solutions',
    text: 'Tailor-made LV panels designed to your exact specifications and load requirements.',
  },
  {
    icon: <DollarSign />,
    title: 'Competitive Pricing',
    text: 'Industry-best pricing without compromising on quality or safety standards.',
  },
];

export default function WhyChooseUs() {
  const headerRef = useFadeIn();
  const layoutRef = useFadeIn();

  return (
    <section id="why" className="why-section">
      <div className="container">
        <div ref={headerRef} className="section-header fade">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            Five reasons why industry leaders trust Yash Industries for their LV panel needs.
          </p>
        </div>
        <div ref={layoutRef} className="features-w-layout fade">
          {/* Top row — 3 items */}
          <div className="features-row-top">
            {topFeatures.map((f) => (
              <div key={f.title} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-text">{f.text}</p>
              </div>
            ))}
          </div>
          {/* Bottom row — 2 items centered (W shape) */}
          <div className="features-row-bottom">
            {bottomFeatures.map((f) => (
              <div key={f.title} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
