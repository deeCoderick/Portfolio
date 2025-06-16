# EC2 Chatbot Integration Guide

## Overview

This guide shows how to integrate your EC2 chatbot service with your portfolio using the optimized architecture. The integration provides:

- **Real-time AI responses** from your EC2 service
- **Offline fallback** with intelligent responses
- **Performance optimization** with caching and throttling
- **Enhanced UX** with typing indicators and animations
- **Error handling** with automatic retry logic
- **Message history** with localStorage persistence
- **Accessibility** features for screen readers

## Quick Start

### 1. Add the Chatbot Manager Script

Add this to your HTML pages after the app manager:

```html
<!-- Core Scripts -->
<script src="components/app-manager.js"></script>
<script src="components/optimized-chatbot-manager.js"></script>
<script src="assets/js/optimized-main.js"></script>
```

### 2. Include the Enhanced Styles

The optimized styles are already included in `assets/css/optimized-styles.css` with:
- Typing indicator animations
- Enhanced message bubbles
- Responsive design
- Dark theme support
- Accessibility features

### 3. Update Your HTML Structure

Ensure your chatbot HTML follows this structure:

```html
<div class="chatbot-icon" title="Chat with Donna">
    <!-- Your icon SVG -->
</div>

<div class="chatbot-window">
    <div class="chatbot-header">
        <h3>🤖 Donna - AI Assistant</h3>
        <button class="chatbot-close" aria-label="Close chat">×</button>
    </div>
    
    <div class="chatbot-messages" role="log" aria-live="polite">
        <!-- Messages appear here -->
    </div>
    
    <div class="chatbot-input">
        <input type="text" placeholder="Ask me anything..." maxlength="4000">
        <button type="button">Send</button>
    </div>
</div>
```

## Configuration

### API Configuration

The chatbot manager is pre-configured with your EC2 service:

```javascript
apiConfig: {
    baseURL: 'https://assistantdonna.duckdns.org',
    token: '804c3cef87b4b6dbdccc2c13c99d05389a34cb664bf97b9887cfea12467f3779',
    clientId: 'PersonalPortfolioAssistant',
    timeout: 30000,
    retryAttempts: 3
}
```

### Customization Options

You can customize the chatbot behavior:

```javascript
document.addEventListener('app:ready', function(event) {
    const app = event.detail.app;
    const chatbot = app.getModule('chatbot');
    
    if (chatbot) {
        // Customize API settings
        chatbot.options.apiConfig.temperature = 0.8;
        chatbot.options.apiConfig.max_tokens = 1500;
        
        // Customize UI settings
        chatbot.options.ui.welcomeDelay = 300;
        chatbot.options.ui.enableTypingIndicator = true;
        
        // Customize features
        chatbot.options.features.enableMessageHistory = true;
        chatbot.options.features.enableAutoSave = true;
    }
});
```

## Features

### 1. Real-time AI Responses

Messages are sent to your EC2 service at `https://assistantdonna.duckdns.org/chat` with:

```json
{
    "client_id": "PersonalPortfolioAssistant",
    "message": "User's message",
    "temperature": 0.7,
    "max_tokens": 1000
}
```

### 2. Offline Mode

When the API is unavailable, the chatbot provides intelligent offline responses:

- Greeting responses
- Portfolio navigation help
- Contact information
- Project information links
- Fallback messages

### 3. Message History

- Automatically saves chat history to localStorage
- Loads recent history (last 24 hours) on page refresh
- Provides `clearHistory()` method for manual clearing

### 4. Error Handling

- Automatic retry with exponential backoff
- Graceful degradation to offline mode
- User-friendly error messages
- Connection status monitoring

### 5. Performance Optimizations

- DOM query caching
- Throttled scroll events
- Lazy loading of heavy operations
- Memory management with cleanup

### 6. Accessibility Features

- ARIA labels and roles
- Screen reader announcements
- Keyboard navigation support
- High contrast mode support
- Focus management

## API Integration Details

### Request Format

Your EC2 service receives POST requests to `/chat` with:

```javascript
{
    "client_id": "PersonalPortfolioAssistant",
    "message": "User's question",
    "temperature": 0.7,
    "max_tokens": 1000
}
```

### Response Format

Your service should return:

```javascript
{
    "response": "AI assistant's response text"
}
```

### Health Check

The chatbot tests connectivity with GET requests to `/health` endpoint.

### Authentication

All requests include the Authorization header:
```
Authorization: Bearer 804c3cef87b4b6dbdccc2c13c99d05389a34cb664bf97b9887cfea12467f3779
```

