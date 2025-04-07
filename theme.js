// Theme management for portfolio website

// Function to initialize theme based on saved preference
function initTheme() {
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark if no preference
    
    // Set the theme attribute
    htmlElement.setAttribute('data-theme', savedTheme);
    
    // Create theme toggle button if it doesn't exist
    if (!document.querySelector('.theme-toggle')) {
        console.log("Creating theme toggle button");
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle light/dark mode');
        
        const icon = document.createElement('i');
        icon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        themeToggle.appendChild(icon);
        
        // Add the button to the beginning of the body
        document.body.insertBefore(themeToggle, document.body.firstChild);
        
        // Add click event listener
        themeToggle.addEventListener('click', toggleTheme);
    } else {
        console.log("Theme toggle button already exists");
        // Update existing button icon
        const toggleIcon = document.querySelector('.theme-toggle i');
        if (toggleIcon) {
            toggleIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        // Ensure click handler is attached
        document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
    }
}

// Function to toggle between light and dark themes
function toggleTheme() {
    console.log("Toggle theme clicked");
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme attribute
    htmlElement.setAttribute('data-theme', newTheme);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update the icon
    const toggleIcon = document.querySelector('.theme-toggle i');
    if (toggleIcon) {
        toggleIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);

// Also run initialization immediately if the DOM is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log("Document already loaded, initializing theme");
    initTheme();
}

// Make sure the button is inserted even if there are timing issues with loading
setTimeout(function() {
    if (!document.querySelector('.theme-toggle')) {
        console.log("Delayed theme toggle button creation");
        initTheme();
    }
}, 500);

// Theme persistence
document.addEventListener('DOMContentLoaded', function() {
    // Get the saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update theme when changed
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                localStorage.setItem('theme', currentTheme);
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
        });
    }
}); 