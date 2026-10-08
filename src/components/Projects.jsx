import useFadeIn from '../hooks/useFadeIn';
import { scrollToSection } from '../utils/scroll';

const projects = [
  {
    category: 'Industrial',
    name: 'PCC & MCC Panel Installation',
    client: 'AutoCorp Manufacturing',
    image: '/images/proj_installation_1791436387408.jpg',
  },
  {
    category: 'Infrastructure',
    name: 'Distribution Board Setup',
    client: 'City Municipal Corporation',
    image: '/images/proj_distribution_1791436405561.jpg',
  },
  {
    category: 'Energy',
    name: 'APFC Panel — Power Factor Correction',
    client: 'Energy Solutions Ltd.',
    image: '/images/proj_apfc_1791436419208.jpg',
  },
];

export default function Projects() {
  const headerRef = useFadeIn();
  const gridRef = useFadeIn();

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <div ref={headerRef} className="section-header fade">
          <h2 className="section-title">Our Projects</h2>
          <p className="section-subtitle">Explore some of our recent LV panel installations.</p>
        </div>
        <div ref={gridRef} className="projects-grid fade">
          {projects.map((project) => (
            <div key={project.name} className="project-card">
              <img src={project.image} className="project-image" loading="lazy" alt={project.name} />
              <div className="project-overlay" />
              <div className="project-content">
                <span className="project-category">{project.category}</span>
                <h3 className="project-name">{project.name}</h3>
                <p className="project-client">{project.client}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-link">
          <a href="#projects" onClick={(e) => scrollToSection(e, '#projects')}>View All Projects</a>
        </div>
      </div>
    </section>
  );
}
