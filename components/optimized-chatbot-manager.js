/**
 * Optimized Chatbot Manager
 * Integrates with EC2 chatbot service and portfolio app architecture
 * Provides enhanced UI, error handling, and performance optimizations
 */

class OptimizedChatbotManager {
    constructor(app, options = {}) {
        this.app = app;
        this.options = {
            // EC2 Service Configuration
            apiConfig: {
                baseURL: 'https://assistantdonna.duckdns.org',
                token: '804c3cef87b4b6dbdccc2c13c99d05389a34cb664bf97b9887cfea12467f3779',
                clientId: 'PersonalPortfolioAssistant',
                timeout: 30000,
                retryAttempts: 3
            },
            // UI Configuration
            ui: {
                enableTypingIndicator: true,
                enableSoundEffects: false,
                animationDuration: 300,
                maxMessageLength: 4000,
                welcomeDelay: 500
            },
            // Feature flags
            features: {
                enableOfflineMode: true,
                enableMessageHistory: true,
                enableAutoSave: true,
                enableAnalytics: false
            },
            ...options
        };
        
        this.elements = {};
        this.isInitialized = false;
        this.isLoading = false;
        this.isFirstOpen = true;
        this.messageHistory = [];
        this.retryCount = 0;
        
        // Bind methods
        this.handleIconClick = this.handleIconClick.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    /**
     * Initialize chatbot manager
     */
    async init() {
        if (this.isInitialized) return;
        
        // Cache DOM elements
        this.cacheElements();
        
        // Check if chatbot elements exist
        if (!this.elements.icon || !this.elements.window) {
            console.info('Chatbot elements not found - functionality disabled for this page');
            return;
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load message history
        if (this.options.features.enableMessageHistory) {
            this.loadMessageHistory();
        }
        
        // Test API connection
        await this.testConnection();
        
        this.isInitialized = true;
        console.debug('Chatbot Manager initialized');
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            icon: this.app.$1('.chatbot-icon'),
            window: this.app.$1('.chatbot-window'),
            close: this.app.$1('.chatbot-close'),
            header: this.app.$1('.chatbot-header'),
            messages: this.app.$1('.chatbot-messages'),
            input: this.app.$1('.chatbot-input input'),
            sendBtn: this.app.$1('.chatbot-input button'),
            typingIndicator: this.app.$1('.typing-indicator')
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const { icon, close, header, input, sendBtn } = this.elements;
        
        // Toggle chatbot window
        if (icon) {
            icon.addEventListener('click', this.handleIconClick);
        }
        
        // Close chatbot
        if (close) {
            close.addEventListener('click', this.handleCloseClick);
        }
        
        // Minimize on header click
        if (header) {
            header.addEventListener('click', this.handleCloseClick);
        }
        
        // Send message
        if (sendBtn) {
            sendBtn.addEventListener('click', this.handleSendMessage);
        }
        
        // Enter key to send
        if (input) {
            input.addEventListener('keypress', this.handleKeyPress);
        }
        
        // Close on outside click
        document.addEventListener('click', this.handleOutsideClick);
        
        // Handle visibility change for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseOperations();
            } else {
                this.resumeOperations();
            }
        });
    }

    /**
     * Handle chatbot icon click
     */
    handleIconClick(e) {
        e.stopPropagation();
        this.toggleChatbot();
    }

    /**
     * Handle close button click
     */
    handleCloseClick(e) {
        e.stopPropagation();
        this.closeChatbot();
    }

    /**
     * Handle send message
     */
    async handleSendMessage() {
        const message = this.elements.input?.value.trim();
        if (!message || this.isLoading) return;
        
        await this.sendMessage(message);
        this.elements.input.value = '';
    }

    /**
     * Handle key press in input
     */
    handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
        }
    }

    /**
     * Handle outside click
     */
    handleOutsideClick(e) {
        const { window: chatWindow, icon } = this.elements;
        
        if (chatWindow && icon && 
            !chatWindow.contains(e.target) && 
            !icon.contains(e.target)) {
            this.closeChatbot();
        }
    }

    /**
     * Toggle chatbot window
     */
    toggleChatbot() {
        const { window: chatWindow } = this.elements;
        if (!chatWindow) return;
        
        const isActive = chatWindow.classList.contains('active');
        
        if (isActive) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    /**
     * Open chatbot window
     */
    async openChatbot() {
        const { window: chatWindow } = this.elements;
        if (!chatWindow) return;
        
        chatWindow.classList.add('active');
        
        // Show welcome messages on first open
        if (this.isFirstOpen) {
            await this.showWelcomeMessages();
            this.isFirstOpen = false;
        }
        
        // Focus input
        if (this.elements.input) {
            setTimeout(() => this.elements.input.focus(), 100);
        }
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('chatbot:opened'));
    }

    /**
     * Close chatbot window
     */
    closeChatbot() {
        const { window: chatWindow } = this.elements;
        if (!chatWindow) return;
        
        chatWindow.classList.remove('active');
        
        // Save message history
        if (this.options.features.enableAutoSave) {
            this.saveMessageHistory();
        }
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('chatbot:closed'));
    }

    /**
     * Show welcome messages
     */
    async showWelcomeMessages() {
        const welcomeMessages = [
            "👋 Hello there! I'm Donna, your AI assistant.",
            "Welcome to Ananth's portfolio! I can help you navigate and answer questions about his work, skills, and projects.",
            "How can I assist you today?"
        ];
        
        for (let i = 0; i < welcomeMessages.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    this.addBotMessage(welcomeMessages[i]);
                    resolve();
                }, this.options.ui.welcomeDelay * (i + 1));
            });
        }
    }

    /**
     * Send message to EC2 service
     */
    async sendMessage(message) {
        if (this.isLoading || !message.trim()) return;
        
        this.isLoading = true;
        this.updateUI();
        
        // Add user message
        this.addUserMessage(message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await this.callChatbotAPI(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response
            this.addBotMessage(response);
            
            // Reset retry count on success
            this.retryCount = 0;
            
        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTypingIndicator();
            
            // Handle different error types
            if (this.retryCount < this.options.apiConfig.retryAttempts) {
                this.retryCount++;
                this.addBotMessage(
                    `Connection issue. Retrying... (${this.retryCount}/${this.options.apiConfig.retryAttempts})`
                );
                
                // Retry after delay
                setTimeout(() => this.sendMessage(message), 2000);
            } else {
                this.addBotMessage(this.getOfflineResponse(message), true);
                this.retryCount = 0;
            }
        } finally {
            this.isLoading = false;
            this.updateUI();
        }
    }

    /**
     * Call chatbot API
     */
    async callChatbotAPI(message) {
        const { apiConfig } = this.options;
        
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

    /**
     * Get offline response when API is unavailable
     */
    getOfflineResponse(message) {
        const lowerMessage = message.toLowerCase();
        
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
        
        return "I'm currently experiencing connectivity issues with my AI service. Please try again in a moment, or explore the portfolio manually. For urgent inquiries, please use the contact form.";
    }

    /**
     * Add user message to chat
     */
    addUserMessage(message) {
        const messageData = {
            content: message,
            sender: 'user',
            timestamp: new Date().toISOString()
        };
        
        this.messageHistory.push(messageData);
        this.renderMessage(messageData);
    }

    /**
     * Add bot message to chat
     */
    addBotMessage(message, isError = false) {
        const messageData = {
            content: message,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            isError
        };
        
        this.messageHistory.push(messageData);
        this.renderMessage(messageData);
    }

    /**
     * Render message in chat
     */
    renderMessage(messageData) {
        const { messages } = this.elements;
        if (!messages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${messageData.sender}-message`;
        
        if (messageData.isError) {
            messageElement.classList.add('error-message');
        }
        
        // Use innerHTML for bot messages to support links, textContent for user messages
        if (messageData.sender === 'bot') {
            messageElement.innerHTML = messageData.content;
        } else {
            messageElement.textContent = messageData.content;
        }
        
        messages.appendChild(messageElement);
        this.scrollToBottom();
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        if (!this.options.ui.enableTypingIndicator) return;
        
        let indicator = this.elements.typingIndicator;
        
        if (!indicator) {
            indicator = this.createTypingIndicator();
        }
        
        indicator.style.display = 'block';
        this.scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        const indicator = this.elements.typingIndicator;
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    /**
     * Create typing indicator element
     */
    createTypingIndicator() {
        const { messages } = this.elements;
        if (!messages) return null;
        
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
        
        messages.appendChild(indicator);
        this.elements.typingIndicator = indicator;
        
        return indicator;
    }

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        const { messages } = this.elements;
        if (messages) {
            messages.scrollTop = messages.scrollHeight;
        }
    }

    /**
     * Update UI based on loading state
     */
    updateUI() {
        const { sendBtn, input } = this.elements;
        
        if (sendBtn) {
            sendBtn.disabled = this.isLoading;
            sendBtn.textContent = this.isLoading ? 'Sending...' : 'Send';
        }
        
        if (input) {
            input.disabled = this.isLoading;
        }
    }

    /**
     * Test API connection
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.options.apiConfig.baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.options.apiConfig.token}`
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

    /**
     * Save message history to localStorage
     */
    saveMessageHistory() {
        if (!this.options.features.enableMessageHistory) return;
        
        try {
            const historyData = {
                messages: this.messageHistory,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('chatbot_history', JSON.stringify(historyData));
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    }

    /**
     * Load message history from localStorage
     */
    loadMessageHistory() {
        if (!this.options.features.enableMessageHistory) return;
        
        try {
            const historyData = localStorage.getItem('chatbot_history');
            if (historyData) {
                const parsed = JSON.parse(historyData);
                
                // Only load recent history (last 24 hours)
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                const historyDate = new Date(parsed.timestamp);
                
                if (historyDate > dayAgo) {
                    this.messageHistory = parsed.messages || [];
                    
                    // Render existing messages
                    this.messageHistory.forEach(message => {
                        this.renderMessage(message);
                    });
                }
            }
        } catch (error) {
            console.warn('Failed to load chat history:', error);
        }
    }

    /**
     * Clear message history
     */
    clearHistory() {
        this.messageHistory = [];
        
        if (this.elements.messages) {
            this.elements.messages.innerHTML = '';
        }
        
        localStorage.removeItem('chatbot_history');
    }

    /**
     * Pause operations when tab is hidden
     */
    pauseOperations() {
        // Pause any ongoing operations for performance
        this.hideTypingIndicator();
    }

    /**
     * Resume operations when tab is visible
     */
    resumeOperations() {
        // Resume operations if needed
    }

    /**
     * Get chat statistics
     */
    getStats() {
        return {
            totalMessages: this.messageHistory.length,
            userMessages: this.messageHistory.filter(m => m.sender === 'user').length,
            botMessages: this.messageHistory.filter(m => m.sender === 'bot').length,
            errorMessages: this.messageHistory.filter(m => m.isError).length,
            isConnected: this.retryCount === 0
        };
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        // Remove event listeners
        const { icon, close, header, input, sendBtn } = this.elements;
        
        if (icon) icon.removeEventListener('click', this.handleIconClick);
        if (close) close.removeEventListener('click', this.handleCloseClick);
        if (header) header.removeEventListener('click', this.handleCloseClick);
        if (sendBtn) sendBtn.removeEventListener('click', this.handleSendMessage);
        if (input) input.removeEventListener('keypress', this.handleKeyPress);
        
        document.removeEventListener('click', this.handleOutsideClick);
        
        // Save history before destroying
        if (this.options.features.enableAutoSave) {
            this.saveMessageHistory();
        }
        
        // Clear elements
        this.elements = {};
        this.isInitialized = false;
    }
}

// Export for use with app manager
if (typeof window !== 'undefined') {
    window.OptimizedChatbotManager = OptimizedChatbotManager;
}
