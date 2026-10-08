import useFadeIn from '../hooks/useFadeIn';
import { scrollToSection } from '../utils/scroll';

const products = [
  {
    category: 'LV Panel',
    name: 'MCC Panel',
    description: 'Motor Control Centre panels for controlling and protecting industrial motors.',
    image: '/images/mcc_panel_1791435907074.jpg',
  },
  {
    category: 'LV Panel',
    name: 'PCC Panel',
    description: 'Power Control Centre panels for incoming power distribution in industries.',
    image: '/images/pcc_panel_1791435921126.jpg',
  },
  {
    category: 'LV Panel',
    name: 'VFD Panel',
    description: 'Variable Frequency Drive panels for speed control and energy savings.',
    image: '/images/vfd_panel_1791435937888.jpg',
  },
  {
    category: 'LV Panel',
    name: 'APFC Panel',
    description: 'Automatic Power Factor Correction panels to reduce energy costs and penalties.',
    image: '/images/apfc_panel_1791435963764.jpg',
  },
  {
    category: 'LV Panel',
    name: 'Distribution Board',
    description: 'Compact and robust distribution boards for safe power distribution.',
    image: '/images/distribution_board_1791435976000.jpg',
  },
  {
    category: 'LV Panel',
    name: 'Control Panel',
    description: 'Custom-built control panels for automation and process control applications.',
    image: '/images/control_panel_1791435990845.jpg',
  },
];

export default function Products() {
  const headerRef = useFadeIn();
  const gridRef = useFadeIn();

  return (
    <section id="products" className="products-section">
      <div className="container">
        <div ref={headerRef} className="section-header fade">
          <h2 className="section-title">Our Products</h2>
          <p className="section-subtitle">
            Precision-engineered Low Voltage panels designed for reliability, safety, and performance.
          </p>
        </div>
        <div ref={gridRef} className="products-grid fade">
          {products.map((product) => (
            <div key={product.name} className="product-card">
              <div className="product-image-wrapper">
                <img src={product.image} className="product-image" loading="lazy" alt={product.name} />
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <a href="#contact" className="product-link" onClick={(e) => scrollToSection(e, '#contact')}>View Details →</a>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-link">
          <a href="#products" onClick={(e) => scrollToSection(e, '#products')}>View All Products</a>
        </div>
      </div>
    </section>
  );
}
