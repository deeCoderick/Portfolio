/**
 * Unified Theme Manager
 * Consolidates theme.js and theme-toggle.js into a single, efficient system
 * Eliminates duplication and improves performance
 */

class UnifiedThemeManager {
    constructor() {
        this.observers = [];
        this.toggles = [];
        this.currentTheme = null;
        this.isInitialized = false;
        
        // Bind methods to preserve context
        this.toggle = this.toggle.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.loadTheme();
        this.setupMutationObserver();
        this.bindToggles();
        this.setupStorageListener();
        
        this.isInitialized = true;
        
        // Emit initialization event
        this.emit('themeManagerReady', { theme: this.currentTheme });
    }
    
    loadTheme() {
        // Get saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme, false); // Don't save to localStorage on initial load
    }
    
    setTheme(theme, save = true) {
        if (this.currentTheme === theme) return;
        
        const previousTheme = this.currentTheme;
        this.currentTheme = theme;
        
        // Update DOM
        document.documentElement.setAttribute('data-theme', theme);
        
        // Save to localStorage if requested
        if (save) {
            localStorage.setItem('theme', theme);
        }
        
        // Update all toggle buttons
        this.updateAllToggles(theme);
        
        // Notify observers
        this.notifyObservers(theme, previousTheme);
        
        // Emit theme change event
        this.emit('themeChanged', { 
            theme, 
            previousTheme,
            timestamp: Date.now()
        });
    }
    
    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        return newTheme;
    }
    
    setupMutationObserver() {
        // Single observer for all theme attribute changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme');
                    if (newTheme !== this.currentTheme) {
                        this.handleThemeChange(newTheme);
                    }
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        this.mutationObserver = observer;
    }
    
    setupStorageListener() {
        // Listen for theme changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme' && e.newValue !== this.currentTheme) {
                this.setTheme(e.newValue, false);
            }
        });
    }
    
    bindToggles() {
        // Find and bind all theme toggle buttons
        this.findToggles();
        
        // Re-scan for toggles periodically (for dynamically added elements)
        this.toggleScanInterval = setInterval(() => {
            this.findToggles();
        }, 2000);
    }
    
    findToggles() {
        const toggleSelectors = [
            '.theme-toggle',
            '[data-theme-toggle]',
            '.theme-switch',
            '.dark-mode-toggle'
        ];
        
        toggleSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!this.toggles.includes(element)) {
                    this.toggles.push(element);
                    element.addEventListener('click', this.handleToggleClick);
                    this.updateToggleAppearance(element, this.currentTheme);
                }
            });
        });
    }
    
    handleToggleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const button = event.currentTarget;
        
        // Add animation class
        button.classList.add('theme-animate', 'animated');
        
        // Toggle theme
        this.toggle();
        
        // Remove animation class after animation completes
        setTimeout(() => {
            button.classList.remove('theme-animate', 'animated');
        }, 300);
    }
    
    handleThemeChange(newTheme) {
        // Handle external theme changes (from other scripts)
        this.currentTheme = newTheme;
        this.updateAllToggles(newTheme);
        this.notifyObservers(newTheme);
    }
    
    updateAllToggles(theme) {
        this.toggles.forEach(toggle => {
            this.updateToggleAppearance(toggle, theme);
        });
    }
    
    updateToggleAppearance(button, theme) {
        if (!button) return;
        
        // Handle different toggle types
        const sunIcon = button.querySelector('.fa-sun, .sun-icon');
        const moonIcon = button.querySelector('.fa-moon, .moon-icon');
        const toggleIcons = button.querySelector('.toggle-icons');
        
        if (sunIcon && moonIcon) {
            // Modern toggle with both icons
            this.updateDualIconToggle(sunIcon, moonIcon, theme);
        } else if (toggleIcons) {
            // Toggle with icon container
            this.updateIconContainerToggle(toggleIcons, theme);
        } else {
            // Simple single icon toggle
            this.updateSingleIconToggle(button, theme);
        }
        
        // Update slider if present
        const slider = button.closest('.theme-toggle-container')?.querySelector('.toggle-slider');
        if (slider) {
            slider.style.transform = theme === 'light' ? 'translateX(34px)' : 'translateX(0)';
        }
        
        // Update button attributes
        button.setAttribute('data-theme', theme);
        button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    }
    
    updateDualIconToggle(sunIcon, moonIcon, theme) {
        if (theme === 'light') {
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'translateY(0) rotate(0deg) scale(1.1)';
            moonIcon.style.opacity = '0.6';
            moonIcon.style.transform = 'translateY(-20px) rotate(-90deg) scale(1)';
        } else {
            sunIcon.style.opacity = '0.6';
            sunIcon.style.transform = 'translateY(20px) rotate(90deg) scale(1)';
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'translateY(0) rotate(0deg) scale(1.1)';
        }
    }
    
    updateIconContainerToggle(container, theme) {
        const sunIcon = container.querySelector('.fa-sun, .sun-icon');
        const moonIcon = container.querySelector('.fa-moon, .moon-icon');
        
        if (sunIcon && moonIcon) {
            this.updateDualIconToggle(sunIcon, moonIcon, theme);
        }
    }
    
    updateSingleIconToggle(button, theme) {
        // Clear existing content
        const existingIcon = button.querySelector('i, .icon');
        if (existingIcon) {
            existingIcon.remove();
        }
        
        // Create new icon
        const icon = document.createElement('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        button.appendChild(icon);
    }
    
    // Observer pattern for theme changes
    addObserver(callback) {
        if (typeof callback === 'function') {
            this.observers.push(callback);
        }
    }
    
    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    
    notifyObservers(theme, previousTheme = null) {
        this.observers.forEach(callback => {
            try {
                callback(theme, previousTheme);
            } catch (error) {
                console.warn('Theme observer error:', error);
            }
        });
    }
    
    // Event emitter for custom events
    emit(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: { ...data, manager: this },
            bubbles: true
        });
        document.dispatchEvent(event);
    }
    
    // Utility methods
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    isLight() {
        return this.currentTheme === 'light';
    }
    
    isDark() {
        return this.currentTheme === 'dark';
    }
    
    // Cleanup method
    destroy() {
        // Remove event listeners
        this.toggles.forEach(toggle => {
            toggle.removeEventListener('click', this.handleToggleClick);
        });
        
        // Clear intervals
        if (this.toggleScanInterval) {
            clearInterval(this.toggleScanInterval);
        }
        
        // Disconnect observer
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        
        // Clear arrays
        this.observers = [];
        this.toggles = [];
        
        this.isInitialized = false;
    }
}

// Create global instance
const themeManager = new UnifiedThemeManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedThemeManager;
}

// Global access
window.themeManager = themeManager;

// Legacy compatibility
window.toggleTheme = () => themeManager.toggle();
window.initTheme = () => themeManager.init();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => themeManager.init());
} else {
    themeManager.init();
} 