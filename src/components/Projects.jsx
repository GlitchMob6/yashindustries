import { useState } from 'react';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';
import useFadeIn from '../hooks/useFadeIn';

const projects = [
  { id: '01', client: 'Nupur Electricals' },
  { id: '02', client: 'Bhavani Traders' },
  { id: '03', client: 'Atharva Enterprises' },
  { id: '04', client: 'Chandrama Automation' },
  { id: '05', client: 'Cool Well' },
  { id: '06', client: 'KBTCOE' },
];

const INITIAL_COUNT = 3;

export default function Projects() {
  const [expanded, setExpanded] = useState(false);
  const headerRef = useFadeIn();
  const gridRef = useFadeIn();

  const visible = expanded ? projects : projects.slice(0, INITIAL_COUNT);

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        {/* Section Header */}
        <div ref={headerRef} className="section-header fade">
          <h2 className="section-title">Projects That Build Trust.</h2>
          <p className="section-subtitle">
            Delivering dependable electrical panel solutions to businesses and
            institutions, with a focus on quality and practical engineering.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div
          ref={gridRef}
          className="projects-sticker-grid fade"
          id="projects-grid"
          aria-live="polite"
        >
          {visible.map((project) => (
            <div key={project.client} className="project-sticker-card">
              <div className="project-sticker-id">{project.id}</div>
              <div className="project-sticker-body">
                <h3 className="project-sticker-client">{project.client}</h3>
                <span className="project-sticker-pill">
                  <Zap size={11} strokeWidth={2.5} aria-hidden="true" />
                  Electrical Panels
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Show All / Show Less toggle */}
        <div className="projects-toggle-row">
          <button
            className="projects-toggle-btn"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls="projects-grid"
          >
            {expanded ? (
              <>
                Show Less
                <ChevronUp size={16} aria-hidden="true" />
              </>
            ) : (
              <>
                Show All Projects
                <ChevronDown size={16} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
