// --- Custom Carousel Scrollbar Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel-container');
  const carouselTrack = document.getElementById('carousel-track');
  const leftArrow = document.getElementById('carousel-arrow-left');
  const rightArrow = document.getElementById('carousel-arrow-right');
  if (!carousel || !carouselTrack || !leftArrow || !rightArrow) return;

  // Center the next/prev project card in the carousel
  function centerProjectCard(index) {
    const cards = Array.from(carouselTrack.querySelectorAll('.project-card'));
    if (!cards.length) return;
    // Clamp index to valid range
    const total = cards.length;
    let i = ((index % total) + total) % total;
    const card = cards[i];
    const cardRect = card.getBoundingClientRect();
    const carouselRect = carousel.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const carouselCenter = carouselRect.left + carouselRect.width / 2;
    // Calculate the scrollX needed to center this card
    // Find the card's offsetLeft relative to the track
    const cardOffset = card.offsetLeft + card.offsetWidth / 2;
    const targetScroll = cardOffset - carousel.offsetWidth / 2;
    // Set scrollX directly (disable auto-scroll)
    if (window.portfolioApp) {
      const carouselComp = window.portfolioApp.getComponent('projectCarousel');
      if (carouselComp) {
        carouselComp.isAnimating = false;
        // Animate the jump smoothly
        const start = -carouselComp.scrollX;
        const end = targetScroll;
        const duration = 520; // ms
        const startTime = performance.now();
        function animateScroll(now) {
          const elapsed = now - startTime;
          const t = Math.min(1, elapsed / duration);
          // Ease in-out cubic
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          const current = start + (end - start) * ease;
          carouselComp.scrollX = -current;
          carouselTrack.style.transform = `translateX(${-current}px)`;
          if (t < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            carouselComp.scrollX = -end;
            carouselTrack.style.transform = `translateX(${-end}px)`;
            // After animation, schedule auto-scroll resume
            if (window.carouselAutoScrollTimeout) clearTimeout(window.carouselAutoScrollTimeout);
            window.carouselAutoScrollTimeout = setTimeout(() => {
              carouselComp.isAnimating = true;
            }, 5000);
          }
        }
        requestAnimationFrame(animateScroll);
      }
    }
    // Store current index for navigation
    carousel.currentCenteredIndex = i;
  }

  // Find the initial centered card (closest to center)
  function getClosestCardIndex() {
    const cards = Array.from(carouselTrack.querySelectorAll('.project-card'));
    if (!cards.length) return 0;
    const carouselRect = carousel.getBoundingClientRect();
    const carouselCenter = carouselRect.left + carouselRect.width / 2;
    let minDist = Infinity;
    let minIdx = 0;
    cards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const dist = Math.abs(cardCenter - carouselCenter);
      if (dist < minDist) {
        minDist = dist;
        minIdx = idx;
      }
    });
    return minIdx;
  }

  // Arrow button event listeners
  leftArrow.addEventListener('click', () => {
    const cards = Array.from(carouselTrack.querySelectorAll('.project-card'));
    let idx = carousel.currentCenteredIndex ?? getClosestCardIndex();
    idx = (idx - 1 + cards.length) % cards.length;
    centerProjectCard(idx);
  });
  rightArrow.addEventListener('click', () => {
    const cards = Array.from(carouselTrack.querySelectorAll('.project-card'));
    let idx = carousel.currentCenteredIndex ?? getClosestCardIndex();
    idx = (idx + 1) % cards.length;
    centerProjectCard(idx);
  });

  // Center the closest card on load
  setTimeout(() => {
    centerProjectCard(getClosestCardIndex());
  }, 200);

  // Optionally: recenter on window resize
  window.addEventListener('resize', () => {
    if (typeof carousel.currentCenteredIndex === 'number') {
      centerProjectCard(carousel.currentCenteredIndex);
    }
  });
});
// Floating Skills Window logic
document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('skills-float-btn');
  const floatWin = document.getElementById('skills-float-window');
  const closeBtn = document.getElementById('skills-float-close');
  if (!openBtn || !floatWin || !closeBtn) return;

  // Always start hidden
  floatWin.hidden = true;
  floatWin.classList.remove('closing');
  floatWin.style.opacity = '';

  function openSkills() {
    floatWin.classList.remove('closing');
    floatWin.hidden = false;
    // Force reflow to allow transition
    void floatWin.offsetWidth;
    floatWin.style.opacity = '';
    floatWin.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeSkills() {
    floatWin.classList.add('closing');
    floatWin.style.opacity = '0';
    setTimeout(() => {
      floatWin.hidden = true;
      floatWin.classList.remove('closing');
      floatWin.style.opacity = '';
      document.body.style.overflow = '';
      openBtn.focus();
    }, 320); // match CSS transition duration
  }
  openBtn.addEventListener('click', openSkills);
  closeBtn.addEventListener('click', closeSkills);
  floatWin.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSkills();
  });
  // Click outside to close
  document.addEventListener('mousedown', (e) => {
    if (!floatWin.hidden && !floatWin.contains(e.target) && e.target !== openBtn) {
      closeSkills();
    }
  });
});
// Parallax effect for "watch my reel" PNG label
document.addEventListener('DOMContentLoaded', () => {
  const reelWrapper = document.getElementById('reel-video-wrapper');
  const playCard = document.getElementById('reel-play-card');
  const reelLabel = document.querySelector('.reel-reel-label');
  if (!reelWrapper || !playCard || !reelLabel) return;

  playCard.addEventListener('mousemove', (e) => {
    const rect = playCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = (x / rect.width - 0.5) * 2;
    const percentY = (y / rect.height - 0.5) * 2;
    const maxOffset = 7; // px, reduced for subtle effect
    const offsetX = percentX * maxOffset;
    const offsetY = percentY * maxOffset;
    reelLabel.style.transform = `translate(-50%, 0) translate(${offsetX}px, ${offsetY}px)`;
  });
  playCard.addEventListener('mouseleave', () => {
    reelLabel.style.transform = 'translate(-50%, 0)';
  });
});
/**
 * Marc Castellvi Portfolio - Enhanced JavaScript
 * Modern ES6+ implementation with  observeEle  fallbackAnimations() {
    // Immediately show all elements for older browsers
    const elements = document.querySelectorAll('.section-animate, .project-card, .fade-in, .slide-up, .scale-in');
    elements.forEach(el => {
      el.classList.add('visible');
    });
  } {
    const elements = document.querySelectorAll('.section-animate, .project-card, .fade-in, .slide-up, .scale-in');
    elements.forEach(el => {
      this.observer.observe(el);
    });
  }sibility and performance optimizations
 */

