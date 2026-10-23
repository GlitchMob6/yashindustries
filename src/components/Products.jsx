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

const fallbackImageByProductName = {
  'mcc panel': '/images/mcc_panel_1791435907074.jpg',
  'pcc panel': '/images/pcc_panel_1791435921126.jpg',
  'vfd panel': '/images/vfd_panel_1791435937888.jpg',
  'apfc panel': '/images/apfc_panel_1791435963764.jpg',
  'distribution board': '/images/distribution_board_1791435976000.jpg',
  'distribution boards': '/images/distribution_board_1791435976000.jpg',
  'control panel': '/images/control_panel_1791435990845.jpg',
  'custom control panel': '/images/control_panel_1791435990845.jpg',
};

// Older database rows point to these filenames, which do not exist in public/images.
// Map them to the real bundled images so existing hosted data works without waiting
// for a database migration.
const legacyImagePathMap = {
  '/images/mcc.jpg': '/images/mcc_panel_1791435907074.jpg',
  '/images/pcc.jpg': '/images/pcc_panel_1791435921126.jpg',
  '/images/apfc.jpg': '/images/apfc_panel_1791435963764.jpg',
  '/images/db.jpg': '/images/distribution_board_1791435976000.jpg',
  '/images/vfd.jpg': '/images/vfd_panel_1791435937888.jpg',
  '/images/custom.jpg': '/images/control_panel_1791435990845.jpg',
};

const normalizeName = (name = '') => name.trim().toLowerCase();

const getFallbackImage = (product) => {
  const databasePath = product.image_path?.trim().toLowerCase();
  return (databasePath && legacyImagePathMap[databasePath])
    || fallbackImageByProductName[normalizeName(product.name)]
    || '';
};

const getProductImagePath = (product) => {
  const databasePath = product.image_path?.trim();
  const legacyFallback = databasePath
    ? legacyImagePathMap[databasePath.toLowerCase()]
    : null;

  return legacyFallback || databasePath || getFallbackImage(product);
};

export default function Products({ onOpenQuote }) {
  const [products, setProducts] = useState(fallbackProducts);
  const headerRef = useFadeIn();
  const gridRef = useFadeIn();

  useEffect(() => {
    fetch('/api/index.php?route=products')
      .then(res => {
        if (!res.ok) throw new Error(`Products API returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => console.error('Could not load products, using fallback', err));
  }, []);

  const handleProductImageError = (e, product) => {
    const image = e.currentTarget;
    const fallbackImage = getFallbackImage(product);

    if (
      fallbackImage
      && image.dataset.fallbackApplied !== 'true'
      && image.getAttribute('src') !== fallbackImage
    ) {
      image.dataset.fallbackApplied = 'true';
      image.src = fallbackImage;
      return;
    }

    // Avoid leaving a large empty image-shaped area if both sources fail.
    image.style.display = 'none';
  };

  const handleGetQuote = (e, product) => {
    e.preventDefault();
    onOpenQuote({
      id: product.id ?? null,
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
                <img
                  src={getProductImagePath(product)}
                  className="product-image"
                  loading="lazy"
                  alt={product.name}
                  onError={(e) => handleProductImageError(e, product)}
                />
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
