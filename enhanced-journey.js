// Enhanced Journey Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Force apply card widths immediately
    function forceCardWidths() {
        const cards = document.querySelectorAll('.journey-card');
        cards.forEach(card => {
            card.style.minWidth = 'calc(40% - 20px)';
            card.style.maxWidth = 'calc(40% - 20px)';
            card.style.flex = '0 0 calc(40% - 20px)';
            card.style.width = 'calc(40% - 20px)';
        });
        
        const carousel = document.querySelector('.journey-carousel');
        if (carousel) {
            carousel.style.gap = '35px';
        }
    }
    
    // Apply immediately and after short delay
    forceCardWidths();
    setTimeout(forceCardWidths, 100);
    setTimeout(forceCardWidths, 500);
    
    const carousel = document.querySelector('.journey-carousel');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const indicators = document.querySelector('.carousel-indicators');
    const cards = Array.from(document.querySelectorAll('.journey-card'));
    
    if (!carousel || !prevButton || !nextButton || !indicators) return;
    
    let isScrolling = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let currentIndex = 0;
    
    // Enhanced scroll behavior
    const smoothScrollConfig = {
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
    };
    
    // Set animation delay index for each card
    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
        
        // Add intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });
    
    // Create indicator dots with enhanced functionality
    indicators.innerHTML = '';
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => scrollToCard(index));
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        indicators.appendChild(dot);
    });
    
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    
    // Enhanced scroll position tracking
    const updateActiveIndicators = () => {
        const scrollPosition = carousel.scrollLeft;
        const cardWidth = cards[0]?.offsetWidth || 0;
        const gap = 35; // Updated gap from CSS
        const totalCardWidth = cardWidth + gap;
        
        const newIndex = Math.round(scrollPosition / totalCardWidth);
        currentIndex = Math.max(0, Math.min(newIndex, cards.length - 1));
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Update button states with smooth transitions
        prevButton.style.opacity = currentIndex <= 0 ? '0.4' : '1';
        prevButton.disabled = currentIndex <= 0;
        
        const maxIndex = Math.max(0, cards.length - Math.floor(carousel.clientWidth / totalCardWidth));
        nextButton.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
        nextButton.disabled = currentIndex >= maxIndex;
    };
    
    // Throttled scroll listener for better performance
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (!isScrolling) {
                updateActiveIndicators();
            }
        }, 50);
    });
    
    // Enhanced scroll to card function
    function scrollToCard(index, smooth = true) {
        if (isScrolling) return;
        
        isScrolling = true;
        const cardWidth = cards[0]?.offsetWidth || 0;
        const gap = 35;
        const scrollPosition = index * (cardWidth + gap);
        
        if (smooth) {
            carousel.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            // Reset scrolling flag after animation
            setTimeout(() => {
                isScrolling = false;
                updateActiveIndicators();
            }, 600);
        } else {
            carousel.scrollLeft = scrollPosition;
            isScrolling = false;
            updateActiveIndicators();
        }
    }
    
    // Enhanced button click handlers with momentum
    prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex > 0) {
            scrollToCard(currentIndex - 1);
        }
    });
    
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        const maxIndex = Math.max(0, cards.length - Math.floor(carousel.clientWidth / (cards[0]?.offsetWidth + 35)));
        if (currentIndex < maxIndex) {
            scrollToCard(currentIndex + 1);
        }
    });
    
    // Enhanced mouse wheel support with momentum
    let wheelTimeout;
    carousel.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (wheelTimeout) clearTimeout(wheelTimeout);
        
        const delta = e.deltaY || e.deltaX;
        const scrollSpeed = Math.abs(delta) > 100 ? 2 : 1;
        
        if (delta > 0 && currentIndex < cards.length - 1) {
            scrollToCard(currentIndex + scrollSpeed);
        } else if (delta < 0 && currentIndex > 0) {
            scrollToCard(Math.max(0, currentIndex - scrollSpeed));
        }
        
        wheelTimeout = setTimeout(() => {
            // Allow normal scrolling after wheel interaction
        }, 100);
    }, { passive: false });
    
    // Touch/swipe support for mobile
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < cards.length - 1) {
                // Swipe left - next
                scrollToCard(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous
                scrollToCard(currentIndex - 1);
            }
        }
    }
    
    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (currentIndex > 0) scrollToCard(currentIndex - 1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (currentIndex < cards.length - 1) scrollToCard(currentIndex + 1);
                break;
            case 'Home':
                e.preventDefault();
                scrollToCard(0);
                break;
            case 'End':
                e.preventDefault();
                scrollToCard(cards.length - 1);
                break;
        }
    });
    
    // Auto-scroll functionality (optional)
    let autoScrollInterval;
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
            const nextIndex = currentIndex >= cards.length - 1 ? 0 : currentIndex + 1;
            scrollToCard(nextIndex);
        }, 8000); // 8 seconds interval
    };
    
    const stopAutoScroll = () => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    };
    
    // Start auto-scroll and pause on interaction
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
    carousel.addEventListener('touchstart', stopAutoScroll);
    
    // Responsive handling
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            forceCardWidths(); // Reapply card widths on resize
            updateActiveIndicators();
            scrollToCard(currentIndex, false); // Reposition without animation
        }, 250);
    });
    
    // Enhanced particle system for journey section
    const journeySection = document.querySelector('.journey-section');
    if (journeySection) {
        createEnhancedParticles(journeySection);
    }
    
    function createEnhancedParticles(container) {
        const particleCount = 30;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('journey-particle');
            
            // Random properties
            const size = Math.random() * 4 + 1;
            const opacity = Math.random() * 0.6 + 0.2;
            const speed = Math.random() * 20 + 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Animation
            particle.style.animation = `particleFloat ${speed}s ease-in-out infinite`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            
            container.appendChild(particle);
            particles.push({
                element: particle,
                speed: speed,
                size: size
            });
        }
        
        // Intersection observer for particles
        const particleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const isVisible = entry.isIntersecting;
                particles.forEach(particle => {
                    particle.element.style.animationPlayState = isVisible ? 'running' : 'paused';
                });
            });
        }, { threshold: 0.1 });
        
        particleObserver.observe(container);
    }
    
    // Add CSS for particle animation if not present
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { 
                    transform: translateY(0px) translateX(0px) rotate(0deg);
                    opacity: 0.2;
                }
                25% { 
                    transform: translateY(-20px) translateX(10px) rotate(90deg);
                    opacity: 0.8;
                }
                50% { 
                    transform: translateY(-40px) translateX(-10px) rotate(180deg);
                    opacity: 0.4;
                }
                75% { 
                    transform: translateY(-20px) translateX(15px) rotate(270deg);
                    opacity: 0.6;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize
    forceCardWidths(); // Apply card widths again during initialization
    updateActiveIndicators();
    startAutoScroll();
    
    // Performance monitoring
    console.info('Enhanced Journey Carousel initialized with smooth scrolling and touch support');
}); 