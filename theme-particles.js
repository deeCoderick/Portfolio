document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
    
    // Create container for particles
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '-1';
    body.appendChild(particleContainer);

    // Create particles based on theme
    function createParticles() {
        particleContainer.innerHTML = ''; // Clear existing particles
        
        if (isLightTheme) {
            // Create falling leaves for nature theme
            for (let i = 0; i < 20; i++) {
                const leaf = document.createElement('div');
                leaf.className = 'nature-particle';
                leaf.style.left = Math.random() * 100 + 'vw';
                leaf.style.animationDelay = Math.random() * 10 + 's';
                leaf.style.opacity = Math.random() * 0.6 + 0.2;
                
                // Create leaf shape
                leaf.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
                leaf.style.backgroundColor = '#2D5A27';
                leaf.style.width = Math.random() * 10 + 10 + 'px';
                leaf.style.height = Math.random() * 10 + 10 + 'px';
                
                particleContainer.appendChild(leaf);
            }
        } else {
            // Create stars for space theme
            for (let i = 0; i < 50; i++) {
                const star = document.createElement('div');
                star.className = 'space-particle';
                star.style.width = Math.random() * 2 + 1 + 'px';
                star.style.height = star.style.width;
                star.style.left = Math.random() * 100 + 'vw';
                star.style.top = Math.random() * 100 + 'vh';
                star.style.animation = `float ${Math.random() * 3 + 2}s infinite`;
                star.style.opacity = Math.random() * 0.7 + 0.3;
                
                particleContainer.appendChild(star);
            }
        }
    }

    // Create initial particles
    createParticles();

    // Update particles when theme changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                const newTheme = document.documentElement.getAttribute('data-theme');
                isLightTheme = newTheme === 'light';
                createParticles();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}); 