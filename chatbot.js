document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatInput = document.querySelector('.chatbot-input input');
    const chatSendBtn = document.querySelector('.chatbot-input button');
    const chatMessages = document.querySelector('.chatbot-messages');
    const chatbotHeader = document.querySelector('.chatbot-header');
    
    // API configuration - Change this when your backend is ready
    const API_CONFIG = {
        endpoint: 'http://localhost:3001/api/chat', // HTTPS endpoint
        enabled: true,        // Enable API communication
        timeout: 10000         // Timeout in milliseconds
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
        console.log('🚀 Sending request to API:', API_CONFIG.endpoint);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
        
        try {
            const response = await fetch(API_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}` // Add authentication token
                },
                body: JSON.stringify({ message: message }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.error('❌ API error:', response.status, response.statusText);
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ API response received:', data);
            return data.response || "Sorry, I couldn't process your request at this time.";
            
        } catch (error) {
            console.error('❌ Error fetching from API:', error.message);
            
            if (error.name === 'AbortError') {
                return "I'm sorry, the request took too long. Please try again later.";
            }
            
            // Fallback to local responses
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
            // Add user message
            addUserMessage(message);
            chatInput.value = '';
            
            // Show typing indicator
            const typingIndicator = showTypingIndicator();
            
            try {
                let response;
                
                // Get response from API or fallback to local responses
                if (API_CONFIG.enabled) {
                    response = await getApiResponse(message);
                } else {
                    // Simulate network delay for local responses
                    await new Promise(resolve => setTimeout(resolve, 500));
                    response = getLocalResponse(message);
                }
                
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add bot response
                addBotMessage(response);
                
            } catch (error) {
                console.error('Error in sendMessage:', error);
                removeTypingIndicator();
                addBotMessage("I'm sorry, something went wrong. Please try again later.");
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
    
    // Add test API connection button functionality
    const testApiBtn = document.getElementById('test-api-connection');
    if (testApiBtn) {
        testApiBtn.addEventListener('click', async function() {
            console.log('Testing API connection...');
            
            try {
                // Show a message in the chat
                addBotMessage("🔄 Testing connection to backend...");
                
                // Make a direct API call
                const response = await fetch(API_CONFIG.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: "test connection" })
                });
                
                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('API test successful:', data);
                
                // Show success message
                addBotMessage("✅ Backend connection successful! Response received: " + data.response);
            } catch (error) {
                console.error('API test failed:', error);
                
                // Show error message
                addBotMessage("❌ Backend connection failed: " + error.message);
                addBotMessage("Check the console for more details.");
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

// Keep using environment variables but add validation
if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.length < 20) {
  console.error('Invalid API key configuration');
  process.exit(1);
} 

const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://your-frontend-domain.com',
      // Add other trusted domains
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}; 