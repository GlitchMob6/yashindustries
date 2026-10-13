import './index.css';
import { useState, useCallback } from 'react';
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
