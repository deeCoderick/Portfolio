// Handle skill item clicks
document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            const skillName = item.querySelector('span').textContent.trim();
            // Store the selected skill in sessionStorage
            sessionStorage.setItem('selectedSkill', skillName);
            
            // Get the portfolio section
            const portfolioSection = document.querySelector('#portfolio');
            
            // If we're on the same page, scroll and filter
            if (portfolioSection) {
                portfolioSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    filterProjectsBySkill(skillName);
                }, 500); // Wait for scroll to complete
            } else {
                // If we're on a different page, navigate to the portfolio section
                const currentPath = window.location.pathname;
                const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                window.location.href = basePath + 'index.html#portfolio';
            }
        });
    });

    // Check if we have a selected skill and we're at the portfolio section
    if (sessionStorage.getItem('selectedSkill') && 
        (window.location.hash === '#portfolio' || document.querySelector('#portfolio'))) {
        const selectedSkill = sessionStorage.getItem('selectedSkill');
        // Small delay to ensure the page has loaded
        setTimeout(() => {
            const portfolioSection = document.querySelector('#portfolio');
            if (portfolioSection) {
                portfolioSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    filterProjectsBySkill(selectedSkill);
                }, 500);
            }
        }, 100);
    }
});

// Function to filter projects by skill
function filterProjectsBySkill(skill) {
    const projectItems = document.querySelectorAll('.portfolio-item');
    const portfolioTabs = document.querySelectorAll('.portfolio-tab');
    let hasMatches = false;
    
    // Update active tab if it exists
    portfolioTabs.forEach(tab => {
        if (tab.textContent.trim().toLowerCase() === skill.toLowerCase()) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Filter projects
    projectItems.forEach(item => {
        const projectTags = Array.from(item.querySelectorAll('.portfolio-tags span'))
            .map(tag => tag.textContent.trim().toLowerCase());
        
        if (projectTags.includes(skill.toLowerCase())) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease forwards';
            hasMatches = true;
        } else {
            item.style.display = 'none';
            item.style.animation = '';
        }
    });

    // Show message if no matches found
    const noResultsMsg = document.querySelector('.no-results-message') || createNoResultsMessage();
    if (!hasMatches) {
        noResultsMsg.style.display = 'block';
        noResultsMsg.textContent = `No projects found with ${skill} skill. Showing all projects.`;
        setTimeout(() => {
            showAllProjects();
            noResultsMsg.style.display = 'none';
        }, 3000);
    } else {
        noResultsMsg.style.display = 'none';
    }

    // Scroll to portfolio section
    const portfolioSection = document.querySelector('#portfolio') || document.querySelector('.portfolio-section');
    if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Clear the selected skill after filtering
    sessionStorage.removeItem('selectedSkill');
}

// Function to show all projects
function showAllProjects() {
    const projectItems = document.querySelectorAll('.portfolio-item');
    const portfolioTabs = document.querySelectorAll('.portfolio-tab');
    
    projectItems.forEach(item => {
        item.style.display = 'block';
        item.style.animation = 'fadeIn 0.5s ease forwards';
    });
    
    portfolioTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.trim().toLowerCase() === 'all') {
            tab.classList.add('active');
        }
    });
}

// Function to create no results message element
function createNoResultsMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'no-results-message';
    messageDiv.style.cssText = `
        display: none;
        text-align: center;
        padding: 20px;
        color: var(--text-muted);
        font-style: italic;
        margin: 20px 0;
    `;
    
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid) {
        portfolioGrid.parentNode.insertBefore(messageDiv, portfolioGrid);
    }
    
    return messageDiv;
}

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Portfolio navigation and filtering
document.addEventListener('DOMContentLoaded', function() {
    // Handle portfolio navigation buttons
    const portfolioNavButtons = document.querySelectorAll('.portfolio-nav-button');
    
    portfolioNavButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const category = this.getAttribute('data-category');
            
            // Always allow shopping links to navigate directly
            if (category === 'shopping') {
                return; // Don't prevent default for shopping category
            }
            
            e.preventDefault();
            const targetPage = getCategoryPage(category);
            
            // If we're already on the target page, just scroll to the section
            if (window.location.pathname.includes(targetPage)) {
                const section = document.querySelector(`#${category}-section`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Navigate to the target page with the category as hash
                window.location.href = `${targetPage}#${category}-section`;
            }
        });
    });
    
    // Handle portfolio tabs filtering
    const portfolioTabs = document.querySelectorAll('.portfolio-tab');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active state
            portfolioTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items with animation
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Check for hash on page load and scroll to section if needed
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }
});

