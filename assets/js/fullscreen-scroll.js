// Fullscreen Seamless Scrolling JavaScript

class FullscreenScroll {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 30;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.wheelTimeout = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Get all main sections in order, avoiding duplicates
        const sectionSelectors = [
            '#hero',
            '#about', 
            '#journey',
            '#skills',
            '#portfolio',
            '#recent-activity',
            '#contact'
        ];
        
        this.sections = [];
        sectionSelectors.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                this.sections.push(section);
            }
        });
        
        if (this.sections.length === 0) {
            console.log('No sections found for fullscreen scroll');
            return;
        }
        
        console.log(`Found ${this.sections.length} sections for fullscreen scroll:`, 
            Array.from(this.sections).map(s => `${s.id || 'no-id'} (${s.className})`));
        
        // Enable fullscreen scroll mode
        document.documentElement.classList.add('fullscreen-scroll-active');
        
        // Ensure about section is always visible
        this.ensureAboutSectionVisibility();
        
        // Create scroll indicator dots
        this.createScrollIndicator();
        
        // Add event listeners
        this.addScrollListeners();
        this.addTouchListeners();
        this.addKeyboardListeners();
        this.addNavigationListeners();
        
        // Update initial state
        this.updateActiveSection();
        
        // Double-check about section after a brief delay
        setTimeout(() => {
            this.ensureAboutSectionVisibility();
        }, 500);
        
        // Also check after ScrollReveal initializes
        setTimeout(() => {
            this.ensureAboutSectionVisibility();
        }, 1500);
        
        console.log('Fullscreen scroll initialized');
    }
    
    createScrollIndicator() {
        // Create scroll indicator container
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.setAttribute('aria-label', 'Section navigation');
        
        // Create dots for each section
        this.sections.forEach((section, index) => {
            const dot = document.createElement('button');
            dot.className = 'scroll-dot';
            dot.dataset.section = index;
            dot.setAttribute('aria-label', `Go to section ${index + 1}`);
            dot.setAttribute('type', 'button');
            
            // Add click handler
            dot.addEventListener('click', () => {
                this.scrollToSection(index);
            });
            
            indicator.appendChild(dot);
        });
        
        document.body.appendChild(indicator);
        this.scrollDots = indicator.querySelectorAll('.scroll-dot');
    }
    
    addScrollListeners() {
        // Throttled scroll listener
        window.addEventListener('scroll', this.throttle(() => {
            // Only update if we're not currently programmatically scrolling
            if (!this.isScrolling) {
                this.updateActiveSection();
            }
        }, 100));
        
        // Mouse wheel listener for seamless one-section-at-a-time scrolling
        window.addEventListener('wheel', (e) => {
            // Prevent default browser scrolling
            e.preventDefault();
            
            if (this.isScrolling) return;
            
            // Respect reduced motion preference
            if (this.reducedMotion) return;
            
            // Debounce wheel events to prevent too rapid firing
            clearTimeout(this.wheelTimeout);
            this.wheelTimeout = setTimeout(() => {
                // Determine scroll direction
                const direction = e.deltaY > 0 ? 1 : -1;
                
                // Handle section scroll
                this.handleSectionScroll(direction);
            }, 50); // Reduced debounce time for more responsiveness
        }, { passive: false });
    }
    
    addTouchListeners() {
        // Touch start
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        });
        
        // Touch end
        document.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;
            
            this.touchEndY = e.changedTouches[0].clientY;
            const swipeDistance = this.touchStartY - this.touchEndY;
            
            // Check if swipe is significant enough
            if (Math.abs(swipeDistance) > this.minSwipeDistance) {
                const direction = swipeDistance > 0 ? 1 : -1;
                this.handleSectionScroll(direction);
            }
        });
    }
    
    addKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.isScrolling) return;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    this.handleSectionScroll(1);
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.handleSectionScroll(-1);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.scrollToSection(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.scrollToSection(this.sections.length - 1);
                    break;
            }
        });
    }
    
    addNavigationListeners() {
        // Handle navigation menu clicks
        const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Find the index of the target section
                    const sectionIndex = Array.from(this.sections).findIndex(section => {
                        return section.id === targetId || section.classList.contains(`${targetId}-section`);
                    });
                    
                    if (sectionIndex !== -1) {
                        this.scrollToSection(sectionIndex);
                    }
                }
            });
        });
    }
    
    handleSectionScroll(direction) {
        const newSection = this.currentSection + direction;
        
        // Check bounds
        if (newSection >= 0 && newSection < this.sections.length) {
            this.scrollToSection(newSection);
        }
    }
    
    scrollToSection(index) {
        if (this.isScrolling || index < 0 || index >= this.sections.length) return;
        
        this.isScrolling = true;
        this.currentSection = index;
        
        // Get the target section
        const targetSection = this.sections[index];
        
        // Calculate scroll position
        const targetTop = targetSection.offsetTop;
        
        console.log(`Scrolling to section ${index} (${targetSection.id}), targetTop: ${targetTop}, current: ${window.pageYOffset}`);
        
        // Force scroll to section using multiple methods for reliability
        // Method 1: Native scrollTo with immediate fallback
        const startPos = window.pageYOffset;
        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
        
        // Check if scroll started, if not use fallback immediately
        setTimeout(() => {
            if (Math.abs(window.pageYOffset - startPos) < 10) {
                console.log('Native scroll failed, using fallback');
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
        
        // Method 2: Alternative scroll approach
        // Using both scrollTo and scrollIntoView for maximum compatibility
        
        // Method 3: Manual polyfill as backup
        if (!window.CSS || !window.CSS.supports('scroll-behavior', 'smooth')) {
            this.smoothScrollPolyfill(targetTop);
        }
        
        // Update active dot
        this.updateScrollDots();
        
        // Reset scrolling flag after animation (faster for more responsive scrolling)
        setTimeout(() => {
            this.isScrolling = false;
            // Force update active section after scrolling is complete
            this.updateActiveSection();
            console.log(`Scrolling to section ${index} completed`);
        }, 800); // Increased timeout to ensure scrolling completes
    }
    
    updateActiveSection() {
        if (this.isScrolling) return;
        
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        console.log(`Current scroll position: ${scrollPosition}`);
        
        // Find which section we're currently viewing
        let closestSection = 0;
        let closestDistance = Math.abs(scrollPosition - this.sections[0].offsetTop);
        
        for (let i = 1; i < this.sections.length; i++) {
            const section = this.sections[i];
            const sectionTop = section.offsetTop;
            const distance = Math.abs(scrollPosition - sectionTop);
            
            console.log(`Section ${i} (${section.id}): top=${sectionTop}, distance=${distance}`);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = i;
            }
        }
        
        if (this.currentSection !== closestSection) {
            console.log(`Section changed from ${this.currentSection} to ${closestSection}`);
            this.currentSection = closestSection;
            this.updateScrollDots();
        }
    }
    
    updateScrollDots() {
        if (!this.scrollDots) return;
        
        this.scrollDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSection);
        });
    }
    
    // Smooth scroll polyfill for browsers that don't support scroll-behavior
    smoothScrollPolyfill(targetTop) {
        const startTop = window.pageYOffset;
        const distance = targetTop - startTop;
        const duration = 800;
        const startTime = performance.now();
        
        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-cubic)
            const easing = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, startTop + (distance * easing));
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        requestAnimationFrame(animateScroll);
    }
    
    // Ensure about section is always visible (fix for ScrollReveal conflicts)
    ensureAboutSectionVisibility() {
        const aboutSection = document.querySelector('#about, .about-section');
        const aboutContent = document.querySelector('.about-content');
        
        if (aboutSection) {
            // Override any hidden styles
            aboutSection.style.display = 'flex';
            aboutSection.style.visibility = 'visible';
            aboutSection.style.opacity = '1';
            aboutSection.style.transform = 'none';
        }
        
        // Fix the section title specifically
        const aboutTitle = document.querySelector('#about .section-title, .about-section .section-title');
        if (aboutTitle) {
            aboutTitle.style.display = 'block';
            aboutTitle.style.visibility = 'visible';
            aboutTitle.style.opacity = '1';
            aboutTitle.style.transform = 'none';
            aboutTitle.style.color = 'var(--text-color)';
            console.log('About title visibility fixed');
        }
        
        if (aboutContent) {
            // Override ScrollReveal hiding
            aboutContent.style.visibility = 'visible';
            aboutContent.style.opacity = '1';
            aboutContent.style.transform = 'none';
            
            // Force all about content elements to be visible
            const aboutElements = aboutContent.querySelectorAll('*');
            aboutElements.forEach(element => {
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                element.style.transform = 'none';
            });
        }
        
        // Also ensure about interests are visible
        const aboutInterests = document.querySelector('.about-interests');
        if (aboutInterests) {
            aboutInterests.style.display = 'flex';
            aboutInterests.style.visibility = 'visible';
            aboutInterests.style.opacity = '1';
            aboutInterests.style.transform = 'none';
        }
        
        // Ensure all section titles are visible
        const allSectionTitles = document.querySelectorAll('.section-title');
        allSectionTitles.forEach(title => {
            title.style.display = 'block';
            title.style.visibility = 'visible';
            title.style.opacity = '1';
            title.style.transform = 'none';
        });
        
        console.log('About section and all titles visibility ensured');
    }
    
    // Utility function for throttling
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize fullscreen scroll when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FullscreenScroll();
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    new FullscreenScroll();
}