// Theme management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.body = document.body;
    this.init();
  }

  init() {
    this.bindEvents();
    this.applyStoredTheme();
  }

  bindEvents() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  toggleTheme() {
    const currentTheme = this.body.dataset.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  setTheme(theme) {
    this.body.dataset.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle icon
    if (this.themeToggle) {
      const icon = this.themeToggle.querySelector('.theme-icon');
      icon.style.transform = theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  applyStoredTheme() {
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    this.setTheme(savedTheme);
  }
}

// Intersection Observer for animations
class AnimationObserver {
  constructor() {
    this.observer = null;
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Debug log removed
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Debug log removed
            
            // Special handling for about section
            if (entry.target.classList.contains('about-section')) {
              // Debug log removed
              this.triggerAboutAnimations();
            }
            
            // Remove observer after animation to improve performance
            this.observer.unobserve(entry.target);
          }
        });
      }, this.options);

      // Observe all animated elements
      this.observeElements();
    } else {
      // Fallback for older browsers
      this.fallbackAnimations();
    }
  }

  triggerAboutAnimations() {
    // Trigger the about section child animations
    const aboutImageContent = document.querySelector('.about-image-content');
    const aboutTextContent = document.querySelector('.about-text-content');
    
    if (aboutImageContent) {
      setTimeout(() => {
        aboutImageContent.style.opacity = '1';
        aboutImageContent.style.transform = 'none';
      }, 100);
    }
    
    if (aboutTextContent) {
      setTimeout(() => {
        aboutTextContent.style.opacity = '1';
        aboutTextContent.style.transform = 'none';
      }, 280);
    }
  }

  observeElements() {
    const elements = document.querySelectorAll('.section-animate, .project-card, .fade-in, .slide-up, .scale-in, .about-section');
    elements.forEach(el => {
      this.observer.observe(el);
    });
  }

  fallbackAnimations() {
    // Immediately show all elements for older browsers
    const elements = document.querySelectorAll('.section-animate, .project-card, .fade-in, .slide-up, .scale-in, .about-section');
    elements.forEach(el => {
      el.classList.add('visible');
    });
  }
}

// Header management

class HeaderManager {
  constructor() {
    this.fixedHeader = document.querySelector('.fixed-header');
    this.mainHeader = document.querySelector('.main-header');
    this.headerTitle = document.getElementById('header-title');
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateHeaderVisibility();
  }

  bindEvents() {
    // Use passive listeners for better performance
    window.addEventListener('scroll', () => this.updateHeaderVisibility(), { passive: true });
    window.addEventListener('resize', () => this.updateHeaderVisibility(), { passive: true });
  }

  updateHeaderVisibility() {
    if (!this.fixedHeader || !this.mainHeader || !this.headerTitle) return;

    const rect = this.mainHeader.getBoundingClientRect();
    // Show title as soon as the main header bottom is above the top of the viewport
    const isScrolledPast = rect.bottom <= 0;

    // Toggle header title visibility
    this.fixedHeader.classList.toggle('show-title', isScrolledPast);
    this.fixedHeader.classList.toggle('scrolled', window.scrollY > 50);

    // Update header animation progress
    const headerHeight = this.mainHeader.offsetHeight;
    const scrollY = Math.max(0, Math.min(headerHeight, -rect.top));
    const progress = Math.max(0, Math.min(1, scrollY / headerHeight));
    document.body.style.setProperty('--header-anim-progress', progress.toFixed(4));
  }
}

