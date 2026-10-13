import { Factory, Settings2, Building2, GraduationCap } from 'lucide-react';
import useFadeIn from '../hooks/useFadeIn';

const industries = [
  {
    Icon: Factory,
    title: 'Industrial & Manufacturing',
    description:
      'Robust electrical panel solutions built for demanding factory environments and continuous production operations.',
  },
  {
    Icon: Settings2,
    title: 'Automation & Control',
    description:
      'Precision control panels that integrate seamlessly with automated processes and machinery control systems.',
  },
  {
    Icon: Building2,
    title: 'Commercial Establishments',
    description:
      'Reliable distribution and power management solutions for offices, retail spaces, and commercial buildings.',
  },
  {
    Icon: GraduationCap,
    title: 'Educational Institutions',
    description:
      'Safe, dependable electrical infrastructure for schools, colleges, and technical institutes.',
  },
];

export default function Industries() {
  const headerRef = useFadeIn();
  const gridRef = useFadeIn();

  return (
    <section id="industries" className="industries-section">
      <div className="container">
        {/* Section Header */}
        <div ref={headerRef} className="section-header fade">
          <h2 className="section-title">Industries We Serve</h2>
          <p className="section-subtitle">
            Electrical panel solutions tailored to the needs of businesses,
            industrial operations and institutions.
          </p>
        </div>

        {/* Sector Cards */}
        <div ref={gridRef} className="industries-sector-grid fade">
          {industries.map(({ Icon, title, description }) => (
            <div key={title} className="industry-sector-card">
              <div className="industry-sector-icon" aria-hidden="true">
                <Icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="industry-sector-title">{title}</h3>
              <p className="industry-sector-description">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
