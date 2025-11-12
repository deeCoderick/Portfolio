document.addEventListener('DOMContentLoaded', function() {
    // EC2 Chatbot Configuration
    const CHATBOT_CONFIG = {
        enabled: true,
        version: '2.0',
        debugMode: false,
        // Enable this to keep Donna conversational while full features are being built
        developmentMode: true,
        // Input restrictions
        maxMessageLength: 500,
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
    let characterCountElement = null;
    
    // Check if welcome messages have been shown this session
    function hasShownWelcomeThisSession() {
        return sessionStorage.getItem('chatbot_welcome_shown') === 'true';
    }
    
    // Mark welcome messages as shown for this session
    function markWelcomeAsShown() {
        sessionStorage.setItem('chatbot_welcome_shown', 'true');
    }
    
    // Initialize chatbot
    function initializeChatbot() {
        if (!chatbotIcon || !chatbotWindow) {
            console.info('Chatbot elements not found - chatbot functionality disabled for this page');
            return;
        }
        
        // Add development badge in header
        try {
            const titleEl = chatbotHeader ? chatbotHeader.querySelector('h3') : null;
            if (titleEl && !titleEl.querySelector('.beta-badge')) {
                const badge = document.createElement('span');
                badge.className = 'beta-badge';
                badge.textContent = 'Beta';
                titleEl.appendChild(badge);
            }
        } catch (e) {
            // non-fatal
        }
        
        // Test API connection
        testConnection();
        
        // Load message history
        loadMessageHistory();
        
        // Setup input restrictions
        setupInputRestrictions();
        
        // Toggle chatbot window when icon is clicked
        chatbotIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            chatbotWindow.classList.toggle('active');
            
            // Show welcome messages only once per session and only on first open
            if (isFirstOpen && chatbotWindow.classList.contains('active') && !hasShownWelcomeThisSession()) {
                setTimeout(() => {
                    addBotMessage("👋 Hello there! I'm Donna, your AI assistant.");
                }, 500);
                setTimeout(() => {
                    addBotMessage("Welcome to Ananth's portfolio! I can help you navigate and answer questions about his work, skills, and projects.");
                }, 1500);
                setTimeout(() => {
                    addBotMessage("Heads up: I’m in active development. I’ll give helpful, concise answers for now while the full experience is being built. 💡");
                }, 2200);
                setTimeout(() => {
                    addBotMessage("How can I assist you today?");
                }, 2500);
                markWelcomeAsShown();
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
        
        // Validate message length
        if (message.length > CHATBOT_CONFIG.maxMessageLength) {
            addBotMessage(`Message too long! Please keep it under ${CHATBOT_CONFIG.maxMessageLength} characters.`, true);
            return;
        }
        
        // Add user message
        addUserMessage(message);
        chatInput.value = '';
        
        // Update character counter after clearing input
        if (characterCountElement) {
            chatInput.dispatchEvent(new Event('input'));
        }
        
        // Set loading state
        isLoading = true;
        updateUI();
        
        // Show typing indicator
        showTypingIndicator();
        
        // DEVELOPMENT MODE: always respond locally with a helpful, concise answer
        if (CHATBOT_CONFIG.developmentMode) {
            setTimeout(() => {
                hideTypingIndicator();
                addBotMessage(getDevelopmentResponse(message));
                isLoading = false;
                updateUI();
            }, 600);
            return;
        }
        
        // PRODUCTION/HYBRID: use API with graceful fallback
        try {
            const response = await callChatbotAPI(message);
            hideTypingIndicator();
            addBotMessage(response);
            retryCount = 0;
        } catch (error) {
            console.error('Chatbot error:', error);
            hideTypingIndicator();
            if (retryCount < CHATBOT_CONFIG.apiConfig.retryAttempts) {
                retryCount++;
                addBotMessage(
                    `Network is a bit busy. Retrying... (${retryCount}/${CHATBOT_CONFIG.apiConfig.retryAttempts})`
                );
                setTimeout(() => {
                    chatInput.value = message;
                    sendMessage();
                }, 1200);
            } else {
                addBotMessage(getDevelopmentResponse(message));
                retryCount = 0;
            }
        } finally {
            isLoading = false;
            updateUI();
        }
    }
    
    // Development-mode response: concise, friendly, and useful
    function getDevelopmentResponse(message) {
        const text = message.toLowerCase();
        
        // Quick intents
        if (/hello|hi|hey|yo|good (morning|afternoon|evening)/.test(text)) {
            return "Hi! I’m Donna. I’m still being built, but I can help with Ananth’s projects, skills, and contact info. Ask away! 😊";
        }
        if (/help|what can you do|commands/.test(text)) {
            return `Here’s what I can help with right now:<br>
• Navigate: “show projects”, “skills”, “contact”<br>
• Info: “who is Ananth?”, “experience”, “resume”<br>
• Links: “github”, “linkedin”, “email”<br><br>
Note: I’m in active development — smarter answers are coming soon.`;
        }
        if (/project|portfolio|work|build|made/.test(text)) {
            return `You can browse featured projects in the Tech Projects section of this page. If you want specifics, ask “show AI projects” or “e‑commerce project details”.`;
        }
        if (/skill|stack|tech|tools/.test(text)) {
            return `Ananth works with JavaScript/TypeScript, Python, React, Node, AWS, and more. Want a particular area — frontend, backend, ML, or cloud?`;
        }
        if (/resume|cv/.test(text)) {
            return `You can find the résumé under Resumes in the assets folder or contact Ananth for the latest version. Want me to open the Contact section?`;
        }
        if (/contact|email|reach|connect/.test(text)) {
            return `You can reach Ananth at <a href="mailto:ananth.deepaksharma@gmail.com" class="chat-link">ananth.deepaksharma@gmail.com</a> or via the Contact section.`;
        }
        if (/github/.test(text)) {
            return `Here’s the GitHub profile: <a href="https://github.com/deeCoderick" target="_blank" rel="noopener noreferrer" class="chat-link">deeCoderick</a>.`;
        }
        if (/linkedin/.test(text)) {
            return `Here’s the LinkedIn: <a href="https://www.linkedin.com/in/ananthdeepaks/" target="_blank" rel="noopener noreferrer" class="chat-link">Ananth Deepak Sharma Nanduri</a>.`;
        }
        if (/who.*ananth|about.*ananth|tell.*ananth/.test(text)) {
            return `Ananth is a software engineer with projects across AI, web apps, and systems. You can explore the Journey and Skills sections for background and capabilities.`;
        }
        if (/donna|about you|who are you/.test(text)) {
            return `I’m D.O.N.N.A., an AI assistant for this portfolio. I’m in early development — for now I can answer portfolio questions and provide quick links.`;
        }
        
        // Generic, helpful fallback
        return `Got it! While I’m still being built, I can help with portfolio navigation, projects, skills, and contact details. Try “help” to see options — or ask me something specific.`;
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
                You can also ask me about Ananth's projects, skills, experience, or anything else!<br><br>
                Note: I’m currently in development — answers are simplified for now.`;
        }
        
        // Intelligent offline responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I’m in development and can help with basic information about Ananth’s portfolio.";
        }
        
        if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
            return "You can explore Ananth's projects in the Portfolio section. I’m in development mode — fuller answers are coming soon!";
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
            return "You can reach Ananth at ananth.deepaksharma@gmail.com or through the contact form.";
        }
        
        if (lowerMessage.includes('donna') || lowerMessage.includes('about you')) {
            return "I'm D.O.N.N.A., Ananth's AI assistant. I’m in active development — learn more at <a href='project-donna.html' class='chat-link'>Project D.O.N.N.A.</a>";
        }
        
        if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
            return "Ananth is proficient in various technologies including JavaScript, Python, React, AWS, and more. You can find his complete skill set in the Skills section. 💻";
        }
        
        if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
            return "Ananth has over 5 years of experience in software development, working with companies like Amazon and Wipro. Check out his journey section for more details! 💼";
        }
        
        return "I’m currently in development mode. I can still help with portfolio navigation, projects, skills, and contact details. Try “help” for options!";
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

    // Setup input restrictions and character counter
    function setupInputRestrictions() {
        if (!chatInput) return;
        
        // Set maxlength attribute
        chatInput.setAttribute('maxlength', CHATBOT_CONFIG.maxMessageLength);
        
        // Create character counter element
        const inputContainer = chatInput.closest('.chatbot-input');
        if (inputContainer && !characterCountElement) {
            characterCountElement = document.createElement('div');
            characterCountElement.className = 'character-counter';
            characterCountElement.innerHTML = `<span class="count">0</span>/${CHATBOT_CONFIG.maxMessageLength}`;
            inputContainer.appendChild(characterCountElement);
        }
        
        // Update character counter on input
        chatInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            const remaining = CHATBOT_CONFIG.maxMessageLength - currentLength;
            
            if (characterCountElement) {
                const countSpan = characterCountElement.querySelector('.count');
                if (countSpan) {
                    countSpan.textContent = currentLength;
                    
                    // Only show counter when user crosses 400 characters
                    if (currentLength > 400) {
                        characterCountElement.style.display = 'block';
                        
                        // Change color based on remaining characters
                        if (remaining < 50) {
                            characterCountElement.classList.add('warning');
                            characterCountElement.classList.remove('danger');
                        } else if (remaining < 20) {
                            characterCountElement.classList.add('danger');
                            characterCountElement.classList.remove('warning');
                        } else {
                            characterCountElement.classList.remove('warning', 'danger');
                        }
                    } else {
                        characterCountElement.style.display = 'none';
                        characterCountElement.classList.remove('warning', 'danger');
                    }
                }
            }
            
            // Disable send button if message is too long or empty
            if (chatSendBtn) {
                const trimmed = this.value.trim();
                chatSendBtn.disabled = isLoading || trimmed.length === 0 || trimmed.length > CHATBOT_CONFIG.maxMessageLength;
            }
        });
        
        // Update counter initially
        chatInput.dispatchEvent(new Event('input'));
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
.chatbot-input {
    padding: 16px;
    background: white;
    border-top: 1px solid #e1e5e9;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.chatbot-input .input-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.chatbot-input input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 25px;
    outline: none;
    font-size: 14px;
    transition: all 0.2s ease;
    background: #ffffff;
    resize: none;
    color: #333333;
    font-weight: 400;
}

.chatbot-input input:focus {
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.chatbot-input input:disabled {
    background: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
    border-color: #dee2e6;
}

.chatbot-input input::placeholder {
    color: #6c757d;
    opacity: 0.8;
    font-style: italic;
}

.chatbot-input button {
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    min-width: 80px;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.chatbot-input button:hover:not(:disabled) {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.chatbot-input button:active:not(:disabled) {
    transform: translateY(0);
}

.chatbot-input button:disabled {
    background: linear-gradient(135deg, #a0a0a0 0%, #888888 100%);
    color: #ffffff;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.7;
    border: 1px solid #999;
}

/* Character Counter */
.character-counter {
    font-size: 12px;
    color: #666;
    text-align: right;
    padding: 0 4px;
    transition: color 0.2s ease;
    display: none; /* Hidden by default */
}

.character-counter .count {
    font-weight: 600;
}

.character-counter.warning {
    color: #ff9800;
}

.character-counter.danger {
    color: #f44336;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

/* Responsive */
@media (max-width: 768px) {
    .chat-message {
        max-width: 90%;
        font-size: 14px;
    }
}

/* Development notice badge */
.beta-badge {
    display: inline-block;
    margin-left: 8px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    color: #4a5568;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    vertical-align: middle;
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