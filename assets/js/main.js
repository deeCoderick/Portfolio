// Main initialization script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize theme
    initTheme();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize space theme
    initSpaceTheme();
    
    // Initialize social sidebar
    initSocialSidebar();

    // Portfolio filtering
    initPortfolio();
});

function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Smooth scroll for navigation links - only for same-page anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // Only apply to pure hash links (not links to other pages with hash fragments)
            if (anchor.getAttribute('href').indexOf('.html') === -1) {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                        navLinks.classList.remove('active');
                    }
                });
            }
        });
    }
}

function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.classList.add('animated');
            setTimeout(() => themeToggle.classList.remove('animated'), 300);
        });
    }
}

function initScrollAnimations() {
    if (typeof ScrollReveal === 'function') {
        ScrollReveal().reveal('.hero-content', {
            delay: 200,
            distance: '20px',
            origin: 'bottom',
            duration: 800,
            easing: 'cubic-bezier(0.5, 0, 0, 1)'
        });

        // Initialize journey items animation
        ScrollReveal().reveal('.journey-item', {
            delay: 200,
            distance: '30px',
            origin: 'bottom',
            duration: 800,
            interval: 200
        });

        // Initialize portfolio items animation
        ScrollReveal().reveal('.portfolio-item', {
            delay: 200,
            distance: '20px',
            origin: 'bottom',
            duration: 800,
            interval: 100
        });
    }

    // Initialize back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function initSpaceTheme() {
    const heroSection = document.querySelector('.hero-section');
    const heroContainer = document.querySelector('.hero-container');
    
    if (heroSection && heroContainer) {
        // Add parallax effect
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            
            heroContainer.style.transform = `translateZ(50px) rotateY(${xAxis/2}deg) rotateX(${yAxis/2}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroContainer.style.transform = 'translateZ(50px) rotateY(0deg) rotateX(0deg)';
        });

        // Create shooting stars
        createShootingStars();
    }
}

function createShootingStars() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    setInterval(() => {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        // Random position and angle
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight / 2);
        const angle = Math.random() * 45 - 45;
        
        star.style.top = `${startY}px`;
        star.style.left = `${startX}px`;
        star.style.transform = `rotate(${angle}deg)`;
        
        heroSection.appendChild(star);
        
        // Remove star after animation
        setTimeout(() => {
            star.remove();
        }, 3000);
    }, 2000);
}

function initSocialSidebar() {
    const heroSocialLinks = document.querySelector('.hero-social-links');
    const socialSidebar = document.querySelector('.social-sidebar');
    
    if (heroSocialLinks && socialSidebar) {
        // Clone social links to sidebar
        heroSocialLinks.querySelectorAll('.hero-social-link').forEach(link => {
            const clonedLink = link.cloneNode(true);
            clonedLink.classList.remove('hero-social-link');
            socialSidebar.appendChild(clonedLink);
        });

        // Show/hide sidebar based on scroll
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const heroRect = heroSocialLinks.getBoundingClientRect();
                    const shouldShow = window.scrollY > (heroRect.bottom + window.scrollY);
                    socialSidebar.classList.toggle('visible', shouldShow);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Portfolio filtering functionality
function initPortfolio() {
    const portfolioNavButtons = document.querySelectorAll('.portfolio-nav-button');
    const portfolioTabs = document.querySelectorAll('.portfolio-tab');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Function to filter items
    function filterItems(category) {
        portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all' || category === itemCategory) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Handle nav button clicks
    portfolioNavButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = button.getAttribute('data-category');
            
            // Only prevent default for non-shopping categories
            if (category !== 'shopping') {
                e.preventDefault();
                
                // Update active states
                portfolioNavButtons.forEach(btn => btn.classList.remove('active'));
                portfolioTabs.forEach(tab => {
                    if (tab.getAttribute('data-filter') === category) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
                button.classList.add('active');
                
                // Filter items
                filterItems(category);
            }
        });
    });

    // Handle tab clicks
    portfolioTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-filter');
            
            // Update active states
            portfolioTabs.forEach(t => t.classList.remove('active'));
            portfolioNavButtons.forEach(btn => {
                if (btn.getAttribute('data-category') === category) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            tab.classList.add('active');
            
            // Filter items
            filterItems(category);
        });
    });

    // Show all items initially with animation
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
} 