## Advanced Customization

### Custom Commands

Add custom offline commands:

```javascript
function setupCustomCommands(chatbot) {
    const originalGetOfflineResponse = chatbot.getOfflineResponse.bind(chatbot);
    
    chatbot.getOfflineResponse = function(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('clear chat')) {
            this.clearHistory();
            return "Chat history cleared!";
        }
        
        if (lowerMessage.includes('stats')) {
            const stats = this.getStats();
            return `Total messages: ${stats.totalMessages}`;
        }
        
        return originalGetOfflineResponse(message);
    };
}
```

### Analytics Integration

Track chatbot usage:

```javascript
function setupChatbotAnalytics(chatbot) {
    const originalSendMessage = chatbot.sendMessage.bind(chatbot);
    
    chatbot.sendMessage = async function(message) {
        // Track message sent
        if (typeof gtag !== 'undefined') {
            gtag('event', 'chatbot_message_sent', {
                'message_length': message.length
            });
        }
        
        return originalSendMessage(message);
    };
}
```

### Environment-specific Configuration

Configure different settings for different environments:

```javascript
function getAPIConfig() {
    const hostname = window.location.hostname;
    
    if (hostname === 'your-domain.com') {
        return {
            baseURL: 'https://assistantdonna.duckdns.org',
            clientId: 'ProductionPortfolioAssistant'
        };
    }
    
    return {
        baseURL: 'https://assistantdonna.duckdns.org',
        clientId: 'DevPortfolioAssistant'
    };
}
```

## Testing

### Connection Test

Test your EC2 service connectivity:

```javascript
async function testChatbotConnection() {
    try {
        const response = await fetch('https://assistantdonna.duckdns.org/health', {
            headers: {
                'Authorization': 'Bearer YOUR_TOKEN'
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('Connection test failed:', error);
        return false;
    }
}
```

### Message Test

Send a test message:

```javascript
async function testChatbotMessage() {
    try {
        const response = await fetch('https://assistantdonna.duckdns.org/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_TOKEN'
            },
            body: JSON.stringify({
                client_id: 'TestClient',
                message: 'Hello, this is a test message',
                temperature: 0.7,
                max_tokens: 100
            })
        });
        
        const data = await response.json();
        console.log('Test response:', data.response);
        return true;
    } catch (error) {
        console.error('Message test failed:', error);
        return false;
    }
}
```

## Deployment

### 1. Upload Files

Upload these files to your server:
- `components/optimized-chatbot-manager.js`
- Updated `components/app-manager.js`
- Updated `assets/css/optimized-styles.css`

### 2. Update HTML Pages

Add the chatbot manager script to your HTML pages:

```html
<script src="components/optimized-chatbot-manager.js"></script>
```

### 3. Test Integration

1. Open your portfolio in a browser
2. Open browser console
3. Look for "✅ Chatbot API connection successful"
4. Click the chatbot icon
5. Send a test message

### 4. Monitor Performance

Check the browser console for:
- Connection status messages
- Error logs
- Performance metrics

## Troubleshooting

### Common Issues

1. **Chatbot not appearing**: Check if HTML structure matches expected format
2. **API connection failed**: Verify EC2 service is running and accessible
3. **Messages not sending**: Check browser console for JavaScript errors
4. **Styling issues**: Ensure optimized-styles.css is loaded

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('chatbot_debug', 'true');
location.reload();
```

### Performance Monitoring

Check performance metrics:

```javascript
// In browser console
console.log(portfolioApp.getModule('chatbot').getStats());
```

## Security Considerations

1. **API Token**: Keep your API token secure and consider rotating it regularly
2. **Rate Limiting**: Implement rate limiting on your EC2 service
3. **Input Validation**: Validate user input on both client and server
4. **HTTPS**: Ensure all communication uses HTTPS
5. **CORS**: Configure proper CORS headers on your EC2 service

## Performance Tips

1. **Caching**: The chatbot automatically caches DOM queries
2. **Throttling**: Message sending is throttled to prevent spam
3. **Lazy Loading**: Heavy operations are lazy-loaded
4. **Memory Management**: Automatic cleanup prevents memory leaks
5. **Offline Storage**: Message history is stored efficiently

## Support

For issues or questions:
1. Check browser console for error messages
2. Test API connectivity directly
3. Verify HTML structure matches requirements
4. Check network tab for failed requests

The integration provides a robust, performant, and user-friendly chatbot experience that seamlessly connects your portfolio with your EC2 AI service. 