export const scrollToSection = (e, href, setMenuOpen = null) => {
  if (e) e.preventDefault();
  if (setMenuOpen) setMenuOpen(false);

  if (href === '#') return;

  const target = document.querySelector(href);
  if (!target) return;

  // Update the hash and let the browser handle one native smooth-scroll operation.
  // The previous RAF loop called window.scrollTo() on every frame while the page
  // also had CSS scroll-behavior: smooth. Those two animation systems could fight
  // each other and land on the wrong section at different viewport widths/scales.
  window.history.pushState(null, '', href);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
};