// Helper function to get the appropriate page for each category
function getCategoryPage(category) {
    const pageMap = {
        'tech': 'code.html',
        'sports': 'sports.html',
        'travel': 'travel.html',
        'art': 'art.html',
        'books': 'books.html',
        'cooking': 'cooking.html',
        'shopping': 'shopping.html'
    };
    return pageMap[category] || 'index.html';
}

// Journey section animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    const journeyItems = document.querySelectorAll('.journey-item');
    const journeySection = document.querySelector('.journey-section');
    const rocket = document.querySelector('.journey-rocket');
    
    if (!journeySection || !rocket) return;
    
    let journeyStart;
    let journeyEnd;
    let rocketVisible = false;
    
    function updateJourneyBounds() {
        const rect = journeySection.getBoundingClientRect();
        journeyStart = rect.top + window.pageYOffset;
        journeyEnd = rect.bottom + window.pageYOffset - window.innerHeight;
    }
    
    function updateRocketPosition() {
        const scrollPosition = window.pageYOffset;
        
        // Show/hide rocket based on journey section visibility
        if (scrollPosition >= journeyStart - window.innerHeight && scrollPosition <= journeyEnd + window.innerHeight) {
            if (!rocketVisible) {
                rocket.classList.add('visible');
                rocketVisible = true;
            }
            
            // Calculate rocket position
            const progress = (scrollPosition - journeyStart) / (journeyEnd - journeyStart);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            
            // Move rocket from bottom to top as user scrolls down
            const startY = window.innerHeight - 100; // Starting position from bottom
            const endY = 100; // Ending position from top
            const currentY = startY - (startY - endY) * clampedProgress;
            
            rocket.style.top = `${currentY}px`;
            
            // Add floating effect
            const floatOffset = Math.sin(Date.now() / 1000) * 10;
            rocket.style.transform = `translateY(${floatOffset}px)`;
        } else {
            if (rocketVisible) {
                rocket.classList.remove('visible');
                rocketVisible = false;
            }
        }
    }
    
    // Initial setup
    updateJourneyBounds();
    updateRocketPosition();
    
    // Update on scroll
    window.addEventListener('scroll', updateRocketPosition, { passive: true });
    
    // Update bounds on resize
    window.addEventListener('resize', () => {
        updateJourneyBounds();
        updateRocketPosition();
    });

    // Add smooth reveal animations for journey items
    journeyItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    observer.unobserve(item);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px'
        });

        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
        item.style.transitionDelay = `${index * 0.1}s`;

        observer.observe(item);
    });
});

// Back to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (!backToTopButton) {
        console.warn('Back to top button not found in the document');
        return;
    }

    let ticking = false;

    function updateBackToTopButton() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollPosition > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateBackToTopButton();
            });
            ticking = true;
        }
    });

    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initial check
    updateBackToTopButton();
});

// Books category filtering
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-button');
    const bookCards = document.querySelectorAll('.book-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-filter');

            bookCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category').split(' ');
                
                if (category === 'all' || cardCategories.includes(category)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});

// Social sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const socialSidebar = document.querySelector('.social-sidebar');
    
    if (!socialSidebar) return;
    
    function updateSidebar() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Show sidebar when scrolled down and not at the very bottom
        const shouldShow = scrollPosition > 100 && scrollPosition < (documentHeight - windowHeight - 100);
        socialSidebar.classList.toggle('visible', shouldShow);
    }
    
    // Handle scroll with throttling
    let lastScrollTime = 0;
    const throttleDelay = 100; // ms
    
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime >= throttleDelay) {
            lastScrollTime = now;
            updateSidebar();
        }
    }, { passive: true });
    
    // Handle resize
    window.addEventListener('resize', updateSidebar);
    
    // Initial check
    setTimeout(updateSidebar, 1000);
}); 