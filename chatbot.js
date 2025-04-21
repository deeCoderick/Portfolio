document.addEventListener('DOMContentLoaded', function() {
    // Feature flag configuration
    const CHATBOT_CONFIG = {
        enabled: true,
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
    
    let isFirstOpen = true;
    
    // Initialize chatbot
    function initializeChatbot() {
        if (!chatbotIcon || !chatbotWindow) {
            console.error('Chatbot elements not found');
            return;
        }
        
        // Toggle chatbot window when icon is clicked
        chatbotIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            chatbotWindow.classList.toggle('active');
            
            // Show welcome messages only on first open
            if (isFirstOpen && chatbotWindow.classList.contains('active')) {
                setTimeout(() => {
                    addBotMessage("👋 Hello there! I'm Donna, your friendly virtual assistant.");
                }, 500);
                setTimeout(() => {
                    addBotMessage("Welcome to Ananth's portfolio! I'm here to help you navigate and answer any questions you might have about Ananth's work, skills, or how to get in touch.");
                }, 1500);
                setTimeout(() => {
                    addBotMessage("How can I assist you today?");
                }, 2500);
                isFirstOpen = false;
            }
        });
        
        // Close chatbot window when close button is clicked
        if (chatbotClose) {
            chatbotClose.addEventListener('click', function(e) {
                e.stopPropagation();
                chatbotWindow.classList.remove('active');
            });
        }
        
        // Minimize chatbot window when header is clicked
        if (chatbotHeader) {
            chatbotHeader.addEventListener('click', function(e) {
                if (e.target === chatbotHeader || e.target === chatbotHeader.querySelector('h3')) {
                    e.stopPropagation();
                    chatbotWindow.classList.remove('active');
                }
            });
        }

        // Close chatbot window when clicking outside
        document.addEventListener('click', function(e) {
            if (!chatbotWindow.contains(e.target) && !chatbotIcon.contains(e.target)) {
                chatbotWindow.classList.remove('active');
            }
        });
    }

    // Initialize chatbot
    initializeChatbot();
    
    // Add a message from the bot to the chat
    function addBotMessage(message) {
        if (!chatMessages) return;
        
        const msgElement = document.createElement('div');
        msgElement.className = 'chat-message bot-message';
        msgElement.innerHTML = message;
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

    // Send message function
    async function sendMessage() {
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addUserMessage(message);
            chatInput.value = '';
            
            // Get bot response
            const response = getBotResponse(message);
            setTimeout(() => {
                addBotMessage(response);
            }, 1000);
        }
    }

    // Handle send button click
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
    }

    // Handle enter key press
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Bot responses
    function getBotResponse(message) {
        // Default response for all questions
        return "Deepak is still busy in designing me, head over to the detailed project page to see the updates. <a href='project-donna.html' class='chat-link'>Project D.O.N.N.A.</a>";
        
        /* Original response logic commented out
        message = message.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi')) {
            return "Hello! How can I help you today? 😊";
        }
        else if (message.includes('donna') || message.includes('project donna') || message.includes('about you')) {
            return "Project D.O.N.N.A. is under development. Head over to the detailed project page at - <a href='project-donna.html' class='chat-link'>Project D.O.N.N.A.</a>";
        }
        else if (message.includes('contact') || message.includes('email')) {
            return "You can reach Ananth through email at ananth.deepaksharma@gmail.com";
        }
        else if (message.includes('project') || message.includes('work')) {
            return "I have worked on various projects in web development, AI, and cloud technologies. You can check them out in the Portfolio section! 🚀";
        }
        else if (message.includes('experience') || message.includes('background')) {
            return "I have over 5 years of experience in software development, working with companies like Amazon and Wipro. Check out my journey section for more details! 💼";
        }
        else if (message.includes('skill') || message.includes('technology')) {
            return "I'm proficient in various technologies including JavaScript, Python, React, AWS, and more. You can find my complete skill set in the Skills section. 💻";
        }
        else {
            return "I can help you learn about Ananth's projects, skills, experience, or you can ask me about Project D.O.N.N.A.! 🤔";
        }
        */
    }
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