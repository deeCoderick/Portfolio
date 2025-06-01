/**
 * Ultra-Smooth Typewriter Effect for Hero Section
 * Enhanced with beautiful typography and cross-page compatibility
 * Fixed version with robust error handling and completion guarantee
 */

// Ultra-smooth typewriter effect function with enhanced typography and error handling
function smoothTypewriterEffect(element, text, speed = 90) {
    if (!element || !text) {
        console.error('Typewriter effect: Invalid element or text provided');
        return;
    }
    
    console.log('Starting ultra-smooth typewriter effect for:', text);
    
    // Store original styles to preserve spacing
    const originalStyles = window.getComputedStyle(element);
    const fontSize = originalStyles.fontSize;
    const fontFamily = originalStyles.fontFamily;
    const letterSpacing = originalStyles.letterSpacing;
    const wordSpacing = originalStyles.wordSpacing;
    const lineHeight = originalStyles.lineHeight;
    
    // Enhanced font styling for better aesthetics
    const enhancedFontFamily = fontFamily.includes('Inter') ? fontFamily : 
                              fontFamily.includes('SF Pro') ? fontFamily :
                              fontFamily.includes('Segoe') ? fontFamily :
                              "'Inter', 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif";
    
    // Clear existing content and prepare container
    element.innerHTML = "";
    element.style.position = 'relative';
    element.style.overflow = 'visible';
    
    // Create container for text with enhanced typography - NO TRANSFORMS
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
        display: inline-block;
        position: relative;
        font-size: ${fontSize};
        font-family: ${enhancedFontFamily};
        font-weight: 600;
        letter-spacing: ${letterSpacing !== 'normal' ? letterSpacing : '-0.02em'};
        word-spacing: ${wordSpacing};
        line-height: ${lineHeight !== 'normal' ? lineHeight : '1.2'};
        font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
        transform: none;
        filter: none;
        backface-visibility: visible;
    `;
    element.appendChild(textContainer);
    
    // Create enhanced cursor with better styling
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    cursor.style.cssText = `
        display: inline-block;
        margin-left: 2px;
        color: #6c8aff;
        font-weight: 300;
        opacity: 1;
        animation: smoothBlink 1.2s ease-in-out infinite;
        position: relative;
        top: 0;
        font-size: ${fontSize};
        font-family: ${enhancedFontFamily};
        transform: none;
        filter: none;
    `;
    
    // Add optimized animation styles with NO BLUR or TRANSFORMS
    if (!document.querySelector('#typewriter-styles')) {
        const style = document.createElement('style');
        style.id = 'typewriter-styles';
        style.textContent = `
            @keyframes smoothBlink {
                0%, 45% { opacity: 1; }
                50%, 95% { opacity: 0.2; }
                100% { opacity: 1; }
            }
            
            @keyframes smoothFadeIn {
                0% { 
                    opacity: 0; 
                }
                100% { 
                    opacity: 1; 
                }
            }
            
            @keyframes cursorFadeOut {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
            
            .typewriter-word {
                display: inline;
                opacity: 0;
                animation: smoothFadeIn 0.6s ease-out forwards;
                font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
                text-rendering: optimizeLegibility;
                word-wrap: break-word;
                overflow-wrap: break-word;
                transform: none;
                filter: none;
                backface-visibility: visible;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            .typewriter-container {
                font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
                text-rendering: optimizeLegibility;
                word-wrap: break-word;
                overflow-wrap: break-word;
                white-space: normal;
                transform: none;
                filter: none;
                backface-visibility: visible;
            }
            
            .typewriter-text {
                display: inline;
                white-space: normal;
                font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
                text-rendering: optimizeLegibility;
                word-wrap: break-word;
                overflow-wrap: break-word;
                transform: none;
                filter: none;
            }
            
            .typewriter-cursor-fade {
                animation: cursorFadeOut 2s ease-out forwards;
            }
            
            /* Enhanced typography for different screen sizes */
            @media (max-width: 768px) {
                .typewriter-container {
                    letter-spacing: -0.01em;
                }
            }
            
            @media (min-width: 1200px) {
                .typewriter-container {
                    letter-spacing: -0.03em;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add class to container
    textContainer.className = 'typewriter-container';
    
    // Create text wrapper
    const textWrapper = document.createElement('span');
    textWrapper.className = 'typewriter-text';
    textContainer.appendChild(textWrapper);
    textContainer.appendChild(cursor);
    
    // Split text into words while preserving exact spacing
    const words = text.split(' ').filter(word => word.length > 0); // Remove empty words
    let wordIndex = 0;
    let animationTimeouts = []; // Track timeouts for cleanup
    let isAnimationComplete = false;
    
    // Cleanup function
    function cleanup() {
        animationTimeouts.forEach(timeout => clearTimeout(timeout));
        animationTimeouts = [];
    }
    
    function addWord() {
        // Safety check to prevent infinite loops
        if (isAnimationComplete || wordIndex >= words.length) {
            if (!isAnimationComplete) {
                completeAnimation();
            }
            return;
        }
        
        try {
            // Create word span with proper spacing and enhanced styling
            const wordSpan = document.createElement("span");
            wordSpan.className = 'typewriter-word';
            
            // Add the word with proper space handling
            const currentWord = words[wordIndex];
            if (wordIndex === 0) {
                // First word - no leading space
                wordSpan.textContent = currentWord;
            } else {
                // Subsequent words - add proper space before
                wordSpan.textContent = ' ' + currentWord;
            }
            
            // NO TRANSFORMS OR BLUR - just opacity animation
            wordSpan.style.cssText = `
                display: inline;
                opacity: 0;
                white-space: pre;
                font-size: inherit;
                font-family: inherit;
                font-weight: inherit;
                letter-spacing: inherit;
                word-spacing: inherit;
                line-height: inherit;
                font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
                text-rendering: optimizeLegibility;
                word-wrap: break-word;
                overflow-wrap: break-word;
                transform: none;
                filter: none;
                backface-visibility: visible;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            `;
            
            // Add word to text wrapper (cursor stays in place)
            textWrapper.appendChild(wordSpan);
            
            // Trigger smooth animation with RAF for perfect timing
            requestAnimationFrame(() => {
                if (!isAnimationComplete) {
                    wordSpan.style.animation = 'smoothFadeIn 0.6s ease-out forwards';
                }
            });
            
            wordIndex++;
            
            // Consistent timing for all words
            const baseSpeed = Math.max(speed, 60); // Minimum speed
            const wordLength = currentWord.length;
            const dynamicSpeed = baseSpeed + Math.min(wordLength * 3, 20);
            
            // Schedule next word with error handling
            const timeoutId = setTimeout(() => {
                if (!isAnimationComplete) {
                    addWord();
                }
            }, dynamicSpeed);
            
            animationTimeouts.push(timeoutId);
            
        } catch (error) {
            console.error('Error in typewriter animation:', error);
            completeAnimation();
        }
    }
    
    function completeAnimation() {
        if (isAnimationComplete) return;
        
        isAnimationComplete = true;
        cleanup();
        
        console.log('Ultra-smooth typewriter effect completed for:', text);
        
        // Immediately start cursor fade out
        const fadeTimeout = setTimeout(() => {
            if (cursor && cursor.parentNode) {
                cursor.classList.add('typewriter-cursor-fade');
                
                // Remove cursor completely after fade
                setTimeout(() => {
                    if (cursor && cursor.parentNode) {
                        cursor.parentNode.removeChild(cursor);
                    }
                }, 2000);
            }
        }, 500); // Start fade immediately after completion
        
        animationTimeouts.push(fadeTimeout);
    }
    
    // Start with optimized timing and error handling
    const startTimeout = setTimeout(() => {
        if (!isAnimationComplete) {
            addWord();
        }
    }, 300);
    
    animationTimeouts.push(startTimeout);
    
    // Fallback completion timer (safety net)
    const fallbackTimeout = setTimeout(() => {
        if (!isAnimationComplete) {
            console.warn('Typewriter animation taking too long, forcing completion');
            completeAnimation();
        }
    }, (words.length * speed) + 5000); // Shorter fallback time
    
    animationTimeouts.push(fallbackTimeout);
}

// Enhanced initialization with better page detection and error handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ultra-smooth typewriter script loaded');
    
    // Optimize for smooth animations
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
            initializeTypewriter();
        }, { timeout: 1500 });
    } else {
        setTimeout(initializeTypewriter, 800);
    }
    
    function initializeTypewriter() {
        try {
            // Try multiple selectors for different page types
            const selectors = [
                '.hero-title',
                '.page-title', 
                '.main-title',
                'h1.title',
                '.project-title',
                '.section-title',
                '.about-title',
                '#about .section-title',
                '.about-section .section-title'
            ];
            
            let targetElement = null;
            let targetText = '';
            
            // Special handling for About Me section
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const aboutTitle = aboutSection.querySelector('.section-title');
                if (aboutTitle && aboutTitle.textContent.trim() === 'About Me') {
                    targetElement = aboutTitle;
                    targetText = aboutTitle.textContent.trim();
                    console.log('Found About Me section title for typewriter effect');
                    
                    // After title animation, also animate the first paragraph
                    setTimeout(() => {
                        try {
                            const firstParagraph = aboutSection.querySelector('.about-content p:first-child');
                            if (firstParagraph && !firstParagraph.querySelector('.typewriter-cursor')) {
                                const paragraphText = firstParagraph.textContent.trim();
                                if (paragraphText.length > 0) {
                                    console.log('Applying typewriter effect to About Me first paragraph');
                                    smoothTypewriterEffect(firstParagraph, paragraphText, 50);
                                }
                            }
                        } catch (error) {
                            console.error('Error applying typewriter to paragraph:', error);
                        }
                    }, 3500); // Start paragraph animation 3.5 seconds after title starts
                }
            }
            
            // If no About Me section found, try other selectors
            if (!targetElement) {
                for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent && element.textContent.trim().length > 0) {
                        targetElement = element;
                        targetText = element.textContent.trim();
                        console.log(`Found target element with selector: ${selector}`);
                        break;
                    }
                }
            }
            
            if (targetElement && targetText && targetText.length > 0) {
                console.log('Applying ultra-smooth typewriter effect to:', targetText);
                
                // Apply enhanced typewriter effect
                smoothTypewriterEffect(targetElement, targetText, 80);
            } else {
                console.log('No suitable target element found for typewriter effect');
                
                // Debug: show available elements
                const allTitles = document.querySelectorAll('h1, h2, h3, .title, [class*="title"], [class*="hero"]');
                console.log('Available title elements:', Array.from(allTitles).map(el => ({
                    tag: el.tagName,
                    class: el.className,
                    text: el.textContent?.substring(0, 50)
                })));
            }
        } catch (error) {
            console.error('Error in typewriter initialization:', error);
        }
    }
});

// Enhanced backup trigger with better timing and error handling
window.addEventListener('load', function() {
    setTimeout(() => {
        try {
            const selectors = [
                '.hero-title', 
                '.page-title', 
                '.main-title', 
                'h1.title',
                '#about .section-title',
                '.about-section .section-title'
            ];
            
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                
                // Only apply if it hasn't been applied yet and has valid content
                if (element && element.textContent && element.textContent.trim().length > 0 && !element.querySelector('.typewriter-cursor')) {
                    const originalText = element.textContent.trim();
                    console.log(`Backup: Applying ultra-smooth typewriter effect to ${selector}:`, originalText);
                    smoothTypewriterEffect(element, originalText, 80);
                    break;
                }
            }
        } catch (error) {
            console.error('Error in backup typewriter trigger:', error);
        }
    }, 1500);
}); 