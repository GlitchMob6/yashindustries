import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useFadeIn from '../hooks/useFadeIn';
import { scrollToSection } from '../utils/scroll';

const visibleJobs = [
  { title: 'Designer', info: 'Full-time • On-site' },
  { title: 'Sales Handler', info: 'Full-time • On-site' },
  { title: 'Panel Machine Operator', info: 'Full-time • On-site' },
];

const hiddenJobs = [
  { title: 'Accountant', info: 'Full-time • On-site' },
  { title: 'Sales & Marketing Executive', info: 'Full-time • Hybrid' },
];

function JobCard({ job }) {
  return (
    <div className="job-card">
      <div>
        <h4 className="job-title">{job.title}</h4>
        <p className="job-info">{job.info}</p>
      </div>
      <a href="#contact" className="job-apply" onClick={(e) => scrollToSection(e, '#contact')}>Apply →</a>
    </div>
  );
}

export default function Careers() {
  const [showMore, setShowMore] = useState(false);
  const headerRef = useFadeIn();
  const gridRef = useFadeIn();

  return (
    <section id="careers" className="careers-section">
      <div className="container">
        <div ref={headerRef} className="section-header fade">
          <h2 className="section-title">Join Our Team</h2>
          <p className="section-subtitle">Build your career with Yash Industries.</p>
        </div>
        <div ref={gridRef} className="fade">
          <div className="careers-grid">
            {visibleJobs.map((job) => (
              <JobCard key={job.title} job={job} />
            ))}
          </div>

          {showMore && (
            <div className="careers-grid" style={{ marginTop: '1.5rem' }}>
              {hiddenJobs.map((job) => (
                <JobCard key={job.title} job={job} />
              ))}
            </div>
          )}

          <div className="view-all-link" style={{ marginTop: '2rem' }}>
            <button className="see-more-btn" onClick={() => setShowMore(!showMore)}>
              {showMore ? (
                <>
                  <ChevronUp size={16} /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={16} /> See More Openings ({hiddenJobs.length} more)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
