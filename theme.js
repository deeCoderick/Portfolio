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