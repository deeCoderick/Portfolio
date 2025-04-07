document.addEventListener('DOMContentLoaded', function() {
    const socialSidebar = document.querySelector('.social-sidebar');
    const introSection = document.querySelector('.hero-section'); // or your intro section class
    const footer = document.querySelector('footer');
    
    function updateSidebarVisibility() {
        if (!introSection || !footer || !socialSidebar) return;
        
        const introBottom = introSection.getBoundingClientRect().bottom;
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Show sidebar after scrolling past intro section and before reaching footer
        if (introBottom < 0 && footerTop > windowHeight) {
            socialSidebar.classList.add('visible');
        } else {
            socialSidebar.classList.remove('visible');
        }
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateSidebarVisibility);
    
    // Initial check
    updateSidebarVisibility();
}); 