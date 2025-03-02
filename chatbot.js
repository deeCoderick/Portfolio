document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotHeader = document.getElementById('chatbot-header');
    const chatMessages = document.querySelector('.chatbot-messages');
    const chatInput = document.querySelector('.chatbot-input input');
    const chatSendBtn = document.querySelector('.chatbot-input button');
    
    // Toggle chatbot visibility
    chatbotIcon.addEventListener('click', function() {
        chatbotWindow.classList.add('active');
        
        // Show initial message if it's first open
        if (!chatMessages.hasChildNodes()) {
            addBotMessage("👋 Hello there! I'm Donna, your friendly virtual assistant.");
            setTimeout(() => {
                addBotMessage("Welcome to Ananth's portfolio! I'm here to help you navigate and answer any questions you might have about Ananth's work, skills, or how to get in touch.");
            }, 800);
            setTimeout(() => {
                addBotMessage("How can I assist you today?");
            }, 1600);
        }
    });
    
    // Close chatbot when clicking the close button
    chatbotClose.addEventListener('click', function() {
        chatbotWindow.classList.remove('active');
    });
    
    // Close chatbot when clicking anywhere on the header (except for the existing close button)
    if (chatbotHeader) {
        chatbotHeader.addEventListener('click', function(e) {
            // Check if the click is on the header itself, not on the close button
            if (e.target !== chatbotClose && !chatbotClose.contains(e.target)) {
                chatbotWindow.classList.remove('active');
            }
        });
    }
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Send message on button click
    chatSendBtn.addEventListener('click', sendMessage);
    
    // Send user message and get response
    function sendMessage() {
        const message = chatInput.value.trim();
        
        if (message !== '') {
            // Add user message to chat
            addUserMessage(message);
            
            // Clear input
            chatInput.value = '';
            
            // Get bot response (with slight delay to seem more natural)
            setTimeout(function() {
                getBotResponse(message);
            }, 500);
        }
    }
    
    // Add a message from the user to the chat
    function addUserMessage(message) {
        const msgElement = document.createElement('div');
        msgElement.className = 'chat-message user-message';
        msgElement.textContent = message;
        chatMessages.appendChild(msgElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add a message from the bot to the chat
    function addBotMessage(message) {
        const msgElement = document.createElement('div');
        msgElement.className = 'chat-message bot-message';
        msgElement.textContent = message;
        chatMessages.appendChild(msgElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Generate a bot response based on user input
    function getBotResponse(userMessage) {
        // Convert to lowercase for easier matching
        const message = userMessage.toLowerCase();
        
        // Simple response logic
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            addBotMessage("Hello! How can I assist you today?");
        }
        else if (message.includes('contact') || message.includes('reach') || message.includes('email')) {
            addBotMessage("You can contact Ananth via email at ananth.deepaksharma@gmail.com or use the contact form on this page.");
        }
        else if (message.includes('project') || message.includes('work') || message.includes('portfolio')) {
            addBotMessage("Ananth has worked on various projects in web development, AI, and more. Check out the Code Projects section to learn more!");
        }
        else if (message.includes('about') || message.includes('who')) {
            addBotMessage("Ananth is a software developer with expertise in modern web technologies, AI, and cloud solutions. He's passionate about creating innovative digital solutions.");
        }
        else if (message.includes('skill') || message.includes('expertise')) {
            addBotMessage("Ananth's skills include frontend development (React, JavaScript), backend development (Node.js, Python), cloud technologies, and more.");
        }
        else if (message.includes('thank')) {
            addBotMessage("You're welcome! Let me know if there's anything else I can help with.");
        }
        else if (message.includes('bye') || message.includes('goodbye')) {
            addBotMessage("Goodbye! Feel free to reach out if you have more questions later.");
        }
        else {
            addBotMessage("I'm not sure I understand. Could you try rephrasing or ask me about Ananth's projects, skills, or contact information?");
        }
    }
    
    // Mobile social icons toggle
    const socialToggle = document.querySelector('.social-mobile-toggle');
    const socialSidebar = document.querySelector('.social-sidebar');
    
    if (socialToggle && socialSidebar) {
        // Make sidebar visible by default on desktop
        if (window.innerWidth > 768) {
            socialSidebar.classList.add('visible');
        }
        
        // Toggle visibility on mobile when clicked
        socialToggle.addEventListener('click', function() {
            socialSidebar.classList.toggle('visible');
        });
        
        // Update visibility on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                socialSidebar.classList.add('visible');
            } else {
                socialSidebar.classList.remove('visible');
            }
        });
    }
    
    // Control social sidebar visibility based on scroll position
    const socialLinks = document.querySelector('.social-icons');
    const footerElement = document.querySelector('footer');
    
    function handleSocialSidebarVisibility() {
        if (!socialSidebar || !socialLinks) return;
        
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const bodyHeight = document.body.offsetHeight;
        const footerOffset = footerElement ? footerElement.offsetTop : bodyHeight;
        const socialLinksBottom = socialLinks.getBoundingClientRect().bottom + window.scrollY;
        
        // On mobile devices
        if (window.innerWidth <= 768) {
            // Show when social links go out of scope and hide when reaching footer area
            if (scrollPosition > socialLinksBottom && scrollPosition < footerOffset - windowHeight) {
                socialSidebar.classList.add('visible');
            } else {
                socialSidebar.classList.remove('visible');
            }
        } else {
            // On desktop, show sidebar but hide when reaching footer
            if (scrollPosition < footerOffset - windowHeight * 0.8) {
                socialSidebar.classList.add('visible');
            } else {
                socialSidebar.classList.remove('visible');
            }
        }
    }
    
    // Initial check on page load
    handleSocialSidebarVisibility();
    
    // Check on scroll
    window.addEventListener('scroll', handleSocialSidebarVisibility);
    
    // Check on window resize (in case header/footer positions change)
    window.addEventListener('resize', handleSocialSidebarVisibility);
}); 