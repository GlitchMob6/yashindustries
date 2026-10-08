import useFadeIn from '../hooks/useFadeIn';

const industries = [
  { name: 'Manufacturing', description: 'MCC & PCC panels for factory floors.', image: '/images/ind_manufacturing_1791436499527.jpg' },
  { name: 'Automotive', description: 'VFD panels for conveyor and assembly lines.', image: '/images/ind_automotive_1791436515597.jpg' },
  { name: 'Energy & Power', description: 'APFC panels for power factor improvement.', image: '/images/proj_apfc_1791436419208.jpg' },
  { name: 'Infrastructure', description: 'Distribution boards for commercial buildings.', image: '/images/proj_distribution_1791436405561.jpg' },
  { name: 'Construction', description: 'Robust panels for site and heavy machinery.', image: '/images/proj_installation_1791436387408.jpg' },
  { name: 'Textile', description: 'Control panels for automated textile machines.', image: '/images/ind_manufacturing_1791436499527.jpg' },
];

export default function Industries() {
  const headerRef = useFadeIn();
  const gridRef = useFadeIn();

  return (
    <section id="industries" className="industries-section">
      <div className="container">
        <div ref={headerRef} className="section-header fade">
          <h2 className="section-title">Industries We Serve</h2>
          <p className="section-subtitle">Delivering LV panel solutions across multiple sectors.</p>
        </div>
        <div ref={gridRef} className="industries-grid fade">
          {industries.map((industry) => (
            <div key={industry.name} className="industry-card">
              <img src={industry.image} className="industry-image" loading="lazy" alt={industry.name} />
              <div className="industry-overlay" />
              <div className="industry-content">
                <h3 className="industry-name">{industry.name}</h3>
                <p className="industry-description">{industry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