// Navigation management
class NavigationManager {
  constructor() {
    this.hamburger = document.getElementById('hamburger');
    this.nav = document.querySelector('.main-nav[data-menu]');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.isOpen = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeMenu();
        
        // Use section navigator instead of smooth scroll
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const sectionId = href.substring(1);
          // Get the section navigator instance
          const app = window.portfolioApp;
          if (app && app.components.get('sectionNavigator')) {
            app.components.get('sectionNavigator').navigateToSection(sectionId);
          }
        }
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle focus trap
    document.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Tab') {
        this.handleFocusTrap(e);
      }
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.nav.classList.toggle('open', this.isOpen);
    this.hamburger.classList.toggle('is-active', this.isOpen);
    this.hamburger.setAttribute('aria-expanded', this.isOpen.toString());
    
    // Manage body scroll
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isOpen = false;
    this.nav.classList.remove('open');
    this.hamburger.classList.remove('is-active');
    this.hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  handleFocusTrap(e) {
    const focusableElements = this.nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  smoothScroll(e) {
    const targetId = e.target.getAttribute('href');
    
    // Only prevent default for internal anchor links
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = this.fixedHeader ? this.fixedHeader.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
}

// Video player management
class VideoManager {
  constructor() {
    this.bgVideo = document.getElementById('bg-video');
    this.reelVideo = document.getElementById('reel-video');
    this.reelPreview = document.querySelector('.reel-preview');
    this.reelPlayCard = document.getElementById('reel-play-card');
    this.init();
  }

  init() {
    this.initBackgroundVideo();
    this.initReelVideo();
  }

  initBackgroundVideo() {
    if (!this.bgVideo) {
      // Debug log removed
      return;
    }

    // Debug logs removed

    // Debug logs removed

    const playPromise = this.bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Debug log removed
      }).catch((err) => {
        // Debug log removed
        this.setupUserInteractionPlayback();
      });
    }

    this.bgVideo.addEventListener('error', (e) => {
      // Optionally handle video errors in production
    });
  }

  setupUserInteractionPlayback() {
    const playVideo = () => {
      this.bgVideo.play().catch(e => console.warn('Play failed:', e));
      document.removeEventListener('click', playVideo);
      document.removeEventListener('keydown', playVideo);
    };

    document.addEventListener('click', playVideo);
    document.addEventListener('keydown', playVideo);
  }

  initReelVideo() {
    if (!this.reelPlayCard || !this.reelVideo || !this.reelPreview) return;

    // Play on click
    this.reelPlayCard.addEventListener('click', () => this.playReelVideo());
    // Play on Enter/Space
    this.reelPlayCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.playReelVideo();
      }
    });
    this.reelVideo.addEventListener('ended', () => this.resetReelPlayer());

    // Handle fullscreen changes
    ['fullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(event => {
      document.addEventListener(event, () => this.handleFullscreenChange());
    });

    // Add reel card scroll animation
    this.initReelScrollAnimation();
  }

  initReelScrollAnimation() {
    const reelWrapper = document.getElementById('reel-video-wrapper');
    if (!reelWrapper) return;

    window.addEventListener('scroll', () => {
      const rect = reelWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Check if element is in viewport
      const isInViewport = elementTop < windowHeight && (elementTop + elementHeight) > 0;
      
      if (isInViewport) {
        // Calculate scroll progress within the element
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)));
        
        // Apply transform based on scroll progress
        const translateY = (scrollProgress - 0.5) * 20; // Subtle parallax effect
        const scale = 0.95 + (scrollProgress * 0.05); // Slight scale effect
        
        reelWrapper.style.transform = `translateY(${translateY}px) scale(${scale})`;
      }
    }, { passive: true });
  }

  playReelVideo() {
    this.reelPreview.style.display = 'none';
    if (this.reelPlayCard) this.reelPlayCard.style.display = 'none';
    this.reelVideo.style.display = 'block';

    this.reelVideo.play().then(() => {
      this.requestFullscreen();
    }).catch(err => {
      console.error('Reel video play failed:', err);
      this.resetReelPlayer();
    });
  }

  requestFullscreen() {
    if (this.reelVideo.requestFullscreen) {
      this.reelVideo.requestFullscreen();
    } else if (this.reelVideo.webkitRequestFullscreen) {
      this.reelVideo.webkitRequestFullscreen();
    } else if (this.reelVideo.msRequestFullscreen) {
      this.reelVideo.msRequestFullscreen();
    }
  }

  resetReelPlayer() {
    if (this.reelVideo) {
      this.reelVideo.pause();
      this.reelVideo.currentTime = 0;
      this.reelVideo.style.display = 'none';
    }
    
    if (this.reelPreview) {
      this.reelPreview.style.display = '';
    }
    
    if (this.reelPlayCard) {
      this.reelPlayCard.style.display = '';
    }
  }

  handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || 
                          document.webkitFullscreenElement || 
                          document.msFullscreenElement);
    
    if (!isFullscreen && this.reelVideo && !this.reelVideo.paused) {
      this.reelVideo.pause();
      this.resetReelPlayer();
    }
  }
}

// Scroll management
class ScrollManager {
  constructor() {
    this.scrollToTopBtn = document.getElementById('scrollToTopBtn');
    this.mainHeader = document.querySelector('.main-header');
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateScrollButton();
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.updateScrollButton(), { passive: true });
    
    // Add debugging for scroll issues
    window.addEventListener('wheel', (e) => {
      if (e.defaultPrevented) {
        // Debug log removed
      }
    }, { passive: true });
    
