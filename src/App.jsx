import './index.css';
import { useState, useCallback, useLayoutEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Projects from './components/Projects';
import Industries from './components/Industries';
import WhyChooseUs from './components/WhyChooseUs';
import Achievements from './components/Achievements';
import Careers from './components/Careers';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import ConversionModals from './components/ConversionModals';

function App() {
  const [isAdminRoute] = useState(() => window.location.pathname.startsWith('/admin'));

  // Reset scroll and normalize URL hash on fresh homepage load / refresh
  useLayoutEffect(() => {
    if (isAdminRoute) return;

    // 1. Disable browser's automatic restoration of previous scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Clear stale in-page fragment (e.g. #contact) without creating a new history entry
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // 3. Reset scroll position to top
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }

    const rId = requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch {
        window.scrollTo(0, 0);
      }
    });

    return () => cancelAnimationFrame(rId);
  }, [isAdminRoute]);

  // Modal state: type is 'quote' | 'apply' | null
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);

  const openQuote = useCallback((product = null) => {
    setModalData(product ? { product } : null);
    setModalType('quote');
  }, []);

  const openApply = useCallback((job = null) => {
    setModalData(job ? { job } : null);
    setModalType('apply');
  }, []);

  const closeModal = useCallback(() => {
    setModalType(null);
    setModalData(null);
  }, []);

  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <>
      <Navbar onOpenQuote={openQuote} />
      <main>
        <Hero />
        <About />
        <Products onOpenQuote={openQuote} />
        <Projects />
        <Industries />
        <WhyChooseUs />
        <Achievements />
        <Careers onApply={openApply} />
        <Contact />
      </main>
      <Footer />

      <ConversionModals
        modalType={modalType}
        modalData={modalData}
        onClose={closeModal}
      />
    </>
  );
}

export default App;
