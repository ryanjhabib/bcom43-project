// Adjustable scroll interval in pixels between message swaps
const SCROLL_INTERVAL_PX = 800; // tweak this value to speed up/slow down transitions
const FADE_DURATION_MS = 200; // keep in sync with CSS transition
const LEADERSHIP_DELAY_PX = 200; // short delay for leadership text after beach image

const slides = Array.from(document.querySelectorAll('.fader .slide'));
if (slides.length > 0) {
  let currentIndex = slides.findIndex((el) => el.classList.contains('is-visible'));
  if (currentIndex < 0) currentIndex = 0;
  slides.forEach((el, i) => el.classList.toggle('is-visible', i === currentIndex));

  let lastIndex = currentIndex;

  const updateByScroll = () => {
    const scrollY = window.scrollY;
    let step = Math.max(0, Math.floor(scrollY / SCROLL_INTERVAL_PX));
    
    // Special handling for leadership text (slide 5) - add short delay after beach image (slide 4)
    if (step === 5) {
      const beachImageEnd = 4 * SCROLL_INTERVAL_PX;
      const leadershipStart = beachImageEnd + LEADERSHIP_DELAY_PX;
      if (scrollY < leadershipStart) {
        step = 4; // Stay on beach image until delay is reached
      }
    }
    
    const index = step % slides.length;
    if (index !== lastIndex) {
      slides[lastIndex].classList.remove('is-visible');
      slides[index].classList.add('is-visible');
      lastIndex = index;
    }
  };

  // Throttle via requestAnimationFrame for smoothness
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateByScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial state
  updateByScroll();
}

// Ensure there is enough page height to allow scrolling through messages
document.addEventListener('DOMContentLoaded', () => {
  const minHeight = SCROLL_INTERVAL_PX * (slides.length + 1);
  const body = document.body;
  if (body.scrollHeight < minHeight) {
    const filler = document.createElement('div');
    filler.style.height = String(minHeight) + 'px';
    filler.style.pointerEvents = 'none';
    filler.style.opacity = '0';
    document.documentElement.appendChild(filler);
  }
});
