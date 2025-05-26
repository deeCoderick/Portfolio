/**
 * Reusable Project Template Component
 * Generates project pages dynamically with consistent structure and styling
 */

class ProjectTemplate {
    constructor(projectData) {
        this.data = projectData;
        this.validateData();
    }

    validateData() {
        const required = ['title', 'date', 'techStack', 'overview', 'features'];
        const missing = required.filter(field => !this.data[field]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }
    }

    generateHTML() {
        return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    ${this.generateHead()}
</head>
<body>
    ${this.generateNavigation()}
    ${this.generateProjectSection()}
    ${this.generateSocialSidebar()}
    ${this.generateBackToTop()}
    ${this.generateChatbot()}
    ${this.generateScripts()}
</body>
</html>`;
    }

    generateHead() {
        return `<!-- Google Analytics Tag - Only loads in production -->
    <script>
        if (!window.location.hostname.includes('localhost') && 
            !window.location.hostname.includes('127.0.0.1')) {
            
            const gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-R656C658VX';
            document.head.appendChild(gaScript);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R656C658VX');
        }
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.data.title} - Ananth Deepak Sharma Nanduri</title>
    <link rel="icon" type="image/png" sizes="32x32" href="assets/Logo/logo.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/Logo/logo.png">
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    ${this.generateProjectStyles()}`;
    }

    generateProjectStyles() {
        return `<style>
        /* Project-specific styles */
        .project-details {
            padding-top: 80px;
            min-height: 100vh;
            background: #0c0c14;
            color: #ffffff;
        }

        .project-header {
            text-align: center;
            margin-bottom: 3rem;
            position: relative;
        }

        .project-header h1 {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, #6c8aff, #ff6b6b);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            max-width: 1200px;
            margin: 0 auto 1.5rem;
            padding: 0 2rem;
        }

        .project-meta {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .project-date {
            font-size: 1.2rem;
            color: #6c8aff;
            font-weight: 500;
        }

        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            justify-content: center;
        }

        .tech-tag {
            padding: 0.5rem 1rem;
            background: rgba(108, 138, 255, 0.1);
            color: #6c8aff;
            border-radius: 20px;
            font-size: 0.9rem;
            border: 1px solid rgba(108, 138, 255, 0.2);
            transition: all 0.3s ease;
        }

        .tech-tag:hover {
            background: rgba(108, 138, 255, 0.2);
            transform: translateY(-2px);
        }

        .project-content {
            background: rgba(255, 255, 255, 0.02);
            padding: 3rem;
            border-radius: 20px;
            margin-top: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            max-width: 1200px;
            margin: 2rem auto;
        }

        .project-description {
            max-width: 900px;
            margin: 0 auto;
            color: #ffffff;
        }

        .project-description h2 {
            font-size: 2rem;
            margin: 2.5rem 0 1.5rem;
            color: #6c8aff;
            border-bottom: 2px solid rgba(108, 138, 255, 0.2);
            padding-bottom: 0.5rem;
        }

        .project-description h3 {
            font-size: 1.5rem;
            margin: 2rem 0 1rem;
            color: #ff6b6b;
        }

        .project-description p {
            font-size: 1.1rem;
            line-height: 1.8;
            margin-bottom: 1.5rem;
            color: rgba(255, 255, 255, 0.9);
        }

        .project-description ul {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
        }

        .project-description li {
            margin-bottom: 0.8rem;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
        }

        .project-description strong {
            color: #ff6b6b;
            font-weight: 600;
        }

        .project-image {
            max-width: 800px;
            width: 100%;
            margin: 0 auto 2rem;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border-radius: 15px;
        }