    if (this.scrollToTopBtn) {
      this.scrollToTopBtn.addEventListener('click', () => this.scrollToTop());
      this.scrollToTopBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.scrollToTop();
        }
      });
    }
  }

  updateScrollButton() {
    if (!this.scrollToTopBtn) return;

    const inMainHeader = this.isInMainHeader();
    const shouldShow = window.scrollY > window.innerHeight * 0.5 && !inMainHeader;
    
    document.body.classList.toggle('in-main-header', inMainHeader);
    this.scrollToTopBtn.classList.toggle('visible', shouldShow);
  }

  isInMainHeader() {
    if (!this.mainHeader) return false;
    
    const rect = this.mainHeader.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Performance optimization utilities
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.preloadCriticalResources();
    this.optimizeScrollPerformance();
  }

  setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading is supported
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.loading = 'lazy';
      });
    } else {
      // Fallback for older browsers
      this.implementLazyLoading();
    }
  }

  implementLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }

  preloadCriticalResources() {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
  }

  optimizeScrollPerformance() {
    // Throttle scroll events
    let ticking = false;
    
    const originalScrollHandler = window.onscroll;
    window.onscroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (originalScrollHandler) originalScrollHandler();
          ticking = false;
        });
        ticking = true;
      }
    };
  }
}

// Accessibility enhancements
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupSkipLinks();
    this.enhanceKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.manageFocusVisible();
  }

  setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content') || document.querySelector('main');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView();
      }
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  enhanceKeyboardNavigation() {
    // Add keyboard support for interactive elements
    const interactiveElements = document.querySelectorAll('.project-card, .nuke-tool-card');
    interactiveElements.forEach(element => {
      element.setAttribute('tabindex', '0');
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
  }

  setupScreenReaderSupport() {
    // Add ARIA labels and descriptions
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (!section.getAttribute('aria-label') && !section.getAttribute('aria-labelledby')) {
        section.setAttribute('aria-label', `Section ${index + 1}`);
      }
    });
  }

  manageFocusVisible() {
    // Only show focus outlines for keyboard navigation
    let hadKeyboardEvent = false;
    
    const keyboardThrottleTimeout = 100;
    let keyboardThrottleTimeoutId = 0;
    
    const pointerThrottleTimeout = 500;
    let pointerThrottleTimeoutId = 0;
    
    function markKeyboardEvent() {
      hadKeyboardEvent = true;
      clearTimeout(keyboardThrottleTimeoutId);
      keyboardThrottleTimeoutId = setTimeout(() => {
        hadKeyboardEvent = false;
      }, keyboardThrottleTimeout);
    }
    
    function markPointerEvent() {
      clearTimeout(pointerThrottleTimeoutId);
      pointerThrottleTimeoutId = setTimeout(() => {
        hadKeyboardEvent = false;
      }, pointerThrottleTimeout);
    }
    
    document.addEventListener('keydown', markKeyboardEvent);
    document.addEventListener('mousedown', markPointerEvent);
    document.addEventListener('pointerdown', markPointerEvent);
    
    document.addEventListener('focusin', (e) => {
      if (hadKeyboardEvent) {
        e.target.classList.add('focus-visible');
      }
    });
    
    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('focus-visible');
    });
  }
}

// Error handling and logging
class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('error', (e) => {
      this.logError('JavaScript Error', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.logError('Unhandled Promise Rejection', e.reason);
    });
  }

  logError(type, error) {
    const errorData = {
      type,
      message: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.error('Portfolio Error:', errorData);
    }

    // In production, you might want to send to an error tracking service
    // this.sendErrorToService(errorData);
  }
}

