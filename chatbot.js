document.addEventListener('DOMContentLoaded', function() {
    // EC2 Chatbot Configuration
    const CHATBOT_CONFIG = {
        enabled: true,
        version: '2.0',
        debugMode: false,
        // EC2 Service Configuration
        apiConfig: {
            baseURL: 'https://assistantdonna.duckdns.org',
            token: '804c3cef87b4b6dbdccc2c13c99d05389a34cb664bf97b9887cfea12467f3779',
            clientId: 'PersonalPortfolioAssistant',
            timeout: 30000,
            retryAttempts: 3
        }
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
    let isLoading = false;
    let retryCount = 0;
    let messageHistory = [];
    
    // Initialize chatbot
    function initializeChatbot() {
        if (!chatbotIcon || !chatbotWindow) {
            console.info('Chatbot elements not found - chatbot functionality disabled for this page');
            return;
        }
        
        // Test API connection
        testConnection();
        
        // Load message history
        loadMessageHistory();
        
        // Toggle chatbot window when icon is clicked
        chatbotIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            chatbotWindow.classList.toggle('active');
            
            // Show welcome messages only on first open
            if (isFirstOpen && chatbotWindow.classList.contains('active')) {
                setTimeout(() => {
                    addBotMessage("👋 Hello there! I'm Donna, your AI assistant.");
                }, 500);
                setTimeout(() => {
                    addBotMessage("Welcome to Ananth's portfolio! I can help you navigate and answer questions about his work, skills, and projects.");
                }, 1500);
                setTimeout(() => {
                    addBotMessage("How can I assist you today?");
                }, 2500);
                isFirstOpen = false;
            }
            
            // Focus input when opened
            if (chatbotWindow.classList.contains('active') && chatInput) {
                setTimeout(() => chatInput.focus(), 100);
            }
        });
        
        // Close chatbot window when close button is clicked
        if (chatbotClose) {
            chatbotClose.addEventListener('click', function(e) {
                e.stopPropagation();
                chatbotWindow.classList.remove('active');
                saveMessageHistory();
            });
        }
        
        // Minimize chatbot window when header is clicked
        if (chatbotHeader) {
            chatbotHeader.addEventListener('click', function(e) {
                if (e.target === chatbotHeader || e.target === chatbotHeader.querySelector('h3')) {
                    e.stopPropagation();
                    chatbotWindow.classList.remove('active');
                    saveMessageHistory();
                }
            });
        }

        // Close chatbot window when clicking outside
        document.addEventListener('click', function(e) {
            if (!chatbotWindow.contains(e.target) && !chatbotIcon.contains(e.target)) {
                chatbotWindow.classList.remove('active');
                saveMessageHistory();
            }
        });
    }

    // Initialize chatbot
    initializeChatbot();
    
    // Add a message from the bot to the chat
    function addBotMessage(message, isError = false) {
        if (!chatMessages) return;
        
        const msgElement = document.createElement('div');
        msgElement.className = `chat-message bot-message${isError ? ' error-message' : ''}`;
        msgElement.innerHTML = message;
        chatMessages.appendChild(msgElement);
        
        // Add to history
        messageHistory.push({
            content: message,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            isError
        });
        
        // Scroll to bottom
        scrollToBottom();
    }
    
    // Add a message from the user to the chat
    function addUserMessage(message) {
        if (!chatMessages) return;
        
        const msgElement = document.createElement('div');
        msgElement.className = 'chat-message user-message';
        msgElement.textContent = message;
        chatMessages.appendChild(msgElement);
        
        // Add to history
        messageHistory.push({
            content: message,
            sender: 'user',
            timestamp: new Date().toISOString()
        });
        
        // Scroll to bottom
        scrollToBottom();
    }
    
    // Scroll to bottom of chat
    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        // Remove any existing typing indicator first
        hideTypingIndicator();
        
        if (!chatMessages) return;
        
        // Create new typing indicator
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span>Donna is thinking...</span>
        `;
        
        // Append to the end of messages (after all existing messages)
        chatMessages.appendChild(indicator);
        
        // Scroll to bottom to show the indicator
        scrollToBottom();
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        if (!chatMessages) return;
        
        const indicator = chatMessages.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove(); // Remove completely instead of just hiding
        }
    }
    
    // Update UI based on loading state
    function updateUI() {
        if (chatSendBtn) {
            chatSendBtn.disabled = isLoading;
            chatSendBtn.textContent = isLoading ? 'Sending...' : 'Send';
        }
        
        if (chatInput) {
            chatInput.disabled = isLoading;
        }
    }

    // Send message function
    async function sendMessage() {
        if (!chatInput || !chatMessages || isLoading) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addUserMessage(message);
        chatInput.value = '';
        
        // Set loading state
        isLoading = true;
        updateUI();
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Try to get AI response from EC2 service
            const response = await callChatbotAPI(message);
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add AI response
            addBotMessage(response);
            
            // Reset retry count on success
            retryCount = 0;
            
        } catch (error) {
            console.error('Chatbot error:', error);
            hideTypingIndicator();
            
            // Handle different error types
            if (retryCount < CHATBOT_CONFIG.apiConfig.retryAttempts) {
                retryCount++;
                addBotMessage(
                    `Connection issue. Retrying... (${retryCount}/${CHATBOT_CONFIG.apiConfig.retryAttempts})`
                );
                
                // Retry after delay
                setTimeout(() => {
                    // Re-add the message to retry
                    chatInput.value = message;
                    sendMessage();
                }, 2000);
            } else {
                addBotMessage(getOfflineResponse(message), true);
                retryCount = 0;
            }
        } finally {
            isLoading = false;
            updateUI();
        }
    }
    
    // Call chatbot API
    async function callChatbotAPI(message) {
        const { apiConfig } = CHATBOT_CONFIG;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
        
        try {
            const response = await fetch(`${apiConfig.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiConfig.token}`
                },
                body: JSON.stringify({
                    client_id: apiConfig.clientId,
                    message: message,
                    temperature: 0.7,
                    max_tokens: 1000
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.response || 'Sorry, I received an empty response.';
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            
            throw error;
        }
    }
    
    // Get offline response when API is unavailable
    function getOfflineResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Custom commands
        if (lowerMessage.includes('clear chat') || lowerMessage.includes('clear history')) {
            clearHistory();
            return "Chat history cleared! How can I help you?";
        }
        
        if (lowerMessage.includes('help') || lowerMessage.includes('commands')) {
            return `Available commands:<br>
                • "clear chat" - Clear chat history<br>
                • "help" - Show this help message<br><br>
                You can also ask me about Ananth's projects, skills, experience, or anything else!`;
        }
        
        // Intelligent offline responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I'm currently experiencing connectivity issues, but I can still help with basic information about Ananth's portfolio.";
        }
        
        if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
            return "You can explore Ananth's projects in the Portfolio section. I'm currently offline but will be back soon with full AI capabilities!";
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
            return "You can reach Ananth at ananth.deepaksharma@gmail.com or through the contact form.";
        }
        
        if (lowerMessage.includes('donna') || lowerMessage.includes('about you')) {
            return "I'm D.O.N.N.A., Ananth's AI assistant. Currently experiencing connectivity issues, but you can learn more about my development at <a href='project-donna.html' class='chat-link'>Project D.O.N.N.A.</a>";
        }
        
        if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
            return "Ananth is proficient in various technologies including JavaScript, Python, React, AWS, and more. You can find his complete skill set in the Skills section. 💻";
        }
        
        if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
            return "Ananth has over 5 years of experience in software development, working with companies like Amazon and Wipro. Check out his journey section for more details! 💼";
        }
        
        return "I'm currently experiencing connectivity issues with my AI service. Please try again in a moment, or explore the portfolio manually. For urgent inquiries, please use the contact form.";
    }

    // Handle send button click
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
    }

    // Handle enter key press
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Test API connection
    async function testConnection() {
        try {
            const response = await fetch(`${CHATBOT_CONFIG.apiConfig.baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${CHATBOT_CONFIG.apiConfig.token}`
                },
                timeout: 5000
            });
            
            if (response.ok) {
                console.debug('✅ Chatbot API connection successful');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ Chatbot API connection failed, offline mode enabled');
        }
        
        return false;
    }
    
    // Save message history to localStorage
    function saveMessageHistory() {
        try {
            const historyData = {
                messages: messageHistory,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('chatbot_history', JSON.stringify(historyData));
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    }
    
    // Load message history from localStorage
    function loadMessageHistory() {
        try {
            const historyData = localStorage.getItem('chatbot_history');
            if (historyData) {
                const parsed = JSON.parse(historyData);
                
                // Only load recent history (last 24 hours)
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                const historyDate = new Date(parsed.timestamp);
                
                if (historyDate > dayAgo && parsed.messages) {
                    messageHistory = parsed.messages;
                    
                    // Render existing messages
                    messageHistory.forEach(message => {
                        if (message.sender === 'bot') {
                            const msgElement = document.createElement('div');
                            msgElement.className = `chat-message bot-message${message.isError ? ' error-message' : ''}`;
                            msgElement.innerHTML = message.content;
                            if (chatMessages) chatMessages.appendChild(msgElement);
                        } else {
                            const msgElement = document.createElement('div');
                            msgElement.className = 'chat-message user-message';
                            msgElement.textContent = message.content;
                            if (chatMessages) chatMessages.appendChild(msgElement);
                        }
                    });
                    
                    scrollToBottom();
                }
            }
        } catch (error) {
            console.warn('Failed to load chat history:', error);
        }
    }
    
    // Clear message history
    function clearHistory() {
        messageHistory = [];
        
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        
        localStorage.removeItem('chatbot_history');
    }
    
    // Get chat statistics
    function getStats() {
        return {
            totalMessages: messageHistory.length,
            userMessages: messageHistory.filter(m => m.sender === 'user').length,
            botMessages: messageHistory.filter(m => m.sender === 'bot').length,
            errorMessages: messageHistory.filter(m => m.isError).length,
            isConnected: retryCount === 0
        };
    }
    
    // Expose functions for debugging
    if (CHATBOT_CONFIG.debugMode) {
        window.chatbotDebug = {
            getStats,
            clearHistory,
            testConnection,
            messageHistory
        };
    }
});

