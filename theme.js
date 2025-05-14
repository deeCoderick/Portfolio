// Theme management for portfolio website

// Function to initialize theme based on saved preference
function initTheme() {
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark if no preference
    
    // Set the theme attribute
    htmlElement.setAttribute('data-theme', savedTheme);
    
    // Find manual theme toggle button
    const themeToggleButton = document.querySelector('.theme-toggle');
    
    if (themeToggleButton) {
        // Update the toggle appearance based on current theme
        updateToggleAppearance(savedTheme, themeToggleButton);
        
        // Ensure click handler is attached
        themeToggleButton.addEventListener('click', function() {
            toggleTheme(themeToggleButton);
        });
    }
}

// Function to update toggle button appearance
function updateToggleAppearance(theme, button) {
    // Check if this is a modern toggle with icons
    const sunIcon = button.querySelector('.fa-sun');
    const moonIcon = button.querySelector('.fa-moon');
    
    if (sunIcon && moonIcon) {
        // This is a modern toggle with both icons
        if (theme === 'light') {
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'scale(1.1)';
            moonIcon.style.opacity = '0.6';
            moonIcon.style.transform = 'scale(1)';
        } else {
            sunIcon.style.opacity = '0.6';
            sunIcon.style.transform = 'scale(1)';
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'scale(1.1)';
        }
        
        // Update toggle slider if it exists
        const slider = button.closest('.theme-toggle-container')?.querySelector('.toggle-slider');
        if (slider) {
            slider.style.transform = theme === 'light' ? 'translateX(34px)' : 'translateX(0)';
        }
    } else {
        // This is a simple toggle with a single icon
        // Clear any existing icons
        button.innerHTML = '';
        
        // Create new icon
        const icon = document.createElement('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        button.appendChild(icon);
    }
    
    // Add animation effect
    button.classList.add('theme-animate');
    setTimeout(() => {
        button.classList.remove('theme-animate');
    }, 300);
}

// Function to toggle between light and dark themes
function toggleTheme(button) {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme attribute
    htmlElement.setAttribute('data-theme', newTheme);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update button appearance
    if (button) {
        updateToggleAppearance(newTheme, button);
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    // Watch for theme attribute changes (for sync across tabs)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const themeToggleButton = document.querySelector('.theme-toggle');
                if (themeToggleButton) {
                    updateToggleAppearance(currentTheme, themeToggleButton);
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});

// Also run initialization immediately if the DOM is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initTheme();
}

// Make sure theme is initialized even if there are timing issues with loading
setTimeout(function() {
    const themeToggleButton = document.querySelector('.theme-toggle');
    if (themeToggleButton) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        updateToggleAppearance(currentTheme, themeToggleButton);
    }
}, 500); 