/**
 * Optimized Journey Manager
 * Replaces 200+ lines of inline JavaScript with efficient, modern approach
 * Eliminates multiple timeouts and improves performance
 */

class OptimizedJourneyManager {
    constructor() {
        this.isInitialized = false;
        this.isVisible = false;
        this.observer = null;
        this.resizeObserver = null;
        this.elements = {
            section: null,
            items: [],
            tags: [],
            markers: [],
            timeline: null
        };
        
        // Throttled functions
        this.handleResize = this.throttle(this.handleResize.bind(this), 250);
        this.handleScroll = this.throttle(this.handleScroll.bind(this), 100);
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.cacheElements();
        this.setupIntersectionObserver();
        this.setupResizeObserver();
        this.setupEventListeners();
        this.ensureInitialVisibility();
        
        this.isInitialized = true;
        
        // Emit ready event
        this.emit('journeyManagerReady');
    }
    
    cacheElements() {
        this.elements.section = document.getElementById('journey');
        
        if (!this.elements.section) {
            console.warn('Journey section not found');
            return;
        }
        
        // Cache all journey elements
        this.elements.items = Array.from(this.elements.section.querySelectorAll('.journey-item'));
        this.elements.tags = Array.from(this.elements.section.querySelectorAll('.journey-tag'));
        this.elements.markers = Array.from(this.elements.section.querySelectorAll('.journey-marker'));
        this.elements.timeline = this.elements.section.querySelector('.timeline-line');
        
        // Create timeline if it doesn't exist
        if (!this.elements.timeline) {
            this.createTimeline();
        }
    }
    
    createTimeline() {
        const timeline = document.createElement('div');
        timeline.className = 'timeline-line';
        timeline.style.cssText = `
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 4px;
            height: 100%;
            background: var(--border-color);
            z-index: 1;
            opacity: 0.3;
        `;
        
        const journeyContent = this.elements.section.querySelector('.journey-content, .container');
        if (journeyContent) {
            journeyContent.style.position = 'relative';
            journeyContent.appendChild(timeline);
            this.elements.timeline = timeline;
        }
    }
    
    setupIntersectionObserver() {
        if (!this.elements.section) return;
        
        // Observer for section visibility
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isVisible) {
                    this.makeVisible();
                    this.isVisible = true;
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        this.observer.observe(this.elements.section);
        
        // Observer for individual items (staggered animation)
        this.itemObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateItem(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '20px'
        });
        
