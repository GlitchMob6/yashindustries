import './index.css';
import { useState } from 'react';
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

function App() {
  const [isAdminRoute] = useState(() => window.location.pathname.startsWith('/admin'));

  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Products />
        <Projects />
        <Industries />
        <WhyChooseUs />
        <Achievements />
        <Careers />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
