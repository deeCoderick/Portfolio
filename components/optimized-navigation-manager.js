/**
 * Optimized Navigation Manager
 * Consolidates navigation functionality with performance improvements
 * Uses modern patterns and integrates with the app manager
 */

class OptimizedNavigationManager {
    constructor(app, options = {}) {
        this.app = app;
        this.options = {
            enableMobileMenu: true,
            enableSmoothScroll: true,
            enableBackToTop: true,
            closeOnOutsideClick: true,
            backToTopThreshold: 300,
            ...options
        };
        
        this.elements = {};
        this.isInitialized = false;
        this.isMobileMenuOpen = false;
        this.scrollPosition = 0;
        
        // Bind methods
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleScroll = this.app.throttle(this.onScroll.bind(this), 100);
        this.handleResize = this.app.debounce(this.onResize.bind(this), 250);
    }

    /**
     * Initialize navigation manager
     */
    async init() {
        if (this.isInitialized) return;
        
        // Cache navigation elements
        this.cacheElements();
        
        // Setup mobile menu if enabled
        if (this.options.enableMobileMenu) {
            this.setupMobileMenu();
        }
        
        // Setup smooth scrolling if enabled
        if (this.options.enableSmoothScroll) {
            this.setupSmoothScrolling();
        }
        
        // Setup back to top if enabled
        if (this.options.enableBackToTop) {
            this.setupBackToTop();
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.debug('Navigation Manager initialized');
    }

    /**
     * Cache navigation elements for performance
     */
    cacheElements() {
        this.elements = {
            nav: this.app.$1('nav, .navigation'),
            toggle: this.app.$1('.nav-toggle, .mobile-menu-toggle'),
            menu: this.app.$1('.nav-links, .nav-menu'),
            links: this.app.$('.nav-link, .navigation a[href^="#"]'),
            backToTop: this.app.$1('.back-to-top')
        };
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        const { toggle, menu } = this.elements;
        
        if (!toggle || !menu) return;
        
        // Add ARIA attributes
        toggle.setAttribute('aria-label', 'Toggle navigation menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', menu.id || 'nav-menu');
        
        // Add menu ID if not present
        if (!menu.id) {
            menu.id = 'nav-menu';
        }
        
        // Setup toggle using event delegation
        this.app.on('.nav-toggle, .mobile-menu-toggle', 'click', this.handleToggleClick);
        
        // Close menu on link click (mobile)
        this.app.on('.nav-link', 'click', () => {
            if (this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Handle mobile menu toggle
     */
    handleToggleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const { toggle, menu } = this.elements;
        
        this.isMobileMenuOpen = true;
        
        // Use batch DOM operations
        this.app.batchDOM([
            () => {
                menu.classList.add('active', 'open');
                toggle.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
            },
            () => {
                // Prevent body scroll on mobile
                if (window.innerWidth <= 768) {
                    document.body.style.overflow = 'hidden';
                }
            }
        ]);
        
        // Focus management
        const firstLink = menu.querySelector('.nav-link');
        if (firstLink) {
            firstLink.focus();
        }
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('nav:opened'));
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const { toggle, menu } = this.elements;
        
        this.isMobileMenuOpen = false;
        
        // Use batch DOM operations
        this.app.batchDOM([
            () => {
                menu.classList.remove('active', 'open');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            },
            () => {
                // Restore body scroll
                document.body.style.overflow = '';
            }
        ]);
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('nav:closed'));
    }

    /**
     * Setup smooth scrolling for navigation links
     */
    setupSmoothScrolling() {
        // Use event delegation for better performance
        this.app.on('a[href^="#"]', 'click', (e) => {
            const href = e.target.getAttribute('href');
            
            // Skip if it's a link to another page with hash
            if (href.includes('.html')) return;
            
            // Skip if it's just a hash
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                this.scrollToElement(target);
            }
        });
    }

    /**
     * Scroll to element smoothly
     */
    scrollToElement(element, offset = 0) {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const navHeight = this.elements.nav ? this.elements.nav.offsetHeight : 0;
        const targetPosition = elementTop - navHeight - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update URL without triggering scroll
        if (element.id) {
            history.replaceState(null, null, `#${element.id}`);
        }
    }

    /**
     * Setup back to top functionality
     */
    setupBackToTop() {
        const { backToTop } = this.elements;
        
        if (!backToTop) return;
        
        // Add ARIA attributes
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.setAttribute('role', 'button');
        backToTop.setAttribute('tabindex', '0');
        
        // Setup click handler
        this.app.on('.back-to-top', 'click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
        
        // Keyboard support
        backToTop.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToTop();
            }
        });
    }

    /**
     * Scroll to top of page
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Scroll listener for back to top and nav state
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Resize listener
        window.addEventListener('resize', this.handleResize, { passive: true });
        
        // Outside click to close mobile menu
        if (this.options.closeOnOutsideClick) {
            document.addEventListener('click', this.handleOutsideClick);
        }
        
        // ESC key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Handle scroll events
     */
    onScroll() {
        this.scrollPosition = window.pageYOffset;
        
        // Update back to top visibility
        this.updateBackToTopVisibility();
        
        // Update navigation state
        this.updateNavigationState();
    }

    /**
     * Update back to top button visibility
     */
    updateBackToTopVisibility() {
        const { backToTop } = this.elements;
        
        if (!backToTop) return;
        
        const shouldShow = this.scrollPosition > this.options.backToTopThreshold;
        backToTop.classList.toggle('visible', shouldShow);
    }

    /**
     * Update navigation state based on scroll
     */
    updateNavigationState() {
        const { nav } = this.elements;
        
        if (!nav) return;
        
        // Add scrolled class for styling
        nav.classList.toggle('scrolled', this.scrollPosition > 50);
        
        // Add scroll direction classes
        if (this.lastScrollPosition !== undefined) {
            const isScrollingDown = this.scrollPosition > this.lastScrollPosition;
            nav.classList.toggle('scroll-down', isScrollingDown);
            nav.classList.toggle('scroll-up', !isScrollingDown);
        }
        
        this.lastScrollPosition = this.scrollPosition;
    }

    /**
     * Handle resize events
     */
    onResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update element cache if needed
        this.cacheElements();
    }

    /**
     * Handle outside clicks
     */
    handleOutsideClick(e) {
        if (!this.isMobileMenuOpen) return;
        
        const { toggle, menu } = this.elements;
        
        // Check if click is outside navigation
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            this.closeMobileMenu();
        }
    }

    /**
     * Set active navigation item
     */
    setActiveItem(href) {
        const links = this.elements.links;
        
        links.forEach(link => {
            const isActive = link.getAttribute('href') === href;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    }

    /**
     * Add navigation item dynamically
     */
    addNavigationItem(text, href, position = 'end') {
        const { menu } = this.elements;
        
        if (!menu) return;
        
        const item = document.createElement('li');
        item.className = 'nav-item';
        
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = href;
        link.textContent = text;
        
        item.appendChild(link);
        
        if (position === 'start') {
            menu.insertBefore(item, menu.firstChild);
        } else {
            menu.appendChild(item);
        }
        
        // Update element cache
        this.cacheElements();
    }

    /**
     * Get current scroll position
     */
    getScrollPosition() {
        return this.scrollPosition;
    }

    /**
     * Check if mobile menu is open
     */
    isMobileMenuVisible() {
        return this.isMobileMenuOpen;
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('click', this.handleOutsideClick);
        
        // Close mobile menu if open
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Clear element cache
        this.elements = {};
        
        this.isInitialized = false;
    }
}

// Export for use with app manager
if (typeof window !== 'undefined') {
    window.OptimizedNavigationManager = OptimizedNavigationManager;
} 