/**
 * Journey section smooth animations - OPTIMIZED VERSION
 * Performance improvements: throttling, reduced DOM operations, and minimal style changes
 */

(function() {
    // Track the current theme
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    let isProcessing = false; // Throttle control variable
    let visibilityInterval = null;

    // Throttle function to limit execution frequency
    function throttle(callback, delay) {
        if (isProcessing) return;
        isProcessing = true;
        setTimeout(() => {
            callback();
            isProcessing = false;
        }, delay);
    }

    // Ensure journey section visibility with minimal DOM operations
    function forceJourneyVisibility() {
        const journeySection = document.querySelector('#journey');
        if (!journeySection) return;

        // Use classList to add a visibility class rather than inline styles
        journeySection.classList.add('journey-visible');
        
        // Only select elements that commonly have visibility issues
        const criticalElements = document.querySelectorAll('.journey-item, .journey-content, .journey-marker');
        criticalElements.forEach(element => {
            if (element.style.visibility === 'hidden' || element.style.opacity === '0' || element.style.display === 'none') {
                element.classList.add('journey-visible');
            }
        });
    }

    // Update journey section theme - only run on theme changes
    function updateJourneyTheme() {
        const journeySection = document.querySelector('#journey');
        if (!journeySection) return;
        
        // Only update classes instead of setting inline styles
        if (currentTheme === 'light') {
            journeySection.classList.add('light-theme');
            journeySection.classList.remove('dark-theme');
        } else {
            journeySection.classList.add('dark-theme');
            journeySection.classList.remove('light-theme');
        }
        
        // Run visibility check once on theme change
        forceJourneyVisibility();
    }

    // Event listener for theme changes - with throttling
    function handleThemeChange() {
        const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        if (newTheme !== currentTheme) {
            currentTheme = newTheme;
            throttle(updateJourneyTheme, 50);
        }
    }

    // Initialize journey section one time only
    function initJourneySection() {
        const journeySection = document.querySelector('#journey');
        if (!journeySection) return;
        
        // Only create elements if they don't exist
        const timeline = document.querySelector('.journey-timeline');
        if (timeline && !timeline.querySelector('.timeline-line')) {
            const timelineLine = document.createElement('div');
            timelineLine.className = 'timeline-line journey-visible';
            timeline.appendChild(timelineLine);
        }
        
        // Add initial theme class
        if (currentTheme === 'light') {
            journeySection.classList.add('light-theme');
        } else {
            journeySection.classList.add('dark-theme');
        }
        
        // Force visibility once during initialization
        forceJourneyVisibility();
        
        // Set up visibility interval at a reasonable rate (500ms instead of 100ms)
        if (!visibilityInterval) {
            visibilityInterval = setInterval(() => {
                throttle(forceJourneyVisibility, 100);
            }, 500);
        }
    }

    // Set up MutationObserver to watch for theme changes - optimized to only observe what's needed
    const observer = new MutationObserver(mutations => {
        throttle(handleThemeChange, 100);
    });
    
    // Start observing the html element for data-theme changes only
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // Listen for theme toggle with throttling
    const themeToggler = document.querySelector('#theme-toggle');
    if (themeToggler) {
        themeToggler.addEventListener('click', () => {
            throttle(handleThemeChange, 100);
        });
    }

    // Initialize journey section when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initJourneySection);
    } else {
        // DOM already loaded, initialize immediately
        initJourneySection();
    }

    // Throttle scroll event to reduce performance impact
    window.addEventListener('scroll', () => {
        throttle(forceJourneyVisibility, 100);
    }, { passive: true });
    
    // Force visibility immediately
    forceJourneyVisibility();
    
    // Force visibility after a short delay - but only once
    setTimeout(forceJourneyVisibility, 1000);
    
    // Stop interval when page is hidden to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && visibilityInterval) {
            clearInterval(visibilityInterval);
            visibilityInterval = null;
        } else if (!document.hidden && !visibilityInterval) {
            visibilityInterval = setInterval(() => {
                throttle(forceJourneyVisibility, 100);
            }, 500);
        }
    });
})(); 