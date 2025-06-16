/**
 * Optimized Theme Manager
 * Consolidates theme.js and theme-toggle.js with performance improvements
 * Uses modern patterns and integrates with the app manager
 */

class OptimizedThemeManager {
    constructor(app, options = {}) {
        this.app = app;
        this.options = {
            defaultTheme: 'dark',
            storageKey: 'theme',
            syncAcrossTabs: true,
            ...options
        };
        
        this.currentTheme = null;
        this.toggleElements = new Set();
        this.observers = new Set();
        this.isInitialized = false;
        
        // Bind methods
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleStorageChange = this.handleStorageChange.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        
        // Performance optimizations
        this.updateThemeDebounced = this.app.debounce(this.updateTheme.bind(this), 16);
        this.updateTogglesThrottled = this.app.throttle(this.updateToggleStates.bind(this), 50);
    }

    /**
     * Initialize theme manager
     */
    async init() {
        if (this.isInitialized) return;
        
        // Load saved theme or default
        this.currentTheme = this.getSavedTheme();
        
        // Apply theme immediately (before other elements load)
        this.applyTheme(this.currentTheme, false);
        
        // Setup toggle elements
        this.setupToggleElements();
        
        // Setup cross-tab synchronization
        if (this.options.syncAcrossTabs) {
            this.setupCrossTabSync();
        }
        
        // Setup mutation observer for dynamic toggles
        this.setupDynamicToggleDetection();
        
        this.isInitialized = true;
        console.debug('Theme Manager initialized');
    }

    /**
     * Get saved theme from localStorage
     */
    getSavedTheme() {
        try {
            return localStorage.getItem(this.options.storageKey) || this.options.defaultTheme;
        } catch {
            return this.options.defaultTheme;
        }
    }