        .project-portrait {
            width: 100%;
            height: auto;
            display: block;
            object-fit: cover;
            max-height: 500px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .project-details {
                padding-top: 60px;
            }

            .project-header h1 {
                font-size: 2.5rem;
            }

            .project-content {
                margin: 1rem auto;
                padding: 2rem;
            }

            .tech-stack {
                gap: 0.5rem;
            }

            .tech-tag {
                padding: 0.4rem 0.8rem;
                font-size: 0.8rem;
            }

            .project-image {
                max-width: 100%;
                margin: 0 1rem 2rem;
            }
            
            .project-portrait {
                max-height: 400px;
            }
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        /* Back to top button styles */
        .back-to-top-container {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 1000;
        }
        
        .back-to-top {
            background: var(--primary-color, #6c8aff);
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
        }
        
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            background: var(--secondary-color, #ff6b6b);
            transform: translateY(-5px);
        }
    </style>`;
    }

    generateNavigation() {
        return `<!-- Navigation -->
    <header>
        <nav>
            <div class="logo-container">
                <img src="assets/Logo/logo.png" alt="Logo" class="logo-image">
                <span class="logo-text">De</span>
            </div>
            <ul>
                <li><a href="index.html#about"><i class="fas fa-user"></i> About</a></li>
                <li><a href="index.html#skills"><i class="fas fa-code"></i> Skills</a></li>
                <li><a href="index.html#portfolio"><i class="fas fa-briefcase"></i> Portfolio</a></li>
                <li><a href="index.html#contact"><i class="fas fa-envelope"></i> Contact</a></li>
            </ul>
            <div class="theme-toggle-container">
                <button class="theme-toggle" aria-label="Toggle theme">
                    <div class="toggle-icons">
                        <i class="fas fa-sun"></i>
                        <i class="fas fa-moon"></i>
                    </div>
                </button>
            </div>
        </nav>
    </header>`;
    }

    generateProjectSection() {
        return `<!-- Project Details Section -->
    <section id="${this.data.id || 'project'}" class="project-details">
        <div class="container">
            <div class="project-header">
                ${this.generateProjectImage()}
                <h1>${this.data.title}</h1>
                <div class="project-meta">
                    <span class="project-date">${this.data.date}</span>
                    <div class="tech-stack">
                        ${this.data.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>

            <div class="project-content">
                <div class="project-description">
                    ${this.generateProjectContent()}
                </div>
            </div>
        </div>
    </section>`;
    }

    generateProjectImage() {
        if (!this.data.image) return '';
        
        return `<div class="project-image">
                    <img src="${this.data.image}" alt="${this.data.title}" class="project-portrait">
                </div>`;
    }

    generateProjectContent() {
        let content = `<h2>Project Overview</h2>
                      <p>${this.data.overview}</p>`;

        if (this.data.features && this.data.features.length > 0) {
            content += `<h2>Key Features</h2>
                       <ul>
                           ${this.data.features.map(feature => `<li>${feature}</li>`).join('')}
                       </ul>`;
        }

        if (this.data.architecture) {
            content += `<h2>Technical Architecture</h2>`;
            if (typeof this.data.architecture === 'string') {
                content += `<p>${this.data.architecture}</p>`;
            } else if (Array.isArray(this.data.architecture)) {
                content += `<ul>
                               ${this.data.architecture.map(item => `<li>${item}</li>`).join('')}
                           </ul>`;
            } else if (typeof this.data.architecture === 'object') {
                Object.entries(this.data.architecture).forEach(([key, value]) => {
                    content += `<h3>${key}</h3>`;
                    if (Array.isArray(value)) {
                        content += `<ul>
                                       ${value.map(item => `<li>${item}</li>`).join('')}
                                   </ul>`;
                    } else {
                        content += `<p>${value}</p>`;
                    }
                });
            }
        }

        if (this.data.uniqueAspects && this.data.uniqueAspects.length > 0) {
            content += `<h2>Unique Aspects</h2>
                       <ul>
                           ${this.data.uniqueAspects.map(aspect => `<li>${aspect}</li>`).join('')}
                       </ul>`;
        }

        if (this.data.futureEnhancements && this.data.futureEnhancements.length > 0) {
            content += `<h2>Future Enhancements</h2>
                       <ul>
                           ${this.data.futureEnhancements.map(enhancement => `<li>${enhancement}</li>`).join('')}
                       </ul>`;
        }

        // Add any custom sections
        if (this.data.customSections) {
            this.data.customSections.forEach(section => {
                content += `<h2>${section.title}</h2>`;
                if (section.content) {
                    content += section.content;
                }
            });
        }

        return content;
    }

    generateSocialSidebar() {
        return `<!-- Social Sidebar -->
    <div class="social-sidebar">
        <a href="https://linkedin.com/in/ananthdeepaks/" target="_blank"><i class="fab fa-linkedin"></i></a>
        <a href="https://github.com/deeCoderick" target="_blank"><i class="fab fa-github"></i></a>
        <a href="https://x.com/DeepakNand57581" target="_blank"><i class="fab fa-twitter"></i></a>
        <a href="https://www.instagram.com/de__maverick/" target="_blank"><i class="fab fa-instagram"></i></a>
        <a href="https://youtube.com/@ananthdeepaksharma?si=O_5Ws_L86XfMth2q" target="_blank"><i class="fab fa-youtube"></i></a>
        <a href="https://www.threads.net/@de__maverick" target="_blank"><i class="fa-brands fa-threads"></i></a>
        <a href="https://medium.com/@ananth.deepaksharma" target="_blank"><i class="fab fa-medium"></i></a>
        <a href="placeholder" target="_blank"><i class="fab fa-tiktok"></i></a>
    </div>`;
    }

    generateBackToTop() {
        return `<!-- Back to top button -->
    <div class="back-to-top-container">
        <button class="back-to-top" aria-label="Back to top">
            <i class="fas fa-chevron-up"></i>
        </button>
    </div>`;
    }

    generateChatbot() {
        return `<!-- Chatbot Container -->
    <div class="chatbot-container">
        <div class="chatbot-icon">
            <img src="assets/images/DonnaPaulsen.jpg" alt="Donna">
        </div>
        <div class="chatbot-window">
            <div class="chatbot-header">
                <img src="assets/images/DonnaPaulsen.jpg" alt="Donna">
                <h3>Chat with <span>Donna</span></h3>
                <button class="chatbot-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="chatbot-messages">
                <!-- Messages will be added dynamically -->
            </div>
            <div class="chatbot-input">
                <input type="text" placeholder="Type your message...">
                <button><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    </div>`;
    }

    generateScripts() {
        return `<script src="chatbot.js"></script>
    <!-- Auto-generated social sidebar -->
    <script src="auto-social-sidebar.js"></script>
    <script src="back-to-top.js"></script>
    <script src="theme.js"></script>
    
    <!-- Debug script to ensure the button displays -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Force button visibility
            const backToTopBtn = document.querySelector('.back-to-top');
            const backToTopContainer = document.querySelector('.back-to-top-container');
            
            if (backToTopBtn && backToTopContainer) {
                // Apply direct styles
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
                
                // Force visibility after scroll
                window.addEventListener('scroll', function() {
                    if (window.pageYOffset > 100) {
                        backToTopBtn.style.opacity = '1';
                        backToTopBtn.style.visibility = 'visible';
                    } else {
                        backToTopBtn.style.opacity = '0';
                        backToTopBtn.style.visibility = 'hidden';
                    }
                });
                
                // Manually trigger scroll event
                window.dispatchEvent(new Event('scroll'));
            }
        });
    </script>`;
    }

    // Method to save the generated HTML to a file
    saveToFile(filename) {
        const html = this.generateHTML();
        // This would typically be handled by a build process or server
        return html;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectTemplate;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.ProjectTemplate = ProjectTemplate;
} 