// Back to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.querySelector('.back-to-top');
    const backToTopContainer = document.querySelector('.back-to-top-container');
    
    if (backToTopBtn && backToTopContainer) {
        // Apply direct styles to ensure visibility
        backToTopContainer.style.position = 'fixed';
        backToTopContainer.style.bottom = '2rem';
        backToTopContainer.style.right = '2rem';
        backToTopContainer.style.zIndex = '9999';
        
        backToTopBtn.style.backgroundColor = '#6c8aff';
        backToTopBtn.style.color = 'white';
        backToTopBtn.style.width = '50px';
        backToTopBtn.style.height = '50px';
        backToTopBtn.style.borderRadius = '50%';
        backToTopBtn.style.display = 'flex';
        backToTopBtn.style.justifyContent = 'center';
        backToTopBtn.style.alignItems = 'center';
        backToTopBtn.style.border = 'none';
        backToTopBtn.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        backToTopBtn.style.cursor = 'pointer';
        backToTopBtn.style.transition = 'all 0.3s ease';
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Trigger scroll event to set initial state
        window.dispatchEvent(new Event('scroll'));
    }
}); 