// Contact Form Management
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitBtn = document.getElementById('submit-btn');
    this.successMessage = document.getElementById('success-message');
    this.messageTextarea = document.getElementById('message');
    this.messageCount = document.getElementById('message-count');
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
    this.updateCharacterCount();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearErrors(input));
    });

    // Character count for message
    if (this.messageTextarea) {
      this.messageTextarea.addEventListener('input', () => this.updateCharacterCount());
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.setLoading(true);
    
    try {
      const formData = new FormData(this.form);
      
      // Simulate form submission (replace with actual endpoint)
      await this.submitForm(formData);
      
      this.showSuccess();
      this.form.reset();
      this.updateCharacterCount();
    } catch (error) {
      this.showError('Failed to send message. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  async submitForm(formData) {
    // Simulate network request
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    
    // Remove previous error state
    fieldGroup.classList.remove('error');
    
    // Check if required field is empty
    if (field.required && !value) {
      this.showFieldError(fieldGroup, 'This field is required.');
      return false;
    }
    
    // Validate email format
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(fieldGroup, 'Please enter a valid email address.');
        return false;
      }
    }
    
    // Validate message length
    if (field.id === 'message' && value.length > 2000) {
      this.showFieldError(fieldGroup, 'Message must be less than 2000 characters.');
      return false;
    }
    
    return true;
  }

  showFieldError(fieldGroup, message) {
    fieldGroup.classList.add('error');
    const errorElement = fieldGroup.querySelector('.form-error');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  clearErrors(field) {
    const fieldGroup = field.closest('.form-group');
    fieldGroup.classList.remove('error');
  }

  updateCharacterCount() {
    if (!this.messageTextarea || !this.messageCount) return;
    
    const currentLength = this.messageTextarea.value.length;
    const maxLength = 2000;
    
    this.messageCount.textContent = `${currentLength}/${maxLength}`;
    
    // Add warning/error classes based on character count
    this.messageCount.classList.remove('warning', 'error');
    
    if (currentLength > maxLength * 0.9) {
      this.messageCount.classList.add('warning');
    }
    
    if (currentLength > maxLength) {
      this.messageCount.classList.add('error');
    }
  }

  setLoading(isLoading) {
    this.submitBtn.disabled = isLoading;
    this.submitBtn.classList.toggle('loading', isLoading);
  }

  showSuccess() {
    this.successMessage.classList.add('show');
    setTimeout(() => {
      this.successMessage.classList.remove('show');
    }, 5000);
  }

  showError(message) {
    // Create or update error message
    let errorElement = document.getElementById('form-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = 'form-error';
      errorElement.style.cssText = `
        background: var(--color-error);
        color: white;
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-md);
        margin-top: var(--spacing-lg);
        text-align: center;
      `;
      this.form.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }
}

// Fullscreen Section Navigation System
class SectionNavigator {
  constructor() {
    this.sections = [];
    this.currentSection = 0;
    this.isAnimating = false;
    this.autoScrollInterval = null;
    this.autoScrollSpeed = 4000; // 4 seconds per section
    this.scrollableManager = new ScrollableSectionManager();
    this.init();
  }

  init() {
    this.setupSections();
    this.bindEvents();
    this.showSection(0);
    // REMOVE auto navigation to "about me" section
  }

  setupSections() {
    // Get all sections including the main header
    const mainHeader = document.querySelector('.main-header');
    const allSections = document.querySelectorAll('section.section');
    
    // Add main header as first section
    if (mainHeader) {
      this.sections.push(mainHeader);
      mainHeader.classList.add('active');
    }
    
    // Add all other sections
    allSections.forEach((section) => {
      this.sections.push(section);
      // Make sure they start hidden
      section.style.opacity = '0';
      section.style.visibility = 'hidden';
      section.style.transform = 'translateY(50px)';
      section.style.position = 'fixed';
      section.style.zIndex = '1';
    });

    // Debug log removed
  }

  bindEvents() {
    // Navigation dots
    const navDots = document.querySelectorAll('.section-nav-dot');
    navDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (!this.isAnimating) {
          this.goToSection(index);
        }
      });
    });

    // Previous/Next buttons
    const prevBtn = document.getElementById('prev-section');
    const nextBtn = document.getElementById('next-section');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (!this.isAnimating) {
          this.previousSection();
        }
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!this.isAnimating) {
          this.nextSection();
        }
      });
    }

    // Auto-scroll button
    const autoScrollBtn = document.getElementById('auto-scroll-btn');
    if (autoScrollBtn) {
      autoScrollBtn.addEventListener('click', () => {
        this.toggleAutoScroll();
      });
    }

    // Keyboard navigation with scrollable section support
    document.addEventListener('keydown', (e) => {
      if (this.isAnimating) return;
      
      const currentEl = this.sections[this.currentSection];
      
      switch(e.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        // If current section is scrollable, check if we can navigate
        if (currentEl && currentEl.classList.contains('scrollable')) {
          const scrollContainer = currentEl.querySelector('.section-content') || currentEl;
          const scrollTop = scrollContainer.scrollTop;
          const scrollHeight = scrollContainer.scrollHeight;
          const clientHeight = scrollContainer.clientHeight;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
            
          if (!isAtBottom) {
            // Not at bottom, scroll within section
            scrollContainer.scrollBy({ top: 100, behavior: 'smooth' });
            e.preventDefault();
            return;
          }
        }
          
        // Navigate to next section
        e.preventDefault();
        this.nextSection();
        break;
          
      case 'ArrowUp':
      case 'PageUp':
        // If current section is scrollable, check if we can navigate
        if (currentEl && currentEl.classList.contains('scrollable')) {
          const scrollContainer = currentEl.querySelector('.section-content') || currentEl;
          const scrollTop = scrollContainer.scrollTop;
            
          if (scrollTop > 0) {
            // Not at top, scroll within section
            scrollContainer.scrollBy({ top: -100, behavior: 'smooth' });
            e.preventDefault();
            return;
          }
        }
          
        // Navigate to previous section
        e.preventDefault();
        this.previousSection();
        break;
          
      case 'Home':
        e.preventDefault();
        this.goToSection(0);
        break;
      case 'End':
        e.preventDefault();
        this.goToSection(this.sections.length - 1);
        break;
      }
    });

    // Handle mouse wheel with special logic for scrollable sections
    document.addEventListener('wheel', (e) => {
      const currentEl = this.sections[this.currentSection];
      
      // If current section is scrollable, handle special navigation logic
      if (currentEl && currentEl.classList.contains('scrollable')) {
        const scrollContainer = currentEl.querySelector('.section-content') || currentEl;
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        
        // Check if we're at the top or bottom of the scrollable section
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        
        // Debug log removed
        
        // Allow navigation only if we're at the edges and scrolling in the appropriate direction
        if (e.deltaY > 0 && isAtBottom) {
          // Scrolling down at bottom - navigate to next section
          // Debug log removed
          e.preventDefault();
          if (!this.isAnimating) {
            this.nextSection();
          }
        } else if (e.deltaY < 0 && isAtTop) {
          // Scrolling up at top - navigate to previous section
          // Debug log removed
          e.preventDefault();
          if (!this.isAnimating) {
            this.previousSection();
          }
        }
        // Otherwise, let the section handle its own scrolling
        return;
      }
      
      // For non-scrollable sections, prevent default and handle navigation
      e.preventDefault();
      
      if (this.isAnimating) return;
      
      if (e.deltaY > 0) {
        this.nextSection();
      } else {
        this.previousSection();
      }
    }, { passive: false });
  }

  showSection(index) {
    if (index < 0 || index >= this.sections.length || this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    const previousSection = this.currentSection;
    this.currentSection = index;

    // Hide all sections except the current
    this.sections.forEach((section, i) => {
      if (i !== index) {
        section.style.opacity = '0';
        section.style.visibility = 'hidden';
        section.style.zIndex = '1';
        if (i < index) {
          section.style.transform = 'translateY(-50px)';
        } else {
          section.style.transform = 'translateY(50px)';
        }
      } else {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        section.style.transform = 'translateY(0)';
        section.style.zIndex = '10';
      }
    });

    // Special: If about-section, fade in its text content
    const currentEl = this.sections[index];
    if (currentEl && currentEl.id === 'about') {
      const aboutText = currentEl.querySelector('.about-text-content');
      if (aboutText) {
        aboutText.style.transition = 'opacity 0.8s cubic-bezier(.4,0,.2,1)';
        aboutText.style.opacity = '1';
      }
    }

    // Reset scrollable section if needed
    if (currentEl && currentEl.classList.contains('scrollable') && currentEl.id) {
      this.scrollableManager.resetSection(currentEl.id);
    }

    // Update navigation dots and buttons
    this.updateNavDots();
    this.updateNavButtons();

    setTimeout(() => {
      this.isAnimating = false;
    }, 500);

    // --- Fixed Header Title Visibility Logic ---
    // Show the fixed header title if NOT on the main (hero) section (index 0)
    const fixedHeader = document.querySelector('.fixed-header');
    if (fixedHeader) {
      if (index === 0) {
        fixedHeader.classList.remove('show-title');
      } else {
        fixedHeader.classList.add('show-title');
      }
    }
  }

  updateNavDots() {
    const navDots = document.querySelectorAll('.section-nav-dot');
    navDots.forEach((dot, index) => {
      if (index === this.currentSection) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  updateNavButtons() {
    const prevBtn = document.getElementById('prev-section');
    const nextBtn = document.getElementById('next-section');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentSection === 0;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentSection === this.sections.length - 1;
    }
  }

  goToSection(index) {
    if (index >= 0 && index < this.sections.length) {
      this.showSection(index);
    }
  }

  nextSection() {
    if (this.currentSection < this.sections.length - 1) {
      this.showSection(this.currentSection + 1);
    }
  }

  previousSection() {
    if (this.currentSection > 0) {
      this.showSection(this.currentSection - 1);
    }
  }

  toggleAutoScroll() {
    const autoScrollBtn = document.getElementById('auto-scroll-btn');
    
    if (this.autoScrollInterval) {
      // Stop auto-scroll
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
      
      if (autoScrollBtn) {
        autoScrollBtn.innerHTML = '▶';
        autoScrollBtn.classList.remove('playing');
      }
    } else {
      // Start auto-scroll
      this.autoScrollInterval = setInterval(() => {
        if (this.currentSection < this.sections.length - 1) {
          this.nextSection();
        } else {
          // Loop back to beginning
          this.goToSection(0);
        }
      }, this.autoScrollSpeed);
      
      if (autoScrollBtn) {
        autoScrollBtn.innerHTML = '⏸';
        autoScrollBtn.classList.add('playing');
      }
    }
  }

  // Test method to verify navigation
  testNavigation() {
    // Debug log removed
    
    // Test navigation to second section
    setTimeout(() => {
      console.log('Testing navigation to section 1');
      this.goToSection(1);
    }, 2000);
  }

  // Public method to jump to a specific section by ID
  navigateToSection(sectionId) {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      const sectionIndex = this.sections.findIndex(section => section === sectionElement);
      if (sectionIndex !== -1) {
        this.goToSection(sectionIndex);
      }
    }
  }
}

// Scrollable Section Manager
class ScrollableSectionManager {
  constructor() {
    this.scrollableSections = new Map();
    this.init();
  }

  init() {
    this.setupScrollableSections();
    this.bindScrollEvents();
  }

  setupScrollableSections() {
    const scrollableSections = document.querySelectorAll('.section.scrollable');
    
    scrollableSections.forEach(section => {
      const sectionId = section.id;
      const scrollIndicator = section.querySelector('.scroll-indicator');
      
      this.scrollableSections.set(sectionId, {
        element: section,
        indicator: scrollIndicator,
        isAtBottom: false,
        canNavigateNext: false
      });
      
      console.log(`Setup scrollable section: ${sectionId}`);
    });
  }

  bindScrollEvents() {
    // Listen for scroll events on scrollable sections
    this.scrollableSections.forEach((sectionData, sectionId) => {
      const section = sectionData.element;
      
      // Use the section content for scroll events instead of the section itself
      const scrollContainer = section.querySelector('.section-content') || section;
      
      scrollContainer.addEventListener('scroll', () => {
        this.handleSectionScroll(sectionId);
      });
    });
  }

  handleSectionScroll(sectionId) {
    const sectionData = this.scrollableSections.get(sectionId);
    if (!sectionData) return;

    const section = sectionData.element;
    const scrollContainer = section.querySelector('.section-content') || section;
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;
    
    // Check if we're near the bottom (within 50px)
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
    
    // Update state
    const wasAtBottom = sectionData.isAtBottom;
    sectionData.isAtBottom = isAtBottom;
    sectionData.canNavigateNext = isAtBottom;
    
    // Update scroll indicator
    if (sectionData.indicator) {
      if (isAtBottom) {
        sectionData.indicator.classList.add('hidden');
      } else {
        sectionData.indicator.classList.remove('hidden');
      }
    }
    
    // Log state change
    if (wasAtBottom !== isAtBottom) {
      console.log(`Section ${sectionId} scroll state changed - at bottom: ${isAtBottom}, scrollTop: ${scrollTop}, clientHeight: ${clientHeight}, scrollHeight: ${scrollHeight}`);
    }
  }

  canNavigateFromSection(sectionId) {
    const sectionData = this.scrollableSections.get(sectionId);
    return sectionData ? sectionData.canNavigateNext : true;
  }

  resetSection(sectionId) {
    const sectionData = this.scrollableSections.get(sectionId);
    if (sectionData) {
      const section = sectionData.element;
      const scrollContainer = section.querySelector('.section-content') || section;
      
      scrollContainer.scrollTop = 0;
      sectionData.isAtBottom = false;
      sectionData.canNavigateNext = false;
      
      if (sectionData.indicator) {
        sectionData.indicator.classList.remove('hidden');
      }
      
      console.log(`Reset scrollable section: ${sectionId}`);
    }
  }
}

// Project Carousel Manager
class ProjectCarousel {
  constructor() {
    this.carousel = null;
    this.carouselTrack = null;
    this.projectCards = [];
    this.isAnimating = true;
    this.scrollX = 0;
    this.cardWidth = 0;
    this.totalSetWidth = 0;
    this.duplicateSets = 3; // Restore to 3 for seamless infinite loop
    this._hasStartedAnimation = false; // Track if animation has started
    this.init();
  }

  init() {
    this.carousel = document.querySelector('.carousel-container');
    this.carouselTrack = document.querySelector('.carousel-track');
    if (!this.carousel || !this.carouselTrack) {
      console.log('Carousel elements not found');
      return;
    }
    this.setupInfiniteScroll();
    this.bindEvents();
    this.startOpacityAnimation();
    this.startCarouselAnimation();
  }

  startCarouselAnimation() {
    // Calculate card width and total set width
    if (this.projectCards.length > 0) {
      const card = this.projectCards[0];
      this.cardWidth = card.offsetWidth + 32; // 32px gap (var(--spacing-xl))
      this.totalSetWidth = this.projectCards.length * this.cardWidth;
    }
    let lastTimestamp = null;
    let currentSpeed = 0.09; // px per ms (slower)
    let targetSpeed = 0.09;
    const minSpeed = 0.02;
    const speedEasing = 0.08; // Lower = smoother stop/start
    // Only set scrollX to -totalSetWidth on the first animation start or after a reset
    if (!this._hasStartedAnimation) {
      this.scrollX = -this.totalSetWidth;
      this.carouselTrack.style.transform = `translateX(${this.scrollX}px)`;
      this._hasStartedAnimation = true;
    }
    const animate = (timestamp) => {
      currentSpeed += (targetSpeed - currentSpeed) * speedEasing;
      let doMove = this.isAnimating;
      if (!doMove) {
        targetSpeed = 0;
      } else {
        targetSpeed = 0.025; // 50% slower scroll when animating
      }
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      if (doMove) {
        this.scrollX -= currentSpeed * delta;
        // If we've scrolled past the end of the middle set (B), jump back by totalSetWidth
        if (this.scrollX <= -2 * this.totalSetWidth) {
          this.scrollX += this.totalSetWidth;
        }
        // If we've scrolled before the start of the middle set (B), jump forward by totalSetWidth
        if (this.scrollX >= 0) {
          this.scrollX -= this.totalSetWidth;
        }
      }
      this.carouselTrack.style.transform = `translateX(${this.scrollX}px)`;

      // --- Center card scaling effect ---
      // Always run this, even if not moving
      const containerRect = this.carousel.getBoundingClientRect();
      const trackRect = this.carouselTrack.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      const allCards = this.carouselTrack.querySelectorAll('.project-card');
      allCards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(cardCenter - containerCenter);
        const maxScale = 1;
        const minScale = 0.82;
        const scaleRange = maxScale - minScale;
        const visibleWidth = containerRect.width;
        const edgeZone = visibleWidth * 0.20;
        let scale, blur;
        if (dist < edgeZone) {
          scale = maxScale;
          blur = 0;
        } else if (dist < visibleWidth / 2) {
          const t = (dist - edgeZone) / (visibleWidth / 2 - edgeZone);
          const drop = t * t;
          scale = maxScale - drop * scaleRange;
          blur = drop * 6;
        } else {
          scale = minScale;
          blur = 6;
        }
        card.style.transition = 'transform 0.38s cubic-bezier(.33,1.6,.6,1), filter 0.38s cubic-bezier(.33,1.6,.6,1)';
        card.style.transform = `scale(${scale})`;
        card.style.filter = `blur(${blur}px)`;
        card.style.zIndex = scale > (maxScale - 0.01) ? '2' : '';
      });

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  setupInfiniteScroll() {
    // Remove all cards except the originals (first set)
    const allCards = Array.from(this.carouselTrack.querySelectorAll('.project-card'));
    // Only keep the first N originals (not .carousel-clone)
    const originals = allCards.filter(card => !card.classList.contains('carousel-clone'));
    // Remove all clones and any extra sets
    allCards.forEach(card => {
      if (card.classList.contains('carousel-clone')) card.remove();
    });
    this.projectCards = Array.from(originals);
    // Clone and append cards for seamless infinite scroll
    for (let set = 0; set < this.duplicateSets; set++) {
      this.projectCards.forEach((card, index) => {
        const clone = card.cloneNode(true);
        clone.classList.add('carousel-clone');
        clone.setAttribute('data-set', set + 1);
        clone.setAttribute('data-index', index);
        this.carouselTrack.appendChild(clone);
      });
    }
    // Recalculate card width and set width
    if (this.projectCards.length > 0) {
      const card = this.projectCards[0];
      this.cardWidth = card.offsetWidth + 32;
      this.totalSetWidth = this.projectCards.length * this.cardWidth;
    }
    // Set scrollX to the start of the middle set for seamlessness
    this.scrollX = -this.totalSetWidth;
    this.carouselTrack.style.transform = `translateX(${this.scrollX}px)`;
    // Reset animation start flag so next animation will re-initialize
    this._hasStartedAnimation = false;
  }

  startOpacityAnimation() {
    // Remove all inline opacity styles and ensure all cards are fully opaque except on hover
    const cards = this.carouselTrack.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.style.opacity = '';
    });
  }

  bindEvents() {
    // Smoother pause/resume on hover for the whole carousel
    this.carouselTrack.addEventListener('mouseenter', () => {
      this.pauseAnimation();
      this.carouselTrack.classList.add('carousel-paused');
    });
    this.carouselTrack.addEventListener('mouseleave', () => {
      this.resumeAnimation();
      this.carouselTrack.classList.remove('carousel-paused');
    });

    // Pointer stays as grab, not pointer, for a more elegant look
    this.carouselTrack.style.cursor = 'grab';

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // No-op, JS controls speed
    }
  }

  pauseAnimation() {
    // Only stop the auto-move, not the sizing/blurring
    this.isAnimating = false;
    // Do NOT change transform or filter here; sizing/blurring is handled in the animation loop
  }

  resumeAnimation() {
    if (this.carouselTrack) {
      this.carouselTrack.style.animationPlayState = 'running';
      this.isAnimating = true;
    }
  }

  handleResize() {
    // Recalculate carousel setup on window resize
    setTimeout(() => {
      this.setupInfiniteScroll();
    }, 100);
  }
  resetCarousel() {
    // No longer needed, handled in setupInfiniteScroll
  }
}

