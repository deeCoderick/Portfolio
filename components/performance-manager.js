/**
 * Performance Management System
 * Optimizes intervals, DOM queries, and animations
 */

class PerformanceManager {
    constructor() {
        this.intervals = new Map();
        this.observers = new Map();
        this.rafCallbacks = new Set();
        this.isVisible = !document.hidden;
        this.init();
    }

    init() {
        this.setupVisibilityHandler();
        this.setupIntersectionObserver();
        this.setupRAFManager();
    }

    // Centralized interval management
    setInterval(name, callback, delay, options = {}) {
        this.clearInterval(name);
        
        const intervalData = {
            callback,
            delay,
            pauseWhenHidden: options.pauseWhenHidden !== false,
            intervalId: null,
            isActive: false
        };

        this.intervals.set(name, intervalData);
        
        if (this.isVisible || !intervalData.pauseWhenHidden) {
            this.startInterval(name);
        }

        return name;
    }

    clearInterval(name) {
        const intervalData = this.intervals.get(name);
        if (intervalData?.intervalId) {
            clearInterval(intervalData.intervalId);
            intervalData.intervalId = null;
            intervalData.isActive = false;
        }
        this.intervals.delete(name);
    }

    startInterval(name) {
        const intervalData = this.intervals.get(name);
        if (intervalData && !intervalData.isActive) {
            intervalData.intervalId = setInterval(intervalData.callback, intervalData.delay);
            intervalData.isActive = true;
        }
    }

    pauseInterval(name) {
        const intervalData = this.intervals.get(name);
        if (intervalData?.intervalId) {
            clearInterval(intervalData.intervalId);
            intervalData.intervalId = null;
            intervalData.isActive = false;
        }
    }

    // Visibility change handler
    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            
            this.intervals.forEach((intervalData, name) => {
                if (intervalData.pauseWhenHidden) {
                    if (this.isVisible) {
                        this.startInterval(name);
                    } else {
                        this.pauseInterval(name);
                    }
                }
            });
        });
    }

    // Optimized intersection observer for animations
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const callback = this.observers.get(entry.target);
                if (callback) {
                    callback(entry.isIntersecting, entry);
                }
            });
        }, {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '50px'
        });
    }

    observeElement(element, callback) {
        this.observers.set(element, callback);
        this.intersectionObserver.observe(element);
    }

    unobserveElement(element) {
        this.observers.delete(element);
        this.intersectionObserver.unobserve(element);
    }

    // RequestAnimationFrame manager
    setupRAFManager() {
        const runRAFCallbacks = () => {
            this.rafCallbacks.forEach(callback => {
                try {
                    callback();
                } catch (error) {
                    console.warn('RAF callback error:', error);
                }
            });
            
            if (this.rafCallbacks.size > 0) {
                requestAnimationFrame(runRAFCallbacks);
            }
        };

        // Start the RAF loop when first callback is added
        this.startRAFLoop = () => {
            if (this.rafCallbacks.size === 1) {
                requestAnimationFrame(runRAFCallbacks);
            }
        };
    }

    addRAFCallback(callback) {
        this.rafCallbacks.add(callback);
        this.startRAFLoop();
    }

    removeRAFCallback(callback) {
        this.rafCallbacks.delete(callback);
    }

    // Throttle utility
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
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

    // Debounce utility
    debounce(func, delay) {
        let timeoutId;
        
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // DOM query optimization
    createQueryCache() {
        const cache = new Map();
        
        return {
            get(selector) {
                if (!cache.has(selector)) {
                    cache.set(selector, document.querySelectorAll(selector));
                }
                return cache.get(selector);
            },
            
            clear() {
                cache.clear();
            },
            
            refresh(selector) {
                cache.delete(selector);
                return this.get(selector);
            }
        };
    }

    // Batch DOM operations
    batchDOMOperations(operations) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                operations.forEach(op => op());
                resolve();
            });
        });
    }

    // Performance monitoring
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }

    // Cleanup method
    destroy() {
        // Clear all intervals
        this.intervals.forEach((_, name) => this.clearInterval(name));
        
        // Clear all observers
        this.observers.forEach((_, element) => this.unobserveElement(element));
        
        // Clear RAF callbacks
        this.rafCallbacks.clear();
        
        // Disconnect intersection observer
        this.intersectionObserver?.disconnect();
    }
}

// Create global instance
window.performanceManager = new PerformanceManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceManager;
} 