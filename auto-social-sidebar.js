// Social Links Configuration
const socialLinks = {
    personal: {
        instagram: "https://www.instagram.com/de__maverick/",
        youtube: "https://youtube.com/@ananthdeepaksharma?si=O_5Ws_L86XfMth2q",
        twitter: "https://x.com/DeepakNand57581",
        tiktok: "placeholder",
        github: "https://github.com/deeCoderick",
        email: "ananth.deepaksharma@gmail.com",
        threads: "https://www.threads.net/@de__maverick"
    },
    coding: {
        instagram: "https://www.instagram.com/de_coderick/",
        youtube: "https://youtube.com/@softwareengineeringandco-ss3dy?si=k5UsB9EJRyG-bzdJ",
        twitter: "https://x.com/AnanthDeepak",
        tiktok: "placeholder",
        medium: "https://medium.com/@ananth.deepaksharma",
        linkedin: "https://www.linkedin.com/in/ananthdeepaks/",
        email: "ananth.deepaksharma2@gmail.com",
        github: "https://github.com/deCoderick",
        threads: "https://www.threads.net/@de_coderick"
    },
    sports: {
        instagram: "https://www.instagram.com/de_gamerick/",
        youtube: "https://youtube.com/@sportsandphysical-rn7gt?si=S_mB_ziNofWZjbG4",
        twitter: "placeholder",
        tiktok: "placeholder",
        email: "ananth.deepaksharma3@gmail.com",
        threads: "https://www.threads.net/@de_gamerick"
    },
    travel: {
        instagram: "https://www.instagram.com/de_wanderick/",
        twitter: "placeholder",
        tiktok: "placeholder",
        email: "ananth.deepaksharma3@gmail.com",
        threads: "https://www.threads.net/@de_wanderick"
    },
    art: {
        instagram: "https://www.instagram.com/de_arterick/",
        youtube: "https://youtube.com/@ananthdeepaksharma-kw6zp?si=v9_p-BaSaQTaWVhI",
        twitter: "placeholder",
        tiktok: "placeholder",
        email: "ananth.deepaksharma3@gmail.com",
        threads: "https://www.threads.net/@de_arterick"
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Ensure Font Awesome is loaded
    const hasFontAwesome = document.querySelector('link[href*="font-awesome"]');
    if (!hasFontAwesome) {
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fontAwesomeLink);
        
        const fontAwesomeBrandsLink = document.createElement('link');
        fontAwesomeBrandsLink.rel = 'stylesheet';
        fontAwesomeBrandsLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/brands.min.css';
        document.head.appendChild(fontAwesomeBrandsLink);
    }

    // Add required CSS for social sidebar (ensuring it's always visible in sub-pages)
    const cssForSubpages = `
        .social-sidebar {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 15px 10px;
            background: rgba(30, 30, 50, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 15px 0 0 15px;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 999;
            transition: all 0.3s ease;
            opacity: 1 !important; /* Force visibility */
            pointer-events: auto !important; /* Allow interactions */
            transform: translate(0, -50%) !important; /* Force position */
        }
        
        .social-sidebar a {
            width: 38.5px;
            height: 38.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 1.21rem;
        }
        
        .social-sidebar a:hover {
            transform: translateX(-5px);
        }
        
        /* Brand-specific hover colors */
        .social-sidebar a[href*="linkedin"]:hover {
            background: #0077b5;
            box-shadow: 0 0 20px rgba(0, 119, 181, 0.4);
        }
        
        .social-sidebar a[href*="github"]:hover {
            background: #333;
            box-shadow: 0 0 20px rgba(51, 51, 51, 0.4);
        }
        
        .social-sidebar a[href*="twitter"]:hover {
            background: #1DA1F2;
            box-shadow: 0 0 20px rgba(29, 161, 242, 0.4);
        }
        
        .social-sidebar a[href*="instagram"]:hover {
            background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
            box-shadow: 0 0 20px rgba(225, 48, 108, 0.4);
        }
        
        .social-sidebar a[href*="youtube"]:hover {
            background: #FF0000;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
        }
        
        .social-sidebar a[href*="medium"]:hover {
            background: #12100E;
            box-shadow: 0 0 20px rgba(18, 16, 14, 0.4);
        }
        
        .social-sidebar a[href*="threads"]:hover {
            background: #000;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
        }
        
        .social-sidebar a[href*="tiktok"]:hover {
            background: linear-gradient(45deg, #000000, #EE1D52, #69C9D0);
            box-shadow: 0 0 20px rgba(238, 29, 82, 0.4);
        }
        
        /* Light theme adjustments */
        html[data-theme="light"] .social-sidebar {
            background: rgba(255, 255, 255, 0.8);
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
            border-left: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        html[data-theme="light"] .social-sidebar a {
            background: rgba(0, 0, 0, 0.05);
            color: #333;
        }
        
        html[data-theme="light"] .social-sidebar a:hover {
            color: #fff;
        }
        
        @media (max-width: 768px) {
            .social-sidebar {
                padding: 10px 8px;
            }
            
            .social-sidebar a {
                width: 32px;
                height: 32px;
                font-size: 1rem;
            }
        }
    `;
    
    // Add styles to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = cssForSubpages;
    document.head.appendChild(styleElement);
    
    // Check if we're on a subpage (not index.html or /)
    const path = window.location.pathname;
    const isSubpage = !path.endsWith('/') && !path.endsWith('index.html') && path !== '/';
    
    // Determine which category to use based on page URL
    let category = 'personal';
    
    if (window.location.pathname.includes('code') || window.location.pathname.includes('tech')) {
        category = 'coding';
    } else if (window.location.pathname.includes('sports')) {
        category = 'sports';
    } else if (window.location.pathname.includes('travel')) {
        category = 'travel';
    } else if (window.location.pathname.includes('art')) {
        category = 'art';
    }
    
    // Create or get social sidebar element
    let socialSidebar = document.querySelector('.social-sidebar');
    
    if (!socialSidebar) {
        // console.log('Creating social sidebar');
        socialSidebar = document.createElement('div');
        socialSidebar.className = 'social-sidebar';
        document.body.appendChild(socialSidebar);
    }
    
    // Clear existing content
    socialSidebar.innerHTML = '';
    
    // Add links based on category
    const links = socialLinks[category];
    
    if (links.instagram) {
        addSocialLink(socialSidebar, links.instagram, 'fa-instagram');
    }
    
    if (links.youtube) {
        addSocialLink(socialSidebar, links.youtube, 'fa-youtube');
    }
    
    if (links.twitter && links.twitter !== 'placeholder') {
        addSocialLink(socialSidebar, links.twitter, 'fa-twitter');
    }
    
    if (links.tiktok && links.tiktok !== 'placeholder') {
        addSocialLink(socialSidebar, links.tiktok, 'fa-tiktok');
    }
    
    if (links.github) {
        addSocialLink(socialSidebar, links.github, 'fa-github');
    }
    
    if (links.linkedin) {
        addSocialLink(socialSidebar, links.linkedin, 'fa-linkedin');
    }
    
    if (links.medium && links.medium !== 'placeholder') {
        addSocialLink(socialSidebar, links.medium, 'fa-medium');
    }
    
    if (links.threads) {
        addSocialLink(socialSidebar, links.threads, 'fa-threads');
    }
    
    if (links.email) {
        addSocialLink(socialSidebar, `mailto:${links.email}`, 'fa-envelope');
    }
    
    // For subpages, just make sure the sidebar is visible
    if (isSubpage) {
        socialSidebar.classList.add('visible');
    } else {
        // On main pages, use scroll-based visibility
        setTimeout(() => {
            const introSection = document.querySelector('.hero-section') || document.querySelector('header');
            const footer = document.querySelector('footer');
            
            if (introSection && footer) {
                updateSidebarVisibility();
                
                // Update on scroll
                window.addEventListener('scroll', updateSidebarVisibility);
                
                // Update on resize
                window.addEventListener('resize', updateSidebarVisibility);
            } else {
                // If no intro section or footer, just show the sidebar
                socialSidebar.classList.add('visible');
            }
        }, 500);
        
        function updateSidebarVisibility() {
            const introSection = document.querySelector('.hero-section') || document.querySelector('header');
            const footer = document.querySelector('footer');
            
            if (!introSection || !footer) {
                socialSidebar.classList.add('visible');
                return;
            }
            
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
    }
});

// Helper function to add a social link
function addSocialLink(container, href, iconClass) {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    const icon = document.createElement('i');
    icon.className = `fab ${iconClass}`;
    if (iconClass === 'fa-envelope') {
        icon.className = `fas ${iconClass}`;
    }
    
    link.appendChild(icon);
    container.appendChild(link);
} 