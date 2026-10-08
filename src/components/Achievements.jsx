import { useState } from 'react';
import { Medal, ChevronDown, ChevronUp } from 'lucide-react';
import useFadeIn from '../hooks/useFadeIn';

const visibleAchievements = [
  {
    name: 'Best Manufacturer Award',
    description: 'Awarded for excellence in LV panel manufacturing quality.',
  },
  {
    name: 'Quality Excellence Award',
    description: 'Recognized for maintaining ISO-grade quality standards consistently.',
  },
  {
    name: 'Industry Innovation Award',
    description: 'For pioneering smart APFC and VFD panel integration solutions.',
  },
];

const hiddenAchievements = [
  {
    name: 'Export Excellence Award',
    description: 'Recognized for outstanding growth in panel exports.',
  },
  {
    name: 'Best MSME Award',
    description: 'State-level recognition for outstanding SME performance.',
  },
  {
    name: 'Green Manufacturing Award',
    description: 'For commitment to eco-friendly and energy-efficient manufacturing.',
  },
  {
    name: 'Client Choice Award',
    description: 'Voted most trusted panel manufacturer by industry clients.',
  },
];

function AchievementCard({ achievement }) {
  return (
    <div className="cert-card">
      <div className="cert-icon-wrapper">
        <Medal />
      </div>
      <h4 className="cert-name">{achievement.name}</h4>
      <p className="cert-description">{achievement.description}</p>
    </div>
  );
}

export default function Achievements() {
  const [showMore, setShowMore] = useState(false);
  const headerRef = useFadeIn();
  const gridRef = useFadeIn();

  return (
    <section id="achievements" className="achievements-section">
      <div className="container">
        <div ref={headerRef} className="section-header fade">
          <h2 className="section-title">Our Achievements</h2>
          <p className="section-subtitle">
            Awards and recognition that reflect our commitment to quality and excellence.
          </p>
        </div>
        <div ref={gridRef} className="fade">
          <div className="cert-grid">
            {visibleAchievements.map((a) => (
              <AchievementCard key={a.name} achievement={a} />
            ))}
          </div>

          {/* Hidden achievements — shown on See More */}
          {showMore && (
            <div className="cert-grid" style={{ marginTop: '1.5rem' }}>
              {hiddenAchievements.map((a) => (
                <AchievementCard key={a.name} achievement={a} />
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
                  <ChevronDown size={16} /> See More ({hiddenAchievements.length} more)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
