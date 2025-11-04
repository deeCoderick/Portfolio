// Theme management for portfolio website

// Function to initialize theme based on saved preference
function initTheme() {
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark if no preference
    
    // Set the theme attribute
    htmlElement.setAttribute('data-theme', savedTheme);
    
    // Find manual theme toggle button
    const themeToggleButton = document.querySelector('.theme-toggle');
    
    if (themeToggleButton && !window.themeManager) {
        // Update the toggle appearance based on current theme
        updateToggleAppearance(savedTheme, themeToggleButton);
        
        // Ensure click handler is attached
        themeToggleButton.addEventListener('click', function() {
            toggleTheme(themeToggleButton);
            UISound.play('toggle');
        });
    }
}

// Function to update toggle button appearance
function updateToggleAppearance(theme, button) {
    // Check if this is a modern toggle with icons
    const sunIcon = button.querySelector('.fa-sun');
    const moonIcon = button.querySelector('.fa-moon');
    
    if (sunIcon && moonIcon) {
        // This is a modern toggle with both icons
        if (theme === 'light') {
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'scale(1.1)';
            moonIcon.style.opacity = '0.6';
            moonIcon.style.transform = 'scale(1)';
        } else {
            sunIcon.style.opacity = '0.6';
            sunIcon.style.transform = 'scale(1)';
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'scale(1.1)';
        }
        
        // Update toggle slider if it exists
        const slider = button.closest('.theme-toggle-container')?.querySelector('.toggle-slider');
        if (slider) {
            slider.style.transform = theme === 'light' ? 'translateX(34px)' : 'translateX(0)';
        }
    } else {
        // This is a simple toggle with a single icon
        // Clear any existing icons
        button.innerHTML = '';
        
        // Create new icon
        const icon = document.createElement('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        button.appendChild(icon);
    }
    
    // Add animation effect
    button.classList.add('theme-animate');
    setTimeout(() => {
        button.classList.remove('theme-animate');
    }, 300);
}

// Function to toggle between light and dark themes
function toggleTheme(button) {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme attribute
    htmlElement.setAttribute('data-theme', newTheme);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update button appearance
    if (button) {
        updateToggleAppearance(newTheme, button);
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    // Watch for theme attribute changes (for sync across tabs)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const themeToggleButton = document.querySelector('.theme-toggle');
                if (themeToggleButton) {
                    updateToggleAppearance(currentTheme, themeToggleButton);
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});

// Also run initialization immediately if the DOM is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initTheme();
}

// Make sure theme is initialized even if there are timing issues with loading
setTimeout(function() {
    const themeToggleButton = document.querySelector('.theme-toggle');
    if (themeToggleButton) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        updateToggleAppearance(currentTheme, themeToggleButton);
    }
}, 500); 

// ==============================
// Subtle UI Sound Effects (WebAudio)
// ==============================
const UISound = (function() {
    let ctx = null;
    let unlocked = false;
    let masterGain = null;
    const volume = 0.06; // Gentle default volume

    function ensureContext() {
        if (!ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return false;
            ctx = new AudioContext();
            masterGain = ctx.createGain();
            masterGain.gain.value = volume;
            masterGain.connect(ctx.destination);
        }
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
        return !!ctx;
    }

    function unlockOnFirstGesture() {
        if (unlocked) return;
        const handler = () => {
            if (ensureContext()) {
                unlocked = true;
                document.removeEventListener('pointerdown', handler, true);
                document.removeEventListener('keydown', handler, true);
            }
        };
        document.addEventListener('pointerdown', handler, true);
        document.addEventListener('keydown', handler, true);
    }

    function tone(frequency, durationMs, type = 'sine', attack = 0.005, release = 0.08) {
        if (!ensureContext()) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(1, now + attack);
        const end = now + durationMs / 1000;
        gain.gain.exponentialRampToValueAtTime(0.0001, end + release);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(end + release + 0.02);
    }

    function chord(freqs, durationMs) {
        freqs.forEach((f, i) => tone(f, durationMs - i * 15, 'sine', 0.005, 0.1));
    }

    function play(kind) {
        const disabled = localStorage.getItem('ui-sound') === 'off';
        if (disabled) return;
        switch (kind) {
            case 'toggle':
                chord([440, 660], 120); // Soft pleasant toggle
                break;
            case 'hover':
                tone(520, 60, 'triangle');
                break;
            case 'click':
                tone(280, 70, 'square');
                break;
            default:
                break;
        }
    }

    // Auto-init gesture unlock
    unlockOnFirstGesture();

    // Bind generic UI hover/click sounds (lightweight)
    document.addEventListener('mouseover', (e) => {
        const el = e.target.closest('.btn, .portfolio-nav-button');
        if (el) play('hover');
    }, { passive: true });
    document.addEventListener('click', (e) => {
        const el = e.target.closest('.btn, .portfolio-nav-button, .theme-toggle');
        if (el) play('click');
    }, { passive: true });

    return { play };
})();

// ==============================
// Micro-animations: reveal + magnetic hover
// ==============================
(function initMicroAnimations() {
    // Inject minimal styles for reveal animation
    const style = document.createElement('style');
    style.textContent = `
        .reveal{opacity:0;transform:translateY(14px);transition:opacity .6s cubic-bezier(.2,.8,.2,1),transform .6s cubic-bezier(.2,.8,.2,1)}
        .reveal.revealed{opacity:1;transform:translateY(0)}
    `;
    document.head.appendChild(style);

    const candidates = ['.card', '.portfolio-item', '.contact-item', '.skill-category'];
    const elements = document.querySelectorAll(candidates.join(','));
    elements.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    elements.forEach(el => io.observe(el));

    // Magnetic hover for buttons/cards (subtle)
    function attachMagnetic(el, strength = 8) {
        let raf = null;
        function onMove(e) {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            const tx = Math.max(-strength, Math.min(strength, (relX / (rect.width / 2)) * strength));
            const ty = Math.max(-strength, Math.min(strength, (relY / (rect.height / 2)) * strength));
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                el.style.transform = `translate(${tx}px, ${ty}px)`;
            });
        }
        function onLeave() {
            if (raf) cancelAnimationFrame(raf);
            el.style.transform = 'translate(0, 0)';
        }
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
    }

    document.querySelectorAll('.btn, .portfolio-nav-button').forEach(el => attachMagnetic(el));
})();