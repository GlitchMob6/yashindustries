let currentAnimation = null;

// Ease in-out cubic easing function
const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const scrollToSection = (e, href, setMenuOpen = null) => {
  if (e) e.preventDefault();
  if (setMenuOpen) setMenuOpen(false);

  if (href === '#') return; // ignore placeholder links but prevent jump

  const target = document.querySelector(href);
  if (!target) return;

  const navbarHeight = 80; // offset
  
  // Calculate maximum possible scroll position to prevent overshooting bounds
  const maxScroll = Math.max(
    document.body.scrollHeight, 
    document.documentElement.scrollHeight,
    document.body.offsetHeight, 
    document.documentElement.offsetHeight,
    document.body.clientHeight, 
    document.documentElement.clientHeight
  ) - window.innerHeight;

  const rawTargetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
  
  // Clamp target position to document bounds
  const targetPosition = Math.min(Math.max(0, rawTargetPosition), maxScroll);
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;

  // Cancel any ongoing animation so new clicks take precedence
  if (currentAnimation) {
    cancelAnimationFrame(currentAnimation);
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || distance === 0) {
    window.scrollTo(0, targetPosition);
    window.history.pushState(null, '', href);
    return;
  }

  // Calculate dynamic duration
  // Shorter jumps will be closer to minDuration (500ms)
  // Longer jumps will scale up to maxDuration (1200ms)
  const minDuration = 500;
  const maxDuration = 1200;
  const distanceRatio = Math.abs(distance) / window.innerHeight;
  // Add 200ms for every full viewport height of distance
  const duration = Math.min(Math.max(minDuration + distanceRatio * 200, minDuration), maxDuration);

  let startTime = null;

  const animationStep = (currentTime) => {
    if (startTime === null) {
      startTime = currentTime;
    }
    
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeProgress = easeInOutCubic(progress);
    window.scrollTo(0, startPosition + distance * easeProgress);

    if (progress < 1) {
      currentAnimation = requestAnimationFrame(animationStep);
    } else {
      currentAnimation = null;
      window.history.pushState(null, '', href);
    }
  };

  currentAnimation = requestAnimationFrame(animationStep);
};
