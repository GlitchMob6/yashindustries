import useFadeIn from '../hooks/useFadeIn';

export default function Gallery() {
  const headerRef = useFadeIn();
  const gridRef = useFadeIn();

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div ref={headerRef} className="section-header fade">
          <h2 className="section-title">Gallery</h2>
          <p className="section-subtitle">A look inside our manufacturing facility and completed projects.</p>
        </div>
        <div ref={gridRef} className="gallery-grid fade">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="gallery-item">
              <img
                src="/images/placeholder.jpg"
                className="gallery-image"
                loading="lazy"
                alt={`Gallery ${i}`}
                style={i % 3 === 0 ? { aspectRatio: '4/5' } : i % 2 === 0 ? { aspectRatio: '3/4' } : {}}
              />
            </div>
          ))}
        </div>
        <div className="view-all-link">
          <a href="#">View Full Gallery</a>
        </div>
      </div>
    </section>
  );
}
