/**
 * @fileoverview Main JavaScript file for Marc Castellví Vila's portfolio website.
 * Handles interactive animations, scroll effects, video playback, and responsive navigation.
 *
 * This file contains:
 * - Background video autoplay handling
 * - Scroll-triggered animations for sections
 * - Header visibility and parallax effects
 * - Mobile navigation menu functionality
 * - Project card reveal animations
 * - Reel video player controls
 *
 * @author Marc Castellví Vila
 * @version 1.0.0
 * @since 2024
 */

window.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('bg-video');
  if (video) {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.error('Autoplay blocked or error:', err);
        const tryPlay = () => {
          video.play().catch((e) => console.error('Play failed:', e));
          window.removeEventListener('click', tryPlay);
          window.removeEventListener('keydown', tryPlay);
        };
        window.addEventListener('click', tryPlay);
        window.addEventListener('keydown', tryPlay);
      });
    }
    video.addEventListener('error', function (e) {
      console.error('Video error:', e);
      alert('Video could not be loaded. Check the filename and path.');
    });
  }

  const fixedHeader = document.querySelector('.fixed-header');
  const mainHeader = document.querySelector('.main-header');
  function updateHeaderTitleVisibility() {
    if (!fixedHeader || !mainHeader) return;
    const rect = mainHeader.getBoundingClientRect();
    if (rect.bottom <= 0) {
      fixedHeader.classList.add('show-title');
    } else {
      fixedHeader.classList.remove('show-title');
    }
    const headerHeight = mainHeader.offsetHeight;
    const scrollY = Math.max(0, Math.min(headerHeight, -rect.top));
    const progress = Math.max(0, Math.min(1, scrollY / headerHeight));
    document.body.style.setProperty('--header-anim-progress', progress.toFixed(4));
  }
  window.addEventListener('scroll', updateHeaderTitleVisibility, { passive: true });
  window.addEventListener('resize', updateHeaderTitleVisibility);
  updateHeaderTitleVisibility();

  const aboutSection = document.getElementById('about');
  function revealAboutOnScroll() {
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < windowHeight * 0.85) {
      aboutSection.classList.add('visible');
      window.removeEventListener('scroll', revealAboutOnScroll);
    }
  }
  if (aboutSection) {
    window.addEventListener('scroll', revealAboutOnScroll, { passive: true });
    revealAboutOnScroll();
  }

  const reelSection = document.getElementById('reel');
  function revealReelOnScroll() {
    if (!reelSection) return;
    const rect = reelSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < windowHeight * 0.85) {
      reelSection.classList.add('visible');
      window.removeEventListener('scroll', revealReelOnScroll);
    }
  }
  if (reelSection) {
    window.addEventListener('scroll', revealReelOnScroll, { passive: true });
    revealReelOnScroll();
  }

  const reelHeader = document.querySelector('.reel-header');
  function updateReelHeaderParallax() {
    if (!reelSection || !reelHeader) return;
    const rect = reelSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom > 0 && rect.top < windowHeight) {
      const progress = Math.min(1, Math.max(0, 1 - rect.top / windowHeight));
      const parallaxY = -progress * 80;
      reelHeader.style.transform = `translate(-50%, -50%) translateY(${parallaxY}px)`;
    }
  }
  window.addEventListener('scroll', updateReelHeaderParallax, { passive: true });
  window.addEventListener('resize', updateReelHeaderParallax);
  updateReelHeaderParallax();

  const reelPlayBtn = document.getElementById('reel-play-btn');
  const reelPreview = document.querySelector('.reel-preview');
  const reelVideo = document.getElementById('reel-video');
  if (reelPlayBtn && reelPreview && reelVideo) {
    reelPlayBtn.addEventListener('click', function () {
      reelPreview.style.display = 'none';
      reelPlayBtn.style.display = 'none';
      reelVideo.style.display = 'block';
      reelVideo.play();
      if (reelVideo.requestFullscreen) {
        reelVideo.requestFullscreen();
      } else if (reelVideo.webkitRequestFullscreen) {
        reelVideo.webkitRequestFullscreen();
      } else if (reelVideo.msRequestFullscreen) {
        reelVideo.msRequestFullscreen();
      }
    });
    function resetReelPlayer() {
      reelVideo.pause();
      reelVideo.currentTime = 0;
      reelVideo.style.display = 'none';
      reelPreview.style.display = '';
      reelPlayBtn.style.display = '';
    }
    reelVideo.addEventListener('ended', function () {
      resetReelPlayer();
      if (document.fullscreenElement === reelVideo && document.exitFullscreen) {
        document.exitFullscreen();
      }
    });
    // Fix: Hide video and show preview when exiting fullscreen manually
    function onFullscreenChange() {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        if (!reelVideo.paused) {
          reelVideo.pause();
        }
        resetReelPlayer();
      }
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('msfullscreenchange', onFullscreenChange);
  }

  // Fade-in animation for contact section on scroll (Apple-style)
  const contactUsSection = document.getElementById('contact');
  const contactUsGlass = document.querySelector('.contactus-glass');
  function revealContactUsOnScroll() {
    if (!contactUsSection || !contactUsGlass) return;
    const rect = contactUsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < windowHeight * 0.85) {
      contactUsSection.classList.add('visible');
      window.removeEventListener('scroll', revealContactUsOnScroll);
    }
  }
  if (contactUsSection && contactUsGlass) {
    window.addEventListener('scroll', revealContactUsOnScroll, { passive: true });
    revealContactUsOnScroll();
  }

  // Floating label accessibility: ensure label floats on autofill
  document.querySelectorAll('.contactus-input, .contactus-textarea').forEach(function (input) {
    input.addEventListener('input', function () {
      if (input.value) {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });

  // Form submit feedback
  const contactUsForm = document.querySelector('.contactus-form');
  if (contactUsForm) {
    contactUsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactUsForm.reset();
      const btn = contactUsForm.querySelector('.contactus-btn span');
      if (btn) {
        btn.textContent = 'Sent!';
        setTimeout(() => {
          btn.textContent = 'Send';
        }, 1800);
      }
    });
  }

  // Scroll-to-top button logic
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  function updateScrollToTopBtn() {
    if (!scrollToTopBtn) return;
    const mainHeader = document.querySelector('.main-header');
    let inMainHeader = false;
    if (mainHeader) {
      const rect = mainHeader.getBoundingClientRect();
      // If the top of the main header is visible in the viewport
      inMainHeader = rect.bottom > 0 && rect.top < window.innerHeight;
    }
    if (inMainHeader) {
      document.body.classList.add('in-main-header');
    } else {
      document.body.classList.remove('in-main-header');
    }
    if (window.scrollY > window.innerHeight * 0.5 && !inMainHeader) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', updateScrollToTopBtn, { passive: true });
  window.addEventListener('resize', updateScrollToTopBtn);
  updateScrollToTopBtn();

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    scrollToTopBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // 1. Insert animated background gradient overlay
  (function () {
    if (!document.querySelector('.animated-bg-gradient')) {
      const bg = document.createElement('div');
      bg.className = 'animated-bg-gradient';
      document.body.prepend(bg);
    }
  })();

  // 2. Animate section entrances (fade/slide)
  function animateSectionOnScroll(section) {
    if (!section) return;
    function reveal() {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowHeight * 0.85) {
        section.classList.add('visible');
        window.removeEventListener('scroll', reveal);
      }
    }
    section.classList.add('section-animate');
    window.addEventListener('scroll', reveal, { passive: true });
    reveal();
  }
  animateSectionOnScroll(document.querySelector('.about-section'));
  animateSectionOnScroll(document.querySelector('.reel-section'));
  animateSectionOnScroll(document.querySelector('.projects-section'));
  animateSectionOnScroll(document.querySelector('.contact-section'));

  // 3. Sticky nav transitions background/blur as you scroll
  (function () {
    const header = document.querySelector('.fixed-header');
    function updateNavSticky() {
      if (!header) return;
      if (window.scrollY > 32) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNavSticky, { passive: true });
    updateNavSticky();
  })();

  document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.main-nav[data-menu]');
    if (hamburger && nav) {
      function closeMenu() {
        nav.classList.remove('open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      hamburger.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('open');
        hamburger.classList.toggle('is-active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      nav.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', closeMenu);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
      });
    }
  });
});

