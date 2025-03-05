document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatInput = document.querySelector('.chatbot-input input');
    const chatSendBtn = document.querySelector('.chatbot-input button');
    const chatMessages = document.querySelector('.chatbot-messages');
    const chatbotHeader = document.querySelector('.chatbot-header');
    
    let isFirstOpen = true;
    
    // Toggle chatbot window when icon is clicked
    if (chatbotIcon) {
        chatbotIcon.addEventListener('click', function() {
            console.log('Chatbot icon clicked'); // Debug log
            if (chatbotWindow) {
                chatbotWindow.classList.toggle('active');
                console.log('Chatbot window active:', chatbotWindow.classList.contains('active')); // Debug log
                
                // Show welcome messages only on first open
                if (isFirstOpen && chatbotWindow.classList.contains('active')) {
                    addBotMessage("👋 Hello there! I'm Donna, your friendly virtual assistant.");
                    setTimeout(() => {
                        addBotMessage("Welcome to Ananth's portfolio! I'm here to help you navigate and answer any questions you might have about Ananth's work, skills, or how to get in touch.");
                    }, 800);
                    setTimeout(() => {
                        addBotMessage("How can I assist you today?");
                    }, 1600);
                    isFirstOpen = false;
                }
            }
        });
    }
    
    // Close chatbot window when close button is clicked
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            if (chatbotWindow) {
                chatbotWindow.classList.remove('active');
            }
        });
    }
    
    // Close chatbot window when header is clicked
    if (chatbotHeader) {
        chatbotHeader.addEventListener('click', function() {
            if (chatbotWindow) {
                chatbotWindow.classList.remove('active');
            }
        });
    }
    
    // Sample responses for chatbot
    const responses = {
        'hello': 'Hi there! How can I help you today?',
        'hi': 'Hello! What can I assist you with?',
        'help': 'I can help with information about my skills, experience, projects, or how to contact me. What would you like to know?',
        'contact': 'You can reach me through email at ananth.deepaksharma@gmail.com or connect with me on LinkedIn.',
        'projects': 'I have worked on various projects including web development, AI applications, and cloud solutions. Check out my portfolio section for more details.',
        'skills': 'My skills include JavaScript, Python, React, Node.js, and various cloud technologies. See the Skills section for the complete list.',
        'experience': 'I have 5+ years of experience in software development, working with various technologies and industries.',
        'default': "I'm not sure I understand. Could you try rephrasing or ask me about my skills, projects, or contact information?"
    };
    
    // Add a message from the bot to the chat
    function addBotMessage(message) {
        if (!chatMessages) return;
        
        const msgElement = document.createElement('div');
        msgElement.className = 'chat-message bot-message';
        msgElement.textContent = message;
        chatMessages.appendChild(msgElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add a message from the user to the chat
    function addUserMessage(message) {
        if (!chatMessages) return;
        
        const msgElement = document.createElement('div');
        msgElement.className = 'chat-message user-message';
        msgElement.textContent = message;
        chatMessages.appendChild(msgElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to process user input and return a response
    function getResponse(input) {
        input = input.toLowerCase().trim();
        
        // Check for keyword matches
        for (const key in responses) {
            if (input.includes(key)) {
                return responses[key];
            }
        }
        
        // Default response if no match
        return responses.default;
    }
    
    // Send message function
    function sendMessage() {
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addUserMessage(message);
            chatInput.value = '';
            
            // Get and add bot response after a short delay
            setTimeout(() => {
                const response = getResponse(message);
                addBotMessage(response);
            }, 500);
        }
    }
    
    // Event listeners for sending messages
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
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