    /**
     * Save theme to localStorage
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(this.options.storageKey, theme);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
        }
    }

    /**
     * Apply theme to document
     */
    applyTheme(theme, animate = true) {
        if (this.currentTheme === theme) return;
        
        const htmlElement = document.documentElement;
        const previousTheme = this.currentTheme;
        this.currentTheme = theme;
        
        // Use batched DOM operations for better performance
        this.app.batchDOM([
            () => htmlElement.setAttribute('data-theme', theme),
            () => {
                if (animate) {
                    htmlElement.classList.add('theme-transitioning');
                    setTimeout(() => {
                        htmlElement.classList.remove('theme-transitioning');
                    }, 300);
                }
            }
        ]);
        
        // Save preference
        this.saveTheme(theme);
        
        // Update toggle states
        this.updateTogglesThrottled();
        
        // Notify observers
        this.notifyObservers(theme, previousTheme);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('theme:changed', {
            detail: { theme, previousTheme, animated: animate }
        }));
    }

    /**
     * Toggle between themes
     */
    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    /**
     * Setup toggle elements with event delegation
     */
    setupToggleElements() {
        // Use event delegation for better performance
        this.app.on('.theme-toggle', 'click', this.handleToggleClick);
        
        // Initial setup of existing toggles
        const toggles = this.app.$('.theme-toggle');
        toggles.forEach(toggle => this.registerToggle(toggle));
    }

    /**
     * Register a toggle element
     */
    registerToggle(element) {
        if (this.toggleElements.has(element)) return;
        
        this.toggleElements.add(element);
        this.updateToggleState(element, this.currentTheme);
        
        // Add ARIA attributes for accessibility
        element.setAttribute('aria-label', 'Toggle theme');
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        
        // Support keyboard navigation
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleToggleClick.call(element, e);
            }
        });
    }

    /**
     * Handle toggle click
     */
    handleToggleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Add click animation
        this.addClickAnimation(e.target.closest('.theme-toggle'));
        
        // Toggle theme
        this.toggle();
    }

    /**
     * Add click animation to toggle
     */
    addClickAnimation(element) {
        element.classList.add('theme-animate');
        setTimeout(() => {
            element.classList.remove('theme-animate');
        }, 300);
    }

    /**
     * Update all toggle states
     */
    updateToggleStates() {
        this.toggleElements.forEach(toggle => {
            this.updateToggleState(toggle, this.currentTheme);
        });
    }

    /**
     * Update individual toggle state
     */
    updateToggleState(element, theme) {
        // Handle different toggle types
        const sunIcon = element.querySelector('.fa-sun, .sun-icon');
        const moonIcon = element.querySelector('.fa-moon, .moon-icon');
        const toggleIcons = element.querySelector('.toggle-icons');
        
        if (sunIcon && moonIcon) {
            // Modern toggle with both icons
            this.updateDualIconToggle(element, theme, sunIcon, moonIcon);
        } else if (toggleIcons) {
            // Container with icons
            this.updateIconContainerToggle(element, theme);
        } else {
            // Simple single icon toggle
            this.updateSimpleToggle(element, theme);
        }
        
        // Update slider if present
        this.updateSlider(element, theme);
        
        // Update ARIA state
        element.setAttribute('aria-pressed', theme === 'dark' ? 'false' : 'true');
    }

    /**
     * Update dual icon toggle
     */
    updateDualIconToggle(element, theme, sunIcon, moonIcon) {
        if (theme === 'light') {
            sunIcon.style.cssText = 'opacity: 1; transform: scale(1.1)';
            moonIcon.style.cssText = 'opacity: 0.6; transform: scale(1)';
        } else {
            sunIcon.style.cssText = 'opacity: 0.6; transform: scale(1)';
            moonIcon.style.cssText = 'opacity: 1; transform: scale(1.1)';
        }
    }

    /**
     * Update icon container toggle
     */
    updateIconContainerToggle(element, theme) {
        const container = element.querySelector('.toggle-icons');
        const sunIcon = container.querySelector('.fa-sun, .sun-icon');
        const moonIcon = container.querySelector('.fa-moon, .moon-icon');
        
        if (sunIcon && moonIcon) {
            if (theme === 'light') {
                sunIcon.style.opacity = '1';
                moonIcon.style.opacity = '0.5';
            } else {
                sunIcon.style.opacity = '0.5';
                moonIcon.style.opacity = '1';
            }
        }
    }

    /**
     * Update simple toggle
     */
    updateSimpleToggle(element, theme) {
        // Clear existing content
        element.innerHTML = '';
        
        // Create appropriate icon
        const icon = document.createElement('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        element.appendChild(icon);
    }

    /**
     * Update slider position
     */
    updateSlider(element, theme) {
        const slider = element.closest('.theme-toggle-container')?.querySelector('.toggle-slider');
        if (slider) {
            slider.style.transform = theme === 'light' ? 'translateX(34px)' : 'translateX(0)';
        }
    }

    /**
     * Setup cross-tab synchronization
     */
    setupCrossTabSync() {
        window.addEventListener('storage', this.handleStorageChange);
    }

    /**
     * Handle storage change (cross-tab sync)
     */
    handleStorageChange(e) {
        if (e.key === this.options.storageKey && e.newValue !== this.currentTheme) {
            this.applyTheme(e.newValue, false);
        }
    }

    /**
     * Setup dynamic toggle detection
     */
    setupDynamicToggleDetection() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the node itself is a toggle
                        if (node.matches && node.matches('.theme-toggle')) {
                            this.registerToggle(node);
                        }
                        
                        // Check for toggles within the node
                        const toggles = node.querySelectorAll?.('.theme-toggle');
                        toggles?.forEach(toggle => this.registerToggle(toggle));
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        this.mutationObserver = observer;
    }

    /**
     * Add theme change observer
     */
    onThemeChange(callback) {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
    }

    /**
     * Notify observers of theme change
     */
    notifyObservers(newTheme, oldTheme) {
        this.observers.forEach(callback => {
            try {
                callback(newTheme, oldTheme);
            } catch (error) {
                console.error('Theme observer error:', error);
            }
        });
    }

    /**
     * Get current theme
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Set theme programmatically
     */
    setTheme(theme, animate = true) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme, animate);
        }
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        // Remove event listeners
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        
        window.removeEventListener('storage', this.handleStorageChange);
        
        // Clear sets
        this.toggleElements.clear();
        this.observers.clear();
        
        this.isInitialized = false;
    }
}

// Export for use with app manager
if (typeof window !== 'undefined') {
    window.OptimizedThemeManager = OptimizedThemeManager;
} 