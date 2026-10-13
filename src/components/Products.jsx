import { useState, useEffect } from 'react';
import useFadeIn from '../hooks/useFadeIn';

const fallbackProducts = [
  {
    category: 'LV Panel',
    name: 'MCC Panel',
    description: 'Motor Control Centre panels for controlling and protecting industrial motors.',
    image_path: '/images/mcc_panel_1791435907074.jpg',
  },
  {
    category: 'LV Panel',
    name: 'PCC Panel',
    description: 'Power Control Centre panels for incoming power distribution in industries.',
    image_path: '/images/pcc_panel_1791435921126.jpg',
  },
  {
    category: 'LV Panel',
    name: 'VFD Panel',
    description: 'Variable Frequency Drive panels for speed control and energy savings.',
    image_path: '/images/vfd_panel_1791435937888.jpg',
  },
  {
    category: 'LV Panel',
    name: 'APFC Panel',
    description: 'Automatic Power Factor Correction panels to reduce energy costs and penalties.',
    image_path: '/images/apfc_panel_1791435963764.jpg',
  },
  {
    category: 'LV Panel',
    name: 'Distribution Board',
    description: 'Compact and robust distribution boards for safe power distribution.',
    image_path: '/images/distribution_board_1791435976000.jpg',
  },
  {
    category: 'LV Panel',
    name: 'Control Panel',
    description: 'Custom-built control panels for automation and process control applications.',
    image_path: '/images/control_panel_1791435990845.jpg',
  },
];

export default function Products({ onOpenQuote }) {
  const [products, setProducts] = useState(fallbackProducts);
  const headerRef = useFadeIn();
  const gridRef   = useFadeIn();

  useEffect(() => {
    fetch('/api/index.php?route=products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => console.error('Could not load products, using fallback', err));
  }, []);

  const handleGetQuote = (e, product) => {
    e.preventDefault();
    // Pass the product object so the modal can prefill it.
    // product.id exists only for DB-sourced products; fallback products have no id.
    onOpenQuote({
      id:   product.id   ?? null,
      name: product.name ?? '',
    });
  };

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
                <img src={product.image_path} className="product-image" loading="lazy" alt={product.name} />
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <button
                  className="product-link"
                  onClick={(e) => handleGetQuote(e, product)}
                  aria-label={`Get a quote for ${product.name}`}
                >
                  Get Quote →
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-link">
          <a href="#products">View All Products</a>
        </div>
      </div>
    </section>
  );
}
