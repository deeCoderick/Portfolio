/**
 * Console Monitor - Enhanced console logging for debugging
 * This script provides better console monitoring and categorization
 */

(function() {
    'use strict';
    
    // Store original console methods
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info
    };
    
    // Console message storage
    const consoleMessages = {
        logs: [],
        warnings: [],
        errors: [],
        info: []
    };
    
    // Enhanced console methods
    console.log = function(...args) {
        consoleMessages.logs.push({
            timestamp: new Date().toISOString(),
            message: args.join(' '),
            stack: new Error().stack
        });
        originalConsole.log.apply(console, args);
    };
    
    console.warn = function(...args) {
        consoleMessages.warnings.push({
            timestamp: new Date().toISOString(),
            message: args.join(' '),
            stack: new Error().stack
        });
        originalConsole.warn.apply(console, args);
    };
    
    console.error = function(...args) {
        consoleMessages.errors.push({
            timestamp: new Date().toISOString(),
            message: args.join(' '),
            stack: new Error().stack
        });
        originalConsole.error.apply(console, args);
    };
    
    console.info = function(...args) {
        consoleMessages.info.push({
            timestamp: new Date().toISOString(),
            message: args.join(' '),
            stack: new Error().stack
        });
        originalConsole.info.apply(console, args);
    };
    
    // Global error handler
    window.addEventListener('error', function(event) {
        console.error('Uncaught Error:', event.error?.message || event.message, 'at', event.filename + ':' + event.lineno);
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
    });
    
    // Utility functions for debugging
    window.getConsoleSummary = function() {
        return {
            totalLogs: consoleMessages.logs.length,
            totalWarnings: consoleMessages.warnings.length,
            totalErrors: consoleMessages.errors.length,
            totalInfo: consoleMessages.info.length,
            recentErrors: consoleMessages.errors.slice(-5),
            recentWarnings: consoleMessages.warnings.slice(-5)
        };
    };
    
    window.clearConsoleHistory = function() {
        consoleMessages.logs = [];
        consoleMessages.warnings = [];
        consoleMessages.errors = [];
        consoleMessages.info = [];
        console.info('Console history cleared');
    };
    
    window.exportConsoleLogs = function() {
        const data = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            messages: consoleMessages
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `console-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.info('Console logs exported');
    };
    
    // Performance monitoring
    let performanceMetrics = {
        pageLoadTime: 0,
        domContentLoadedTime: 0,
        resourceLoadTime: 0
    };
    
    // Measure page load performance
    window.addEventListener('load', function() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            performanceMetrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
            performanceMetrics.domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.fetchStart;
            performanceMetrics.resourceLoadTime = navigation.loadEventEnd - navigation.domContentLoadedEventEnd;
            
            console.info('Page Performance:', {
                'Page Load Time': Math.round(performanceMetrics.pageLoadTime) + 'ms',
                'DOM Content Loaded': Math.round(performanceMetrics.domContentLoadedTime) + 'ms',
                'Resource Load Time': Math.round(performanceMetrics.resourceLoadTime) + 'ms'
            });
        }
    });
    
    window.getPerformanceMetrics = function() {
        return performanceMetrics;
    };
    
    // Initialize console monitoring
    console.info('Console Monitor initialized - Use getConsoleSummary() to view message counts');
    
})(); 