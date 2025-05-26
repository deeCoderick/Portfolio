/**
 * Reusable Navigation Component
 * Eliminates duplication across 15+ HTML files
 */

class NavigationComponent {
    constructor(options = {}) {
        this.options = {
            currentPage: options.currentPage || 'home',
            showActivity: options.showActivity !== false,
            logoText: options.logoText || 'ADSN',
            ...options
        };
        this.init();
    }

    getNavigationHTML() {
        const navItems = [
            { href: this.getHref('#about'), icon: 'fas fa-user', text: 'About' },
            { href: this.getHref('#journey'), icon: 'fas fa-road', text: 'Journey' },
            { href: this.getHref('#skills'), icon: 'fas fa-code', text: 'Skills' },
            { href: this.getHref('#portfolio'), icon: 'fas fa-briefcase', text: 'Portfolio' },
            ...(this.options.showActivity ? [{ href: 'activity.html', icon: 'fas fa-history', text: 'Recent Activity' }] : []),
            { href: this.getHref('#contact'), icon: 'fas fa-envelope', text: 'Contact' }
        ];

        return `
            <nav class="navigation">
                <div class="logo-profile">
                    <a href="index.html" class="logo-container">
                        <div class="profile-photo">
                            <img src="assets/images/ProfileIcon.jpeg" alt="Ananth Deepak Sharma Nanduri">
                        </div>
                        <div class="logo-text">${this.options.logoText}</div>
                    </a>
                </div>

                <div class="nav-container">
                    <ul class="nav-links">
                        ${navItems.map(item => `
                            <li><a href="${item.href}" class="nav-item ${this.isActive(item.href) ? 'active' : ''}">
                                <i class="${item.icon}"></i> ${item.text}
                            </a></li>
                        `).join('')}
                    </ul>
                    
                    <div class="theme-toggle-container">
                        <button class="theme-toggle" aria-label="Toggle theme">
                            <div class="toggle-icons">
                                <i class="fas fa-sun"></i>
                                <i class="fas fa-moon"></i>
                            </div>
                        </button>
                    </div>
                    
                    <button class="nav-toggle" aria-label="Toggle navigation">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </nav>
            <div class="navigation-top-space"></div>
        `;
    }

    getHref(anchor) {
        return this.options.currentPage === 'home' ? anchor : `index.html${anchor}`;
    }

    isActive(href) {
        // Simple active state logic - can be enhanced
        return false;
    }

    init() {
        // Insert navigation at the beginning of body
        document.addEventListener('DOMContentLoaded', () => {
            const existingNav = document.querySelector('.navigation');
            if (!existingNav) {
                document.body.insertAdjacentHTML('afterbegin', this.getNavigationHTML());
                this.initializeThemeToggle();
                this.initializeMobileToggle();
            }
        });
    }

    initializeThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    initializeMobileToggle() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    }
}

// Auto-initialize if not manually configured
if (typeof window !== 'undefined' && !window.navigationInitialized) {
    window.navigationInitialized = true;
    new NavigationComponent();
}

// Export for manual initialization
window.NavigationComponent = NavigationComponent; 