// Main application initialization
class PortfolioApp {
  constructor() {
    this.components = new Map();
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all components
      this.components.set('theme', new ThemeManager());
      this.components.set('header', new HeaderManager());
      this.components.set('navigation', new NavigationManager());
      this.components.set('video', new VideoManager());
      this.components.set('scroll', new ScrollManager());
      this.components.set('animation', new AnimationObserver());
      this.components.set('performance', new PerformanceOptimizer());
      this.components.set('accessibility', new AccessibilityManager());
      this.components.set('errorHandler', new ErrorHandler());
      this.components.set('contactForm', new ContactForm());
      this.components.set('sectionNavigator', new SectionNavigator());
      this.components.set('scrollableSection', new ScrollableSectionManager());
      this.components.set('projectCarousel', new ProjectCarousel());

      // Initialize legacy animations for backward compatibility
      this.initLegacyAnimations();

      console.log('Portfolio application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize portfolio application:', error);
    }
  }

  initLegacyAnimations() {
    // Project cards animation (no delay, instant fade-in on scroll)
    const projectCards = document.querySelectorAll('.project-card');
    const revealProjectCards = () => {
      const windowHeight = window.innerHeight;
      projectCards.forEach((card) => {
        if (card.classList.contains('visible')) return;
        const rect = card.getBoundingClientRect();
        if (rect.top < windowHeight * 0.92 && rect.bottom > 0) {
          card.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', revealProjectCards, { passive: true });
    revealProjectCards();

    // Timeline items animation (keep stagger for timeline only)
    const revealTimelineItems = () => {
      const aboutSection = document.querySelector('.about-section');
      const timelineItems = document.querySelectorAll('.timeline-item');
      if (!aboutSection || !timelineItems.length) return;
      if (aboutSection.classList.contains('visible')) {
        timelineItems.forEach((item, idx) => {
          setTimeout(() => item.classList.add('visible'), 150 + idx * 170);
        });
      }
    };

    window.addEventListener('scroll', revealTimelineItems, { passive: true });
    revealTimelineItems();
  }

  getComponent(name) {
    return this.components.get(name);
  }
}

// Initialize the application
const app = new PortfolioApp();


// Make app globally accessible for section navigation
window.portfolioApp = app;

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioApp };
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('projects-toggle-btn');
  // Find the closest .projects-list to the toggle button (robust for DOM changes)
  let projectsList = null;
  if (toggleBtn) {
    // Look for .projects-list in the whole document, but only inside #project-cards
    const projectCardsSection = document.getElementById('project-cards');
    if (projectCardsSection) {
      projectsList = projectCardsSection.querySelector('.projects-list');
    }
  }
  if (!toggleBtn || !projectsList) return;
  toggleBtn.addEventListener('click', () => {
    const isList = projectsList.classList.toggle('list-view');
    toggleBtn.setAttribute('aria-pressed', isList ? 'true' : 'false');
    const label = toggleBtn.querySelector('.toggle-label');
    const icon = toggleBtn.querySelector('.toggle-icon');
    if (isList) {
      label.textContent = 'Show as Carousel';
      icon.textContent = '☰';
    } else {
      label.textContent = 'Show as List';
      icon.textContent = '☰';
    }
    // Add a quick highlight effect for feedback
    projectsList.classList.add('toggle-highlight');
    setTimeout(() => projectsList.classList.remove('toggle-highlight'), 350);
  });
});
