/**
 * Marc Castellvi Portfolio - Enhanced JavaScript
 * Modern ES6+ implementation with accessibility and performance optimizations
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
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
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

  observeElements() {
    const elements = document.querySelectorAll('.section-animate, .project-card, .fade-in, .slide-up, .scale-in');
    elements.forEach(el => {
      this.observer.observe(el);
    });
  }

  fallbackAnimations() {
    // Immediately show all elements for older browsers
    const elements = document.querySelectorAll('.section-animate, .project-card, .fade-in, .slide-up, .scale-in');
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
    this.headerTitle = document.querySelector('.header-title');
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
    if (!this.fixedHeader || !this.mainHeader) return;

    const rect = this.mainHeader.getBoundingClientRect();
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
        this.closeMenu();
        this.smoothScroll(e);
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
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
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

// Video player management
class VideoManager {
  constructor() {
    this.bgVideo = document.getElementById('bg-video');
    this.reelVideo = document.getElementById('reel-video');
    this.reelPreview = document.querySelector('.reel-preview');
    this.reelPlayBtn = document.getElementById('reel-play-btn');
    this.init();
  }

  init() {
    this.initBackgroundVideo();
    this.initReelVideo();
  }

  initBackgroundVideo() {
    if (!this.bgVideo) return;

    const playPromise = this.bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Background video autoplay blocked:', err);
        this.setupUserInteractionPlayback();
      });
    }

    this.bgVideo.addEventListener('error', (e) => {
      console.error('Background video error:', e);
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
    if (!this.reelPlayBtn || !this.reelVideo || !this.reelPreview) return;

    this.reelPlayBtn.addEventListener('click', () => this.playReelVideo());
    this.reelVideo.addEventListener('ended', () => this.resetReelPlayer());
    
    // Handle fullscreen changes
    ['fullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(event => {
      document.addEventListener(event, () => this.handleFullscreenChange());
    });
  }

  playReelVideo() {
    this.reelPreview.style.display = 'none';
    this.reelPlayBtn.style.display = 'none';
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
    
    if (this.reelPlayBtn) {
      this.reelPlayBtn.style.display = '';
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

      // Initialize legacy animations for backward compatibility
      this.initLegacyAnimations();

      console.log('Portfolio application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize portfolio application:', error);
    }
  }

  initLegacyAnimations() {
    // Project cards animation
    const projectCards = document.querySelectorAll('.project-card');
    const revealProjectCards = () => {
      const windowHeight = window.innerHeight;
      projectCards.forEach((card, idx) => {
        if (card.classList.contains('visible')) return;
        const rect = card.getBoundingClientRect();
        if (rect.top < windowHeight * 0.92 && rect.bottom > 0) {
          setTimeout(() => card.classList.add('visible'), idx * 120);
        }
      });
    };

    window.addEventListener('scroll', revealProjectCards, { passive: true });
    revealProjectCards();

    // Timeline items animation
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

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioApp };
}
