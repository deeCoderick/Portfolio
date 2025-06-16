/**
 * OPTIMIZED journey visibility fix - v2.0
 * More efficient implementation with reduced DOM operations and better performance
 * Added cross-browser compatibility and scroll synchronization
 */

(function() {
    // Throttling mechanism
    let isProcessing = false;
    let fixInterval = null;
    let documentReady = false;
    let processingTimeout = null;
    
    // Run once on load, but throttle subsequent calls
    function throttledFix() {
        if (isProcessing) return;
        isProcessing = true;
        
        // Use requestAnimationFrame for better performance
        cancelAnimationFrame(processingTimeout);
        processingTimeout = requestAnimationFrame(() => {
            forceJourneyItemsVisible();
            setTimeout(() => { isProcessing = false; }, 150);
        });
    }
    
    // Main function with optimized DOM operations
    function forceJourneyItemsVisible() {
        // Get both ID and class journey sections (for cross-page compatibility)
        const journeySections = document.querySelectorAll('#journey, .journey-section');
        if (!journeySections.length) return;
        
        // Process each journey section
        journeySections.forEach(section => {
            // Apply visibility class
            section.classList.add('force-visible');
            
            // Target elements with a more comprehensive selector
            const problematicElements = section.querySelectorAll(
                '.journey-item, .journey-content, .journey-date, .journey-marker, ' +
                '.journey-timeline, .journey-tags, .journey-tag, .timeline-line'
            );
            
            problematicElements.forEach(element => {
                // Only apply styles if necessary to minimize repaints
                if (isHidden(element)) {
                    element.classList.add('force-visible');
                }
                
                // Remove any hidden inline styles
                if (element.style.display === 'none') {
                    element.style.removeProperty('display');
                }
                if (element.style.visibility === 'hidden') {
                    element.style.removeProperty('visibility');
                }
                if (element.style.opacity === '0') {
                    element.style.removeProperty('opacity');
                }
            });
            
            // Special handling for content elements
            const contentElements = section.querySelectorAll('.journey-content');
            contentElements.forEach(content => {
                // Ensure hover states work correctly
                content.classList.add('hover-enabled');
                
                // Add event listeners only once using a marker class
                if (!content.classList.contains('listeners-added')) {
                    content.classList.add('listeners-added');
                    
                    // Force visibility during hover interactions
                    content.addEventListener('mouseenter', () => {
                        content.classList.add('hover-active', 'force-visible');
                        
                        // Also make all child elements visible
                        content.querySelectorAll('*').forEach(child => {
                            child.classList.add('force-visible');
                        });
                    });
                    
                    content.addEventListener('mouseleave', () => {
                        content.classList.remove('hover-active');
                        // Keep the force-visible class
                    });
                }
            });
        });
    }
    
    // Helper function to check if an element is hidden
    function isHidden(element) {
        if (!element) return true;
        
        // First check inline styles
        if (element.style.display === 'none' || 
            element.style.visibility === 'hidden' || 
            element.style.opacity === '0') {
            return true;
        }
        
        // Then check computed styles
        const style = window.getComputedStyle(element);
        return style.display === 'none' || 
               style.visibility === 'hidden' || 
               parseFloat(style.opacity) === 0 ||
               element.classList.contains('sr-only');
    }
    
    // Override ScrollReveal to prevent it from hiding journey items
    function handleScrollReveal() {
        if (typeof ScrollReveal !== 'undefined') {
            try {
                const sr = ScrollReveal();
                
                // Store original method
                const originalReveal = sr.reveal;
                
                // Override with safer version
                sr.reveal = function(target, config) {
                    // Check if target contains journey-related elements
                    if (typeof target === 'string' && 
                        (target.includes('journey') || 
                         target === '.journey-item' || 
                         target === '.journey-content')) {
                        
                        // Create safe config that ensures visibility
                        const safeConfig = Object.assign({}, config || {}, {
                            distance: '0px',
                            opacity: 1,
                            scale: 1,
                            easing: 'linear',
                            reset: false,
                            beforeReveal: function(el) {
                                el.classList.add('force-visible');
                                if (config && typeof config.beforeReveal === 'function') {
                                    config.beforeReveal(el);
                                }
                            },
                            afterReveal: function(el) {
                                el.classList.add('force-visible');
                                if (config && typeof config.afterReveal === 'function') {
                                    config.afterReveal(el);
                                }
                            }
                        });
                        
                        return originalReveal.call(this, target, safeConfig);
                    }
                    
                    // Use original behavior for non-journey elements
                    return originalReveal.apply(this, arguments);
                };
                
                // console.log("Successfully patched ScrollReveal for journey items");
            } catch (e) {
                console.warn("Could not patch ScrollReveal:", e);
            }
        }
    }
    
    // Setup efficient event listeners with browser compatibility
    function setupEventListeners() {
        // Only set up once
        if (fixInterval !== null) return;
        
        // Use a more reasonable interval
        fixInterval = setInterval(() => {
            if (documentReady) {
                throttledFix();
            }
        }, 1000);
        
        // Listen for theme changes
        document.addEventListener('themeChanged', throttledFix, { passive: true });
        
        // Set up optimized scroll listener
        window.addEventListener('scroll', () => {
            if (!documentReady) return;
            
            // Only check if any journey section is in viewport
            const journeySections = document.querySelectorAll('#journey, .journey-section');
            for (let i = 0; i < journeySections.length; i++) {
                if (isElementInViewport(journeySections[i])) {
                    throttledFix();
                    break;
                }
            }
        }, { passive: true });
        
        // Handle resize events for responsive layouts
        window.addEventListener('resize', throttledFix, { passive: true });
        
        // Pause execution when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && fixInterval) {
                clearInterval(fixInterval);
                fixInterval = null;
            } else if (!document.hidden && !fixInterval) {
                setupEventListeners(); // Restart interval
            }
        });
    }
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Check if element is at least partially visible
        return (
            rect.top <= windowHeight &&
            rect.bottom >= 0
        );
    }
    
    // Initialize with better browser compatibility
    function init() {
        documentReady = true;
        
        // Run immediately
        forceJourneyItemsVisible();
        
        // Set up event listeners
        setupEventListeners();
        
        // Handle ScrollReveal
        handleScrollReveal();
        
        // Set up observers
        setupOptimizedObserver();
        
        // Additional checks for delayed elements
        setTimeout(forceJourneyItemsVisible, 1000);
        setTimeout(forceJourneyItemsVisible, 3000);
    }
    
    // Set up MutationObserver with performance optimizations
    function setupOptimizedObserver() {
        // Use querySelectorAll to catch all journey sections
        const journeySections = document.querySelectorAll('#journey, .journey-section');
        if (!journeySections.length) return;
        
        // Create a single observer for all sections
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;
            
            // Quick-check mutations
            for (let i = 0; i < mutations.length && !needsUpdate; i++) {
                const mutation = mutations[i];
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || 
                     mutation.attributeName === 'class')) {
                    needsUpdate = true;
                }
            }
            
            if (needsUpdate) {
                throttledFix();
            }
        });
        
        // Observe each journey section
        journeySections.forEach(section => {
            observer.observe(section, {
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        });
    }
    
    // Add CSS rules programmatically with browser prefixes
    function addOptimizedStyles() {
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            /* Global visibility classes */
            .force-visible {
                visibility: visible !important;
                opacity: 1 !important;
                display: block !important;
                transform: none !important;
            }
            
            /* Element-specific overrides */
            .journey-item.force-visible {
                display: flex !important;
            }
            .journey-tags.force-visible {
                display: flex !important;
            }
            .journey-tag.force-visible {
                display: inline-block !important;
            }
            
            /* Performance optimizations */
            #journey, .journey-section, .journey-timeline, .journey-item {
                will-change: transform;
                -webkit-transform: translateZ(0);
                -moz-transform: translateZ(0);
                -ms-transform: translateZ(0);
                transform: translateZ(0);
                -webkit-backface-visibility: hidden;
                -moz-backface-visibility: hidden;
                backface-visibility: hidden;
            }
            
            /* Prevent repaints */
            .journey-content, .journey-marker, .journey-date {
                contain: content;
            }
            
            /* Enhanced hover state */
            .journey-content.hover-enabled:hover {
                z-index: 10 !important;
            }
            
            .journey-content.hover-active {
                z-index: 10 !important;
                opacity: 1 !important;
                visibility: visible !important;
            }
            
            /* Ensure all journey sections are visible */
            #journey, .journey-section {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(styleEl);
    }
    
    // Handle browsers that don't support advanced features
    function setupFallbackSupport() {
        // Check for older browsers and add simple polyfills
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback) {
                return setTimeout(callback, 16);
            };
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
        
        // Force styles immediately for old browsers
        const journeySections = document.querySelectorAll('#journey, .journey-section');
        journeySections.forEach(section => {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
        });
    }
    
    // Run the entire initialization
    setupFallbackSupport();
    addOptimizedStyles();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already loaded
        init();
    }
    
    // Final failsafe for late-loading elements
    window.addEventListener('load', () => {
        documentReady = true;
        setTimeout(forceJourneyItemsVisible, 500);
    });
})(); 