// 5. Add reel-video-wrapper animation when scrolling to the reel section reel card gets smaller
(function () {
  const reelWrapper = document.getElementById('reel-video-wrapper');
  const reelPreview = document.querySelector('.reel-preview');
  if (!reelWrapper || !reelPreview) return;

  function updateReelWrapperScale() {
    const rect = reelWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    // When the card is entering the viewport, animate scale and border-radius
    const start = windowHeight * 0.7; // start animating when card is 70% from top
    const end = windowHeight * 0.25; // finish animating when card is 25% from top
    let progress = 0;
    if (rect.top < start) {
      progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
    }
    // Interpolate scale and border-radius
    const scale = 1.24 - 0.12 * progress;
    const radius = 0 + 32 * progress; // px
    reelWrapper.style.transform = `scale(${scale})`;
    reelWrapper.style.borderRadius = `${radius}px`;
    reelPreview.style.borderRadius = `${radius}px`;
    reelWrapper.style.boxShadow =
      progress > 0.1 ? '0 4px 32px 0 rgba(0,0,0,0.22)' : '0 8px 48px 0 rgba(0,0,0,0.18)';
  }

  window.addEventListener('scroll', updateReelWrapperScale, { passive: true });
  window.addEventListener('resize', updateReelWrapperScale);
  updateReelWrapperScale();
})();

// Fade in and slide up project cards as you scroll to them
(function () {
  const projectCards = document.querySelectorAll('.project-card');
  if (!projectCards.length) return;

  function revealProjectCardsOnScroll() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    projectCards.forEach((card, idx) => {
      if (card.classList.contains('visible')) return;
      const rect = card.getBoundingClientRect();
      if (rect.top < windowHeight * 0.92 && rect.bottom > 0) {
        // Stagger animation for a nice effect
        setTimeout(() => card.classList.add('visible'), idx * 120);
      }
    });
  }
  window.addEventListener('scroll', revealProjectCardsOnScroll, { passive: true });
  window.addEventListener('resize', revealProjectCardsOnScroll);
  // Initial check in case some cards are already visible
  revealProjectCardsOnScroll();
})();

// Fade-in animation for timeline items
function revealTimelineItems() {
  const aboutSection = document.querySelector('.about-section');
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (!aboutSection || !timelineItems.length) return;
  if (aboutSection.classList.contains('visible')) {
    timelineItems.forEach((item, idx) => {
      setTimeout(() => item.classList.add('visible'), 150 + idx * 170);
    });
    window.removeEventListener('scroll', revealTimelineItems);
  }
}
window.addEventListener('scroll', revealTimelineItems, { passive: true });
revealTimelineItems();
