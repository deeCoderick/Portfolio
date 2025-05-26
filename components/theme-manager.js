/**
 * Centralized Theme Management System
 * Replaces scattered theme handling across multiple files
 */

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme();
        this.observers = [];
        this.init();
    }

    getStoredTheme() {
        return localStorage.getItem('theme') || 'dark';
    }

    init() {
        // Set initial theme
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        this.watchSystemTheme();
        
        // Initialize theme toggle buttons
        this.initializeToggles();
        
        // Auto-detect theme preference on first visit
        this.autoDetectTheme();
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle button states
        this.updateToggleStates();
        
        // Notify observers
        this.notifyObservers(theme);
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    autoDetectTheme() {
        if (!localStorage.getItem('theme') && window.matchMedia) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(prefersDark ? 'dark' : 'light');
        }
    }

    initializeToggles() {
        // Handle multiple theme toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    updateToggleStates() {
        const toggles = document.querySelectorAll('.theme-toggle');
        toggles.forEach(toggle => {
            const isDark = this.currentTheme === 'dark';
            toggle.classList.toggle('dark', isDark);
            toggle.classList.toggle('light', !isDark);
            
            // Update aria-label for accessibility
            toggle.setAttribute('aria-label', 
                `Switch to ${isDark ? 'light' : 'dark'} theme`
            );
        });
    }

    // Observer pattern for components that need theme updates
    subscribe(callback) {
        this.observers.push(callback);
    }

    unsubscribe(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    notifyObservers(theme) {
        this.observers.forEach(callback => callback(theme));
    }

    // Utility methods for components
    isDark() {
        return this.currentTheme === 'dark';
    }

    isLight() {
        return this.currentTheme === 'light';
    }

    getTheme() {
        return this.currentTheme;
    }

    // CSS custom properties helper
    getCSSVariable(property) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(property).trim();
    }

    setCSSVariable(property, value) {
        document.documentElement.style.setProperty(property, value);
    }
}

// Create global instance
window.themeManager = new ThemeManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
} 