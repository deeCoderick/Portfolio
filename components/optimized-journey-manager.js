/**
 * Optimized Journey Manager
 * Consolidates all journey-related functionality with performance improvements
 * Combines journey-fix.js, journey-smooth.js, and enhanced-journey.js
 */

class OptimizedJourneyManager {
    constructor(app, options = {}) {
        this.app = app;
        this.options = {
            enableAnimations: true,
            enableCarousel: true,
            enableVisibilityFix: true,
            autoScroll: false,
            autoScrollDelay: 5000,
            ...options
        };
        
        this.journeySections = new Set();
        this.carouselInstances = new Map();
        this.isInitialized = false;
        this.isVisible = false;
        
        // Performance tracking
        this.rafId = null;
        this.lastUpdate = 0;
        this.updateThreshold = 16; // ~60fps
        
        // Bind methods
        this.handleScroll = this.app.throttle(this.onScroll.bind(this), 100);
        this.handleResize = this.app.debounce(this.onResize.bind(this), 250);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
    }

    /**
     * Initialize journey manager
     */
    async init() {
        if (this.isInitialized) return;
        
        // Find and register journey sections
        await this.discoverJourneySections();
        
        // Setup core functionality
        if (this.options.enableVisibilityFix) {
            this.setupVisibilityFix();
        }
        
        if (this.options.enableCarousel) {
            this.setupCarousels();
        }
        
        if (this.options.enableAnimations) {
            this.setupAnimations();
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup intersection observer for performance
        this.setupIntersectionObserver();
        
        this.isInitialized = true;
        console.debug('Journey Manager initialized');
    }

    /**
     * Discover all journey sections
     */
    async discoverJourneySections() {
        const selectors = [
            '#journey',
            '.journey-section',
            '.journey-container',
            '[data-journey]'
        ];
        
        for (const selector of selectors) {
            const elements = this.app.$(selector);
            elements.forEach(element => this.registerJourneySection(element));
        }
    }

    /**
     * Register a journey section
     */
    registerJourneySection(element) {
        if (this.journeySections.has(element)) return;
        
        this.journeySections.add(element);
        
        // Add common classes for styling
        element.classList.add('journey-managed', 'journey-visible');
        
        // Setup section-specific functionality
        this.setupSectionVisibility(element);
        this.setupSectionCarousel(element);
        this.setupSectionAnimations(element);
    }

    /**
     * Setup visibility fix for a section
     */
    setupSectionVisibility(section) {
        if (!this.options.enableVisibilityFix) return;
        
        // Force visibility of common problematic elements
        const problematicSelectors = [
            '.journey-item',
            '.journey-content',
            '.journey-date',
            '.journey-marker',
            '.journey-timeline',
            '.journey-tags',
            '.journey-tag',
            '.timeline-line'
        ];
        
        problematicSelectors.forEach(selector => {
            const elements = section.querySelectorAll(selector);
            elements.forEach(element => this.fixElementVisibility(element));
        });
    }

    /**
     * Fix visibility for individual element
     */
    fixElementVisibility(element) {
        // Only apply if element appears hidden
        if (this.isElementHidden(element)) {
            element.classList.add('force-visible');
            
            // Remove problematic inline styles
            ['display', 'visibility', 'opacity'].forEach(prop => {
                if (element.style[prop] === 'none' || 
                    element.style[prop] === 'hidden' || 
                    element.style[prop] === '0') {
                    element.style.removeProperty(prop);
                }
            });
        }
        
        // Setup hover interactions for content elements
        if (element.classList.contains('journey-content')) {
            this.setupContentInteractions(element);
        }
    }

    /**
     * Check if element is hidden
     */
    isElementHidden(element) {
        if (!element) return true;
        
        // Check inline styles first
        const style = element.style;
        if (style.display === 'none' || 
            style.visibility === 'hidden' || 
            style.opacity === '0') {
            return true;
        }
        
        // Check computed styles
        const computed = window.getComputedStyle(element);
        return computed.display === 'none' || 
               computed.visibility === 'hidden' || 
               parseFloat(computed.opacity) === 0;
    }

    /**
     * Setup content interactions
     */
    setupContentInteractions(element) {
        if (element.dataset.interactionsSetup) return;
        element.dataset.interactionsSetup = 'true';
        
        element.addEventListener('mouseenter', () => {
            element.classList.add('hover-active', 'force-visible');
            
            // Ensure all child elements are visible
            const children = element.querySelectorAll('*');
            children.forEach(child => child.classList.add('force-visible'));
        }, { passive: true });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('hover-active');
        }, { passive: true });
    }

    /**
     * Setup carousel for journey section
     */
    setupSectionCarousel(section) {
        if (!this.options.enableCarousel) return;
        
        const carousel = section.querySelector('.journey-carousel');
        if (!carousel) return;
        
        const carouselInstance = new JourneyCarousel(carousel, {
            app: this.app,
            autoScroll: this.options.autoScroll,
            autoScrollDelay: this.options.autoScrollDelay
        });
        
        this.carouselInstances.set(section, carouselInstance);
    }

    /**
     * Setup animations for journey section
     */
    setupSectionAnimations(section) {
        if (!this.options.enableAnimations) return;
        
        // Setup reveal animations
        const items = section.querySelectorAll('.journey-item, .journey-card');
        items.forEach((item, index) => {
            item.style.setProperty('--animation-delay', `${index * 200}ms`);
            
            // Use intersection observer for performance
            this.observeForAnimation(item);
        });
    }

    /**
     * Observe element for animation
     */
    observeForAnimation(element) {
        if (!this.animationObserver) {
            this.animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        this.animationObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '50px' });
        }
        
        this.animationObserver.observe(element);
    }

    /**
     * Setup main intersection observer
     */
    setupIntersectionObserver() {
        this.mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                const isVisible = entry.isIntersecting;
                
                if (isVisible !== this.isVisible) {
                    this.isVisible = isVisible;
                    this.handleVisibilityChange(isVisible, section);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all journey sections
        this.journeySections.forEach(section => {
            this.mainObserver.observe(section);
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Throttled scroll listener
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Debounced resize listener
        window.addEventListener('resize', this.handleResize, { passive: true });
        
        // Theme change listener
        document.addEventListener('theme:changed', this.handleThemeChange);
        
        // Visibility change for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    /**
     * Handle scroll events
     */
    onScroll() {
        if (!this.isVisible) return;
        
        const now = performance.now();
        if (now - this.lastUpdate < this.updateThreshold) return;
        
        this.lastUpdate = now;
        
        // Update journey sections that are visible
        this.journeySections.forEach(section => {
            if (this.isElementInViewport(section)) {
                this.updateSectionOnScroll(section);
            }
        });
    }

    /**
     * Handle resize events
     */
    onResize() {
        // Update carousel layouts
        this.carouselInstances.forEach(carousel => {
            if (carousel.updateLayout) {
                carousel.updateLayout();
            }
        });
        
        // Refresh visibility fixes
        this.journeySections.forEach(section => {
            this.setupSectionVisibility(section);
        });
    }

    /**
     * Handle visibility changes
     */
    handleVisibilityChange(isVisible, section) {
        if (isVisible) {
            // Section became visible
            this.setupSectionVisibility(section);
            
            // Start carousel auto-scroll if enabled
            const carousel = this.carouselInstances.get(section);
            if (carousel && carousel.startAutoScroll) {
                carousel.startAutoScroll();
            }
        } else {
            // Section became hidden - pause expensive operations
            const carousel = this.carouselInstances.get(section);
            if (carousel && carousel.stopAutoScroll) {
                carousel.stopAutoScroll();
            }
        }
    }

    /**
     * Handle theme changes
     */
    handleThemeChange(event) {
        // Re-apply visibility fixes after theme change
        this.journeySections.forEach(section => {
            this.app.batchDOM([
                () => this.setupSectionVisibility(section)
            ]);
        });
    }

    /**
     * Update section on scroll
     */
    updateSectionOnScroll(section) {
        // Apply any scroll-based updates
        const carousel = this.carouselInstances.get(section);
        if (carousel && carousel.updateOnScroll) {
            carousel.updateOnScroll();
        }
    }

    /**
     * Check if element is in viewport
     */
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight &&
            rect.bottom >= 0 &&
            rect.top <= windowHeight
        );
    }

    /**
     * Pause animations for performance
     */
    pauseAnimations() {
        this.journeySections.forEach(section => {
            section.style.animationPlayState = 'paused';
        });
    }

    /**
     * Resume animations
     */
    resumeAnimations() {
        this.journeySections.forEach(section => {
            section.style.animationPlayState = 'running';
        });
    }

    /**
     * Force visibility update (public method)
     */
    forceVisibilityUpdate() {
        this.journeySections.forEach(section => {
            this.setupSectionVisibility(section);
        });
    }

    /**
     * Add journey section dynamically
     */
    addJourneySection(element) {
        this.registerJourneySection(element);
        if (this.mainObserver) {
            this.mainObserver.observe(element);
        }
    }

    /**
     * Get carousel instance for section
     */
    getCarousel(section) {
        return this.carouselInstances.get(section);
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        // Disconnect observers
        if (this.mainObserver) {
            this.mainObserver.disconnect();
        }
        
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        // Destroy carousels
        this.carouselInstances.forEach(carousel => {
            if (carousel.destroy) {
                carousel.destroy();
            }
        });
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('theme:changed', this.handleThemeChange);
        
        // Clear collections
        this.journeySections.clear();
        this.carouselInstances.clear();
        
        this.isInitialized = false;
    }
}

/**
 * Journey Carousel Component
 * Handles carousel functionality for journey sections
 */
class JourneyCarousel {
    constructor(element, options = {}) {
        this.element = element;
        this.app = options.app;
        this.options = {
            autoScroll: false,
            autoScrollDelay: 5000,
            enableTouch: true,
            enableKeyboard: true,
            ...options
        };
        
        this.currentIndex = 0;
        this.isScrolling = false;
        this.autoScrollInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.updateLayout();
        
        if (this.options.autoScroll) {
            this.startAutoScroll();
        }
    }

    setupElements() {
        this.cards = Array.from(this.element.querySelectorAll('.journey-card'));
        this.prevButton = this.element.parentElement?.querySelector('.carousel-prev');
        this.nextButton = this.element.parentElement?.querySelector('.carousel-next');
        this.indicators = this.element.parentElement?.querySelector('.carousel-indicators');
        
        // Create indicators if they don't exist
        if (!this.indicators && this.cards.length > 1) {
            this.createIndicators();
        }
    }

    createIndicators() {
        const container = this.element.parentElement;
        if (!container) return;
        
        this.indicators = document.createElement('div');
        this.indicators.className = 'carousel-indicators';
        
        this.cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.scrollToCard(index));
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            this.indicators.appendChild(dot);
        });
        
        container.appendChild(this.indicators);
    }

    setupEventListeners() {
        // Button controls
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.previous());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.next());
        }
        
        // Touch support
        if (this.options.enableTouch) {
            this.element.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            this.element.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe();
            }, { passive: true });
        }
        
        // Keyboard support
        if (this.options.enableKeyboard) {
            this.element.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.previous();
                if (e.key === 'ArrowRight') this.next();
            });
        }
        
        // Scroll tracking
        this.element.addEventListener('scroll', this.app.throttle(() => {
            this.updateActiveIndicator();
        }, 50), { passive: true });
        
        // Pause auto-scroll on hover
        this.element.addEventListener('mouseenter', () => this.stopAutoScroll());
        this.element.addEventListener('mouseleave', () => {
            if (this.options.autoScroll) this.startAutoScroll();
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.previous();
            }
        }
    }

    scrollToCard(index, smooth = true) {
        if (this.isScrolling || index === this.currentIndex) return;
        
        this.isScrolling = true;
        this.currentIndex = Math.max(0, Math.min(index, this.cards.length - 1));
        
        const card = this.cards[this.currentIndex];
        if (!card) return;
        
        card.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'nearest',
            inline: 'start'
        });
        
        setTimeout(() => {
            this.isScrolling = false;
            this.updateActiveIndicator();
        }, smooth ? 600 : 100);
    }

    previous() {
        this.scrollToCard(this.currentIndex - 1);
    }

    next() {
        this.scrollToCard(this.currentIndex + 1);
    }

    updateActiveIndicator() {
        if (!this.indicators) return;
        
        const dots = this.indicators.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update button states
        if (this.prevButton) {
            this.prevButton.disabled = this.currentIndex <= 0;
        }
        
        if (this.nextButton) {
            this.nextButton.disabled = this.currentIndex >= this.cards.length - 1;
        }
    }

    startAutoScroll() {
        this.stopAutoScroll();
        
        if (this.cards.length <= 1) return;
        
        this.autoScrollInterval = setInterval(() => {
            const nextIndex = (this.currentIndex + 1) % this.cards.length;
            this.scrollToCard(nextIndex);
        }, this.options.autoScrollDelay);
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    updateLayout() {
        // Force card dimensions
        this.cards.forEach(card => {
            card.style.minWidth = 'calc(40% - 20px)';
            card.style.flex = '0 0 calc(40% - 20px)';
        });
        
        this.updateActiveIndicator();
    }

    destroy() {
        this.stopAutoScroll();
        
        // Remove event listeners would be handled by the element removal
        // This is a lightweight cleanup
    }
}

// Export for use with app manager
if (typeof window !== 'undefined') {
    window.OptimizedJourneyManager = OptimizedJourneyManager;
    window.JourneyCarousel = JourneyCarousel;
} 