// Add enhanced CSS styles for typing indicator and improved UI
const chatbotStyles = document.createElement('style');
chatbotStyles.textContent = `
/* Enhanced Chatbot Styles */
.chatbot-window {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(20px) scale(0.95);
    opacity: 0;
    visibility: hidden;
}

.chatbot-window.active {
    transform: translateY(0) scale(1);
    opacity: 1;
    visibility: visible;
}

/* Chat Messages Container */
.chatbot-messages {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    overflow-y: auto;
    scroll-behavior: smooth;
}

.chat-message {
    animation: messageSlideIn 0.3s ease-out;
    margin-bottom: 12px;
    word-wrap: break-word;
    max-width: 85%;
    flex-shrink: 0; /* Prevent shrinking */
}

.chat-message.user-message {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin-left: auto;
    padding: 10px 14px;
    border-radius: 18px 18px 4px 18px;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.chat-message.bot-message {
    background: white;
    color: #333;
    border: 1px solid #e1e5e9;
    margin-right: auto;
    padding: 10px 14px;
    border-radius: 18px 18px 18px 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chat-message.error-message {
    background: #fee;
    color: #c33;
    border-color: #fcc;
    box-shadow: 0 2px 8px rgba(204, 51, 51, 0.2);
}

.chat-message a.chat-link {
    color: #667eea;
    text-decoration: underline;
    font-weight: 500;
}

.chat-message a.chat-link:hover {
    color: #5a6fd8;
}

/* Typing Indicator */
.typing-indicator {
    display: block;
    padding: 12px 16px;
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 18px 18px 18px 4px;
    max-width: 80%;
    margin-right: auto;
    margin-bottom: 15px;
    margin-top: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    animation: messageSlideIn 0.3s ease-out;
    order: 999;
}

.typing-dots {
    display: inline-flex;
    align-items: center;
    margin-right: 8px;
}

.typing-dots span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #667eea;
    margin: 0 2px;
    animation: typingDots 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { 
    animation-delay: -0.32s; 
}

.typing-dots span:nth-child(2) { 
    animation-delay: -0.16s; 
}

.typing-dots span:nth-child(3) { 
    animation-delay: 0s; 
}

@keyframes typingDots {
    0%, 80%, 100% { 
        transform: scale(0.8); 
        opacity: 0.5; 
    }
    40% { 
        transform: scale(1); 
        opacity: 1; 
    }
}

@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Enhanced Input */
.chatbot-input input:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
}

.chatbot-input button:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* Responsive */
@media (max-width: 768px) {
    .chat-message {
        max-width: 90%;
        font-size: 14px;
    }
}
`;

document.head.appendChild(chatbotStyles);

// Add a diagnostic test function
async function runDiagnostics() {
    // console.log('🔍 Running API diagnostics...');
    
    try {
        // Test basic connectivity
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'test' })
        });

        // console.log('📡 Connection test:', {
        //     status: response.status,
        //     statusText: response.statusText,
        //     headers: Object.fromEntries(response.headers.entries())
        // });

        const data = await response.text();
        // console.log('📦 Response data:', data);

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