        this.elements.items.forEach(item => {
            this.itemObserver.observe(item);
        });
    }
    
    setupResizeObserver() {
        if (!window.ResizeObserver) return;
        
        this.resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });
        
        if (this.elements.section) {
            this.resizeObserver.observe(this.elements.section);
        }
    }
    
    setupEventListeners() {
        // Theme change listener
        document.addEventListener('themeChanged', () => {
            this.updateThemeStyles();
        });
        
        // Window resize (fallback)
        window.addEventListener('resize', this.handleResize);
        
        // Scroll listener for performance monitoring
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }
    
    ensureInitialVisibility() {
        // Force visibility immediately for critical elements
        this.makeVisible();
        
        // Double-check after a short delay
        setTimeout(() => {
            if (!this.isVisible) {
                this.makeVisible();
            }
        }, 100);
    }
    
    makeVisible() {
        if (!this.elements.section) return;
        
        // Apply visibility classes
        this.elements.section.classList.add('journey-visible', 'force-visible');
        
        // Ensure section is visible
        this.applyVisibilityStyles(this.elements.section, 'block');
        
        // Make all items visible
        this.elements.items.forEach((item, index) => {
            this.applyVisibilityStyles(item, 'flex');
            item.classList.add('journey-visible');
            
            // Staggered animation
            setTimeout(() => {
                item.classList.add('fade-in', 'visible');
            }, index * 100);
        });
        
        // Make tags visible
        this.elements.tags.forEach(tag => {
            this.applyVisibilityStyles(tag, 'inline-block');
            tag.classList.add('journey-visible');
        });
        
        // Make markers visible
        this.elements.markers.forEach(marker => {
            this.applyVisibilityStyles(marker, 'block');
            marker.classList.add('journey-visible');
        });
        
        // Update timeline
        this.updateTimeline();
        
        // Apply responsive styles
        this.applyResponsiveStyles();
    }
    
    applyVisibilityStyles(element, displayType = 'block') {
        if (!element) return;
        
        // Remove hiding styles
        element.style.removeProperty('display');
        element.style.removeProperty('visibility');
        element.style.removeProperty('opacity');
        
        // Apply visibility
        element.style.display = displayType;
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        
        // Ensure z-index
        const zIndex = parseInt(window.getComputedStyle(element).zIndex);
        if (isNaN(zIndex) || zIndex < 1) {
            element.style.zIndex = '5';
        }
    }
    
    animateItem(item) {
        if (!item || item.classList.contains('animated')) return;
        
        item.classList.add('animated', 'fade-in', 'visible');
        
        // Animate child elements
        const content = item.querySelector('.journey-content');
        const marker = item.querySelector('.journey-marker');
        
        if (content) {
            setTimeout(() => {
                content.classList.add('slide-in-left', 'visible');
            }, 100);
        }
        
        if (marker) {
            setTimeout(() => {
                marker.classList.add('scale-in', 'visible');
            }, 200);
        }
    }
    
    updateTimeline() {
        if (!this.elements.timeline) return;
        
        const theme = document.documentElement.getAttribute('data-theme');
        const timelineColor = theme === 'light' 
            ? 'rgba(58, 86, 228, 0.2)' 
            : 'rgba(108, 138, 255, 0.2)';
        
        this.elements.timeline.style.background = timelineColor;
        this.elements.timeline.style.opacity = '1';
    }
    
    updateThemeStyles() {
        this.updateTimeline();
        
        // Update any theme-dependent styles
        this.elements.items.forEach(item => {
            const theme = document.documentElement.getAttribute('data-theme');
            item.setAttribute('data-theme', theme);
        });
    }
    
    applyResponsiveStyles() {
        const isMobile = window.innerWidth <= 992;
        
        if (isMobile) {
            this.applyMobileStyles();
        } else {
            this.applyDesktopStyles();
        }
    }
    
    applyMobileStyles() {
        // Timeline positioning for mobile
        if (this.elements.timeline) {
            this.elements.timeline.style.left = '15px';
            this.elements.timeline.style.transform = 'none';
        }
        
        // Journey items positioning
        this.elements.items.forEach(item => {
            item.style.justifyContent = 'flex-start';
            item.style.marginLeft = '30px';
            
            const content = item.querySelector('.journey-content');
            if (content) {
                content.style.width = '80%';
            }
        });
        
        // Markers positioning
        this.elements.markers.forEach(marker => {
            marker.style.left = '-25px';
            marker.style.right = 'auto';
        });
    }
    
    applyDesktopStyles() {
        // Reset mobile styles
        if (this.elements.timeline) {
            this.elements.timeline.style.left = '50%';
            this.elements.timeline.style.transform = 'translateX(-50%)';
        }
        
        this.elements.items.forEach(item => {
            item.style.removeProperty('justify-content');
            item.style.removeProperty('margin-left');
            
            const content = item.querySelector('.journey-content');
            if (content) {
                content.style.removeProperty('width');
            }
        });
        
        this.elements.markers.forEach(marker => {
            marker.style.removeProperty('left');
            marker.style.removeProperty('right');
        });
    }
    
    handleResize() {
        if (!this.isVisible) return;
        
        this.applyResponsiveStyles();
        this.updateTimeline();
    }
    
    handleScroll() {
        // Performance monitoring - only update if section is visible
        if (!this.elements.section) return;
        
        const rect = this.elements.section.getBoundingClientRect();
        const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
        
        if (isInViewport && !this.isVisible) {
            this.makeVisible();
        }
    }
    
    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    emit(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: { ...data, manager: this },
            bubbles: true
        });
        document.dispatchEvent(event);
    }
    
    // Public API
    refresh() {
        this.cacheElements();
        this.makeVisible();
    }
    
    destroy() {
        // Cleanup observers
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.itemObserver) {
            this.itemObserver.disconnect();
        }
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
        
        this.isInitialized = false;
        this.isVisible = false;
    }
}

// Create global instance
const journeyManager = new OptimizedJourneyManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OptimizedJourneyManager;
}

// Global access
window.journeyManager = journeyManager; 