/**
 * Optimized Journey Component
 * Replaces journey-fix.js and journey-smooth.js with better performance
 */

class OptimizedJourney {
    constructor() {
        this.isInitialized = false;
        this.visibilityCache = new Map();
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
        const journeySection = document.querySelector('#journey, .journey-section');
        if (!journeySection) return;

        this.journeySection = journeySection;
        this.isInitialized = true;

        // Use performance manager for optimized operations
        this.setupIntersectionObserver();
        this.setupThemeListener();
        this.ensureVisibility();
        
        // Use centralized interval management
        window.performanceManager?.setInterval(
            'journey-visibility-check',
            () => this.checkVisibility(),
            1000,
            { pauseWhenHidden: true }
        );
    }

    setupIntersectionObserver() {
        // Use the global performance manager's intersection observer
        window.performanceManager?.observeElement(
            this.journeySection,
            (isVisible) => this.handleVisibilityChange(isVisible)
        );

        // Observe individual journey items for animations
        const journeyItems = this.journeySection.querySelectorAll('.journey-item');
        journeyItems.forEach((item, index) => {
            window.performanceManager?.observeElement(item, (isVisible) => {
                if (isVisible) {
                    this.animateJourneyItem(item, index);
                }
            });
        });
    }

    setupThemeListener() {
        // Listen to centralized theme changes
        document.addEventListener('themeChanged', (e) => {
            this.updateThemeStyles(e.detail.theme);
        });
    }

    handleVisibilityChange(isVisible) {
        if (isVisible) {
            this.ensureVisibility();
            this.updateRocketPosition();
        }
    }

    ensureVisibility() {
        // Use CSS classes instead of inline styles for better performance
        this.journeySection.classList.add('journey-visible');
        
        // Only fix elements that are actually hidden
        const hiddenElements = this.journeySection.querySelectorAll(
            '.journey-item[style*="display: none"], ' +
            '.journey-content[style*="visibility: hidden"], ' +
            '.journey-marker[style*="opacity: 0"]'
        );

        if (hiddenElements.length > 0) {
            // Batch DOM operations for better performance
            window.performanceManager?.batchDOMOperations([
                () => hiddenElements.forEach(el => el.classList.add('force-visible'))
            ]);
        }
    }

    animateJourneyItem(item, index) {
        // Prevent re-animation
        if (item.classList.contains('animated')) return;
        
        item.classList.add('animated');
        
        // Stagger animations
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    }

    updateThemeStyles(theme) {
        // Use CSS custom properties for theme updates
        const timelineLine = this.journeySection.querySelector('.timeline-line');
        if (timelineLine) {
            timelineLine.classList.toggle('light-theme', theme === 'light');
            timelineLine.classList.toggle('dark-theme', theme === 'dark');
        }
    }

    updateRocketPosition() {
        const rocket = document.querySelector('.journey-rocket');
        if (!rocket) return;

        // Use RAF for smooth animations
        window.performanceManager?.addRAFCallback(() => {
            const rect = this.journeySection.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, 
                (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
            ));
            
            rocket.style.transform = `translateY(${progress * 100}px)`;
            rocket.classList.toggle('visible', rect.top < window.innerHeight && rect.bottom > 0);
        });
    }

    checkVisibility() {
        // Lightweight visibility check
        const rect = this.journeySection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !this.visibilityCache.get('journey-visible')) {
            this.ensureVisibility();
            this.visibilityCache.set('journey-visible', true);
        } else if (!isVisible) {
            this.visibilityCache.set('journey-visible', false);
        }
    }

    // Public API for manual control
    forceRefresh() {
        this.visibilityCache.clear();
        this.ensureVisibility();
    }

    destroy() {
        // Cleanup
        window.performanceManager?.clearInterval('journey-visibility-check');
        window.performanceManager?.unobserveElement(this.journeySection);
        
        const journeyItems = this.journeySection?.querySelectorAll('.journey-item');
        journeyItems?.forEach(item => {
            window.performanceManager?.unobserveElement(item);
        });
        
        this.isInitialized = false;
    }
}

// Auto-initialize if journey section exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#journey, .journey-section')) {
        window.optimizedJourney = new OptimizedJourney();
    }
});

// Export for manual initialization
window.OptimizedJourney = OptimizedJourney; 