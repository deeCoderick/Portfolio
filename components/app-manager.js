/**
 * Portfolio Application Manager
 * Centralized system for managing all portfolio functionality with optimizations
 * Implements modern patterns, performance optimization, and code reuse
 */

class PortfolioApp {
    constructor() {
        // Core systems
        this.domCache = new Map();
        this.eventListeners = new Map();
        this.modules = new Map();
        this.isInitialized = false;
        
        // Performance tracking
        this.performanceMetrics = {
            domQueries: 0,
            eventBindings: 0,
            moduleLoads: 0
        };

        // Bind methods
        this.init = this.init.bind(this);
        this.handleDOMContentLoaded = this.handleDOMContentLoaded.bind(this);
        this.handleWindowLoad = this.handleWindowLoad.bind(this);
        
        // Auto-initialize
        this.setupInitialization();
    }

    /**
     * Setup initialization based on DOM ready state
     */
    setupInitialization() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
        } else {
            this.handleDOMContentLoaded();
        }
        
        if (document.readyState === 'complete') {
            this.handleWindowLoad();
        } else {
            window.addEventListener('load', this.handleWindowLoad);
        }
    }

    /**
     * Handle DOM content loaded
     */
    handleDOMContentLoaded() {
        this.init();
    }

    /**
     * Handle window load (for heavy operations)
     */
    handleWindowLoad() {
        this.initHeavyModules();
    }

    /**
     * Optimized DOM query with caching
     */
    $(selector, force = false) {
        this.performanceMetrics.domQueries++;
        
        if (!force && this.domCache.has(selector)) {
            return this.domCache.get(selector);
        }
        
        const elements = document.querySelectorAll(selector);
        this.domCache.set(selector, elements);
        return elements;
    }

    /**
     * Get single element with caching
     */
    $1(selector, force = false) {
        const elements = this.$(selector, force);
        return elements.length > 0 ? elements[0] : null;
    }

    /**
     * Clear DOM cache for specific selector or all
     */
    clearCache(selector = null) {
        if (selector) {
            this.domCache.delete(selector);
        } else {
            this.domCache.clear();
        }
    }

    /**
     * Optimized event delegation
     */
    on(selector, event, handler, options = {}) {
        this.performanceMetrics.eventBindings++;
        
        const key = `${selector}:${event}`;
        
        if (!this.eventListeners.has(key)) {
            this.eventListeners.set(key, new Set());
        }
        
        const delegateHandler = (e) => {
            const target = e.target.closest(selector);
            if (target) {
                handler.call(target, e);
            }
        };
        
        this.eventListeners.get(key).add(delegateHandler);
        document.addEventListener(event, delegateHandler, options);
        
        return () => this.off(selector, event, delegateHandler);
    }

    /**
     * Remove event listener
     */
    off(selector, event, handler) {
        const key = `${selector}:${event}`;
        const handlers = this.eventListeners.get(key);
        
        if (handlers) {
            handlers.delete(handler);
            document.removeEventListener(event, handler);
            
            if (handlers.size === 0) {
                this.eventListeners.delete(key);
            }
        }
    }

    /**
     * Register a module
     */
    registerModule(name, moduleClass, options = {}) {
        this.modules.set(name, {
            class: moduleClass,
            instance: null,
            options,
            loaded: false,
            lazy: options.lazy || false
        });
    }

    /**
     * Initialize a module
     */
    async initModule(name) {
        const module = this.modules.get(name);
        if (!module || module.loaded) return;

        try {
            this.performanceMetrics.moduleLoads++;
            module.instance = new module.class(this, module.options);
            
            if (module.instance.init) {
                await module.instance.init();
            }
            
            module.loaded = true;
            console.debug(`Module ${name} initialized`);
        } catch (error) {
            console.error(`Failed to initialize module ${name}:`, error);
        }
    }

    /**
     * Get module instance
     */
    getModule(name) {
        const module = this.modules.get(name);
        return module ? module.instance : null;
    }

    /**
     * Throttle function execution
     */
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return (...args) => {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    /**
     * Debounce function execution
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Batch DOM operations for better performance
     */
    batchDOM(operations) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                operations.forEach(op => op());
                resolve();
            });
        });
    }

    /**
     * Lazy load heavy operations
     */
    lazy(operation, trigger = 'scroll', threshold = 0.1) {
        return new Promise(resolve => {
            if (trigger === 'scroll') {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            observer.disconnect();
                            resolve(operation());
                        }
                    });
                }, { threshold });
                
                // Observe body as default
                observer.observe(document.body);
            } else if (trigger === 'idle') {
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => resolve(operation()));
                } else {
                    setTimeout(() => resolve(operation()), 100);
                }
            } else {
                resolve(operation());
            }
        });
    }

    /**
     * Initialize core modules
     */
    async init() {
        if (this.isInitialized) return;
        
        console.debug('Initializing Portfolio App...');
        
        // Register core modules
        this.registerCoreModules();
        
        // Initialize essential modules immediately
        await Promise.all([
            this.initModule('theme'),
            this.initModule('navigation'),
            this.initModule('performance')
        ]);
        
        // Initialize other modules
        await Promise.all([
            this.initModule('journey'),
            this.initModule('chatbot'),
            this.initModule('portfolio'),
            this.initModule('animations')
        ]);
        
        this.isInitialized = true;
        console.debug('Portfolio App initialized');
        
        // Dispatch ready event
        document.dispatchEvent(new CustomEvent('app:ready', {
            detail: { app: this, metrics: this.performanceMetrics }
        }));
    }

    /**
     * Initialize heavy modules after window load
     */
    async initHeavyModules() {
        // Initialize lazy modules
        for (const [name, module] of this.modules) {
            if (module.lazy && !module.loaded) {
                await this.initModule(name);
            }
        }
        
        console.debug('Heavy modules initialized');
    }

    /**
     * Register core modules
     */
    registerCoreModules() {
        // These will be defined by their respective files
        if (typeof OptimizedThemeManager !== 'undefined') {
            this.registerModule('theme', OptimizedThemeManager);
        }
        
        if (typeof OptimizedNavigationManager !== 'undefined') {
            this.registerModule('navigation', OptimizedNavigationManager);
        }
        
        if (typeof OptimizedJourneyManager !== 'undefined') {
            this.registerModule('journey', OptimizedJourneyManager);
        }
        
        if (typeof OptimizedChatbotManager !== 'undefined') {
            this.registerModule('chatbot', OptimizedChatbotManager);
        }
        
        if (typeof OptimizedPortfolioManager !== 'undefined') {
            this.registerModule('portfolio', OptimizedPortfolioManager);
        }
        
        if (typeof OptimizedAnimationManager !== 'undefined') {
            this.registerModule('animations', OptimizedAnimationManager, { lazy: true });
        }
        
        if (typeof PerformanceManager !== 'undefined') {
            this.registerModule('performance', PerformanceManager);
        }
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        // Destroy all modules
        for (const [name, module] of this.modules) {
            if (module.instance && module.instance.destroy) {
                module.instance.destroy();
            }
        }
        
        // Clear caches
        this.domCache.clear();
        
        // Remove event listeners
        for (const [key, handlers] of this.eventListeners) {
            handlers.forEach(handler => {
                document.removeEventListener(key.split(':')[1], handler);
            });
        }
        this.eventListeners.clear();
        
        this.isInitialized = false;
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            ...this.performanceMetrics,
            modules: this.modules.size,
            domCacheSize: this.domCache.size,
            eventListeners: this.eventListeners.size
        };
    }
}

// Create global app instance
const portfolioApp = new PortfolioApp();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.PortfolioApp = PortfolioApp;
    window.portfolioApp = portfolioApp;
} 