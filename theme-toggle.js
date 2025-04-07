// Theme Toggle Functionality
function initializeTheme() {
    // Get the saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Find theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        // Update initial icon state
        updateToggleIcons(savedTheme);
        
        // Add click event listener
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icons
            updateToggleIcons(newTheme);
            
            // Add animation class
            themeToggle.classList.add('animated');
            setTimeout(() => themeToggle.classList.remove('animated'), 300);
        });
    }
}

// Function to update toggle icons based on theme
function updateToggleIcons(theme) {
    const sunIcon = document.querySelector('.toggle-icons .fa-sun');
    const moonIcon = document.querySelector('.toggle-icons .fa-moon');
    
    if (sunIcon && moonIcon) {
        if (theme === 'light') {
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'translateY(0) rotate(0deg)';
            moonIcon.style.opacity = '0';
            moonIcon.style.transform = 'translateY(-20px) rotate(-90deg)';
        } else {
            sunIcon.style.opacity = '0';
            sunIcon.style.transform = 'translateY(20px) rotate(90deg)';
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'translateY(0) rotate(0deg)';
        }
    }
}

// Initialize theme when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
    initializeTheme();
}

// Watch for theme changes from other scripts or windows
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'data-theme') {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            updateToggleIcons(currentTheme);
        }
    });
});

observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
}); 