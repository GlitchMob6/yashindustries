export const scrollToSection = (e, href, setMenuOpen = null) => {
  if (e) e.preventDefault();
  if (setMenuOpen) setMenuOpen(false);
  
  if (href === '#') return; // ignore placeholder links but prevent jump

  const target = document.querySelector(href);
  if (!target) return;

  const navbarHeight = 80; // offset
  const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({
    top: targetPosition,
    behavior: prefersReducedMotion ? 'auto' : 'smooth'
  });

  // Update URL without jumping
  window.history.pushState(null, '', href);
};
