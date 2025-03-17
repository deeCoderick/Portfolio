document.addEventListener('DOMContentLoaded', function() {
    // Feature flag configuration - You can control this programmatically
    const CHATBOT_CONFIG = {
        enabled: false, // Set this to false by default
        version: '1.0',
        debugMode: false
    };

    // Get DOM elements
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatInput = document.querySelector('.chatbot-input input');
    const chatSendBtn = document.querySelector('.chatbot-input button');
    const chatMessages = document.querySelector('.chatbot-messages');
    const chatbotHeader = document.querySelector('.chatbot-header');
    
    // API configuration
    const API_CONFIG = {
        endpoint: 'http://ec2-3-145-76-118.us-east-2.compute.amazonaws.com/api/chat',
        enabled: true,
        timeout: 15000,
        debug: true
    };
    
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
    
    // Sample responses for chatbot (fallback when API is disabled)
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
    
    // Add a typing indicator
    function showTypingIndicator() {
        if (!chatMessages) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'chat-message bot-message typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        indicator.id = 'typing-indicator';
        chatMessages.appendChild(indicator);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return indicator;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
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
    
    // Function to get a response from the API
    async function getApiResponse(message) {
        console.log('🚀 Sending request:', {
            url: API_CONFIG.endpoint,
            message: message
        });
        
        try {
            const response = await fetch(API_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message: message }),
                mode: 'cors',
                credentials: 'omit'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Response received:', data);
            
            return data.response || "I apologize, but I received an unexpected response format.";
        } catch (error) {
            console.error('❌ Error:', error);
            return getLocalResponse(message);
        }
    }
    
    // Function to process user input and return a local response
    function getLocalResponse(input) {
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
    async function sendMessage() {
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        if (message) {
            console.log(' Sending message:', message);
            
            // Add user message
            addUserMessage(message);
            chatInput.value = '';
            
            // Show typing indicator
            const typingIndicator = showTypingIndicator();
            
            try {
                const response = await getApiResponse(message);
                removeTypingIndicator();
                addBotMessage(response);
                
            } catch (error) {
                console.error('❌ Chat error:', error);
                removeTypingIndicator();
                addBotMessage("I apologize, but I'm having trouble connecting to my brain right now. Please try again in a moment.");
            }
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
    
    // Test function to verify CORS
    async function testCORS() {
        try {
            const response = await fetch(API_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: 'test' }),
                mode: 'cors',
                credentials: 'omit'
            });

            const data = await response.json();
            console.log('CORS test successful:', data);
            return true;
        } catch (error) {
            console.error('CORS test failed:', error);
            return false;
        }
    }
    
    // Add test button functionality
    const testBtn = document.getElementById('test-api-connection');
    if (testBtn) {
        testBtn.addEventListener('click', async () => {
            addBotMessage("🔄 Testing connection...");
            const success = await testCORS();
            addBotMessage(success ? 
                "✅ Connection successful!" : 
                "❌ Connection failed. Check console for details."
            );
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
    
    // Social sidebar is now always visible
    const socialLinks = document.querySelector('.social-icons');
    const footerElement = document.querySelector('footer');
    
    // Mobile toggle functionality 
    const socialMobileToggle = document.querySelector('.social-mobile-toggle');
    if (socialMobileToggle && socialSidebar) {
        socialMobileToggle.addEventListener('click', function() {
            socialSidebar.classList.toggle('mobile-active');
        });
    }
    
    // Function to control chatbot visibility
    function setChatbotVisibility(show) {
        if (!CHATBOT_CONFIG.enabled) {
            if (chatbotIcon) chatbotIcon.style.display = 'none';
            if (chatbotWindow) {
                chatbotWindow.classList.remove('active');
                chatbotWindow.style.display = 'none';
            }
            return;
        }

        if (chatbotIcon) chatbotIcon.style.display = show ? 'flex' : 'none';
        if (chatbotWindow) {
            if (!show) chatbotWindow.classList.remove('active');
            chatbotWindow.style.display = show ? 'flex' : 'none';
        }
    }

    // Initialize chatbot based on configuration
    function initializeChatbot() {
        setChatbotVisibility(CHATBOT_CONFIG.enabled);
        
        if (CHATBOT_CONFIG.debugMode) {
            console.log('Chatbot initialization:', {
                enabled: CHATBOT_CONFIG.enabled,
                version: CHATBOT_CONFIG.version
            });
        }
    }

    // Function to programmatically enable/disable chatbot
    window.toggleChatbot = function(enable) {
        CHATBOT_CONFIG.enabled = enable;
        setChatbotVisibility(enable);
        
        if (CHATBOT_CONFIG.debugMode) {
            console.log('Chatbot state changed:', {
                enabled: enable,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Function to update chatbot configuration
    window.updateChatbotConfig = function(config) {
        Object.assign(CHATBOT_CONFIG, config);
        initializeChatbot();
        
        if (CHATBOT_CONFIG.debugMode) {
            console.log('Chatbot config updated:', CHATBOT_CONFIG);
        }
    }

    // Initialize chatbot
    initializeChatbot();
}); 

// Add a diagnostic test function
async function runDiagnostics() {
    console.log('🔍 Running API diagnostics...');
    
    try {
        // Test basic connectivity
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'test' })
        });

        console.log('📡 Connection test:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });

        const data = await response.text();
        console.log('📦 Response data:', data);

        return {
            success: response.ok,
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error('🚫 Diagnostic failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Add diagnostic button if it exists
const diagButton = document.getElementById('run-diagnostics');
if (diagButton) {
    diagButton.addEventListener('click', async () => {
        addBotMessage("🔍 Running diagnostics...");
        const result = await runDiagnostics();
        addBotMessage(result.success ? 
            "✅ Diagnostics completed successfully" : 
            `❌ Diagnostics failed: ${result.error}`
        );
    });
} 