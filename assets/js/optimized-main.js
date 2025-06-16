/**
 * Optimized Portfolio Main Script
 * Uses the new app manager and optimized components
 * Replaces the functionality from main.js with better performance
 */

// Import dependencies (these will be loaded via script tags in production)
/* global PortfolioApp, portfolioApp */

(function() {
    'use strict';
    
    /**
     * Legacy compatibility layer
     * Provides the same functionality as the old main.js for existing code
     */
    const LegacyCompatibility = {
        init() {
            // Expose legacy functions for backward compatibility
            window.initNavigation = this.initNavigation.bind(this);
            window.initTheme = this.initTheme.bind(this);
            window.initScrollAnimations = this.initScrollAnimations.bind(this);
            window.initSpaceTheme = this.initSpaceTheme.bind(this);
            window.initSocialSidebar = this.initSocialSidebar.bind(this);
            window.initPortfolio = this.initPortfolio.bind(this);
        },
        
        initNavigation() {
            // Navigation is now handled by OptimizedNavigationManager
            const navManager = portfolioApp.getModule('navigation');
            if (navManager) {
                console.debug('Navigation handled by optimized manager');
            }
        },
        
        initTheme() {
            // Theme is now handled by OptimizedThemeManager
            const themeManager = portfolioApp.getModule('theme');
            if (themeManager) {
                console.debug('Theme handled by optimized manager');
            }
        },
        
        initScrollAnimations() {
            // Scroll animations now handled by optimized components
            this.setupScrollReveal();
            this.setupBackToTop();
        },
        
        setupScrollReveal() {
            // Enhanced ScrollReveal setup
            if (typeof ScrollReveal === 'function') {
                const sr = ScrollReveal({
                    origin: 'bottom',
                    distance: '20px',
                    duration: 800,
                    delay: 200,
                    easing: 'cubic-bezier(0.5, 0, 0, 1)',
                    mobile: true,
                    reset: false // Disable reset for better performance
                });
                
                // Reveal elements with performance optimization
                portfolioApp.lazy(() => {
                    sr.reveal('.hero-content', { interval: 100 });
                    sr.reveal('.portfolio-item', { interval: 50 });
                    sr.reveal('.section-title', { distance: '30px' });
                }, 'idle');
            }
        },
        
        setupBackToTop() {
            // Back to top is now handled by navigation manager
            const navManager = portfolioApp.getModule('navigation');
            if (navManager) {
                console.debug('Back to top handled by navigation manager');
            }
        },
        
        initSpaceTheme() {
            // Space theme effects
            this.setupHeroParallax();
            this.setupShootingStars();
        },
        
        setupHeroParallax() {
            const heroSection = portfolioApp.$1('.hero-section');
            const heroContainer = portfolioApp.$1('.hero-container');
            
            if (!heroSection || !heroContainer) return;
            
            // Throttled parallax effect
            const handleMouseMove = portfolioApp.throttle((e) => {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
                
                heroContainer.style.transform = 
                    `translateZ(50px) rotateY(${xAxis/2}deg) rotateX(${yAxis/2}deg)`;
            }, 16);
            
            heroSection.addEventListener('mousemove', handleMouseMove, { passive: true });
            
            heroSection.addEventListener('mouseleave', () => {
                heroContainer.style.transform = 
                    'translateZ(50px) rotateY(0deg) rotateX(0deg)';
            }, { passive: true });
        },
        
        setupShootingStars() {
            const heroSection = portfolioApp.$1('.hero-section');
            if (!heroSection) return;
            
            // Lazy load shooting stars for better performance
            portfolioApp.lazy(() => {
                const createStar = () => {
                    if (document.hidden) return; // Don't create stars when tab is hidden
                    
                    const star = document.createElement('div');
                    star.className = 'shooting-star';
                    
                    // Random position and angle
                    const startX = Math.random() * window.innerWidth;
                    const startY = Math.random() * (window.innerHeight / 2);
                    const angle = Math.random() * 45 - 45;
                    
                    star.style.cssText = `
                        top: ${startY}px;
                        left: ${startX}px;
                        transform: rotate(${angle}deg);
                    `;
                    
                    heroSection.appendChild(star);
                    
                    // Remove star after animation with cleanup
                    setTimeout(() => {
                        if (star.parentNode) {
                            star.remove();
                        }
                    }, 3000);
                };
                
                // Create stars with interval
                const starInterval = setInterval(createStar, 2000);
                
                // Cleanup when section is not visible
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            clearInterval(starInterval);
                            observer.disconnect();
                        }
                    });
                });
                
                observer.observe(heroSection);
            }, 'scroll');
        },
        
        initSocialSidebar() {
            // Social sidebar functionality
            this.setupSocialSidebar();
        },
        
        setupSocialSidebar() {
            const heroSocialLinks = portfolioApp.$1('.hero-social-links');
            const socialSidebar = portfolioApp.$1('.social-sidebar');
            
            if (!heroSocialLinks || !socialSidebar) return;
            
            // Clone social links to sidebar efficiently
            portfolioApp.batchDOM([() => {
                const links = heroSocialLinks.querySelectorAll('.hero-social-link');
                links.forEach(link => {
                    const clonedLink = link.cloneNode(true);
                    clonedLink.classList.remove('hero-social-link');
                    socialSidebar.appendChild(clonedLink);
                });
            }]);
            
            // Optimized scroll handler for sidebar visibility
            const updateSidebarVisibility = portfolioApp.throttle(() => {
                const heroRect = heroSocialLinks.getBoundingClientRect();
                const shouldShow = window.scrollY > (heroRect.bottom + window.scrollY);
                socialSidebar.classList.toggle('visible', shouldShow);
            }, 100);
            
            window.addEventListener('scroll', updateSidebarVisibility, { passive: true });
        },
        
        initPortfolio() {
            // Portfolio filtering functionality
            this.setupPortfolioFiltering();
        },
        
        setupPortfolioFiltering() {
            const navButtons = portfolioApp.$('.portfolio-nav-button');
            const tabs = portfolioApp.$('.portfolio-tab');
            const items = portfolioApp.$('.portfolio-item');
            
            if (!navButtons.length) return;
            
            // Filter function with performance optimization
            const filterItems = (category) => {
                portfolioApp.batchDOM([
                    () => {
                        // Update navigation buttons
                        navButtons.forEach(btn => {
                            btn.classList.toggle('active', btn.dataset.category === category);
                        });
                        
                        // Update tabs
                        tabs.forEach(tab => {
                            tab.classList.toggle('active', tab.id === `${category}-tab`);
                        });
                        
                        // Filter items
                        items.forEach(item => {
                            const shouldShow = category === 'all' || 
                                             item.classList.contains(`category-${category}`);
                            item.style.display = shouldShow ? 'block' : 'none';
                        });
                    }
                ]);
                
                // Trigger animations for visible items
                setTimeout(() => {
                    const visibleItems = Array.from(items).filter(item => 
                        item.style.display !== 'none');
                    visibleItems.forEach((item, index) => {
                        item.style.animationDelay = `${index * 100}ms`;
                        item.classList.add('fade-in-up');
                    });
                }, 50);
            };
            
            // Setup event listeners with delegation
            portfolioApp.on('.portfolio-nav-button', 'click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                if (category) {
                    filterItems(category);
                }
            });
            
            // Initialize with 'all' category
            filterItems('all');
        }
    };
    
    /**
     * Enhanced features that extend the original functionality
     */
    const EnhancedFeatures = {
        init() {
            this.setupPerformanceMonitoring();
            this.setupErrorHandling();
            this.setupAccessibilityEnhancements();
            this.setupPreloadOptimizations();
        },
        
        setupPerformanceMonitoring() {
            // Monitor Core Web Vitals
            if ('web-vital' in window) {
                const vitals = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB'];
                vitals.forEach(vital => {
                    try {
                        // This would integrate with web-vitals library if available
                        console.debug(`Monitoring ${vital}`);
                    } catch (error) {
                        console.warn(`Could not monitor ${vital}:`, error);
                    }
                });
            }
        },
        
        setupErrorHandling() {
            // Enhanced error handling
            window.addEventListener('error', (event) => {
                console.error('Script error:', {
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: event.error?.stack
                });
            });
            
            window.addEventListener('unhandledrejection', (event) => {
                console.error('Unhandled promise rejection:', event.reason);
            });
        },
        
        setupAccessibilityEnhancements() {
            // Focus management
            this.setupFocusManagement();
            
            // Keyboard navigation
            this.setupKeyboardNavigation();
            
            // Screen reader announcements
            this.setupScreenReaderSupport();
        },
        
        setupFocusManagement() {
            // Focus trap for modals
            portfolioApp.on('[data-modal]', 'click', (e) => {
                const modal = document.getElementById(e.target.dataset.modal);
                if (modal) {
                    this.trapFocus(modal);
                }
            });
        },
        
        trapFocus(element) {
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
            
            firstElement.focus();
        },
        
        setupKeyboardNavigation() {
            // Enhanced keyboard navigation for custom components
            portfolioApp.on('[role="button"]', 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.target.click();
                }
            });
        },
        
        setupScreenReaderSupport() {
            // Create announcement region
            if (!document.getElementById('sr-announcements')) {
                const announcements = document.createElement('div');
                announcements.id = 'sr-announcements';
                announcements.setAttribute('aria-live', 'polite');
                announcements.setAttribute('aria-atomic', 'true');
                announcements.style.cssText = `
                    position: absolute;
                    left: -10000px;
                    width: 1px;
                    height: 1px;
                    overflow: hidden;
                `;
                document.body.appendChild(announcements);
            }
        },
        
        announce(message) {
            const announcements = document.getElementById('sr-announcements');
            if (announcements) {
                announcements.textContent = message;
            }
        },
        
        setupPreloadOptimizations() {
            // Preload critical resources
            this.preloadCriticalImages();
            this.preloadFonts();
        },
        
        preloadCriticalImages() {
            const criticalImages = [
                '/assets/images/hero-bg.jpg',
                '/assets/Logo/logo.png'
            ];
            
            criticalImages.forEach(src => {
                if (document.querySelector(`img[src="${src}"]`)) return;
                
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        },
        
        preloadFonts() {
            const fonts = [
                '/assets/fonts/primary-font.woff2',
                '/assets/fonts/secondary-font.woff2'
            ];
            
            fonts.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'font';
                link.type = 'font/woff2';
                link.href = src;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            });
        }
    };
    
    /**
     * Initialize everything when the app is ready
     */
    function initializeOptimizedPortfolio() {
        // Wait for the app manager to be ready
        if (typeof portfolioApp === 'undefined') {
            setTimeout(initializeOptimizedPortfolio, 100);
            return;
        }
        
        // Listen for app ready event
        document.addEventListener('app:ready', (event) => {
            console.debug('Portfolio App ready, initializing enhanced features...');
            
            // Initialize legacy compatibility
            LegacyCompatibility.init();
            
            // Initialize enhanced features
            EnhancedFeatures.init();
            
            // Call legacy initialization functions for backward compatibility
            if (typeof initNavigation === 'function') initNavigation();
            if (typeof initTheme === 'function') initTheme();
            if (typeof initScrollAnimations === 'function') initScrollAnimations();
            if (typeof initSpaceTheme === 'function') initSpaceTheme();
            if (typeof initSocialSidebar === 'function') initSocialSidebar();
            if (typeof initPortfolio === 'function') initPortfolio();
            
            console.debug('Optimized portfolio initialization complete');
        });
        
        // If app is already ready, initialize immediately
        if (portfolioApp.isInitialized) {
            document.dispatchEvent(new CustomEvent('app:ready', {
                detail: { app: portfolioApp }
            }));
        }
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOptimizedPortfolio);
    } else {
        initializeOptimizedPortfolio();
    }
    
    // Export for use in other scripts
    if (typeof window !== 'undefined') {
        window.LegacyCompatibility = LegacyCompatibility;
        window.EnhancedFeatures = EnhancedFeatures;
    }
})(); 