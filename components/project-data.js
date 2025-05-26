/**
 * Project Data Configuration
 * Centralized data for all projects to be used with ProjectTemplate
 */

const projectsData = {
    'donna': {
        id: 'donna',
        title: 'Project D.O.N.N.A.',
        date: '2024',
        image: 'assets/images/DonnaPersonal.jpg',
        techStack: ['LLM', 'NLP', 'TTS', 'Python', 'React', 'AWS'],
        overview: 'D.O.N.N.A. (Dynamic Orchestrator for Neural-based Next-generation Assistance) is an advanced AI assistant that combines state-of-the-art language models with natural voice interaction and a uniquely crafted personality. Built to be more than just a virtual assistant, D.O.N.N.A. brings together technical capability with human-like interaction patterns.',
        features: [
            '<strong>Natural Language Understanding:</strong> Powered by advanced LLMs (Language Learning Models) for deep comprehension of user queries and context maintenance.',
            '<strong>Natural Voice Interaction:</strong> High-quality text-to-speech and speech-to-text capabilities for seamless vocal communication.',
            '<strong>Adaptive Personality:</strong> Dynamic response generation with contextual humor and emotional intelligence.',
            '<strong>Multi-modal Interaction:</strong> Supports text, voice, and visual inputs for comprehensive communication.',
            '<strong>Real-time Processing:</strong> Optimized response generation with minimal latency.',
            '<strong>Context Awareness:</strong> Maintains conversation history and adapts responses based on user preferences and past interactions.'
        ],
        architecture: {
            'Core Components': [
                '<strong>Language Processing Engine:</strong> Custom-trained LLM for natural language understanding, Context management system for conversation tracking, Sentiment analysis for emotional intelligence',
                '<strong>Voice System:</strong> Advanced TTS engine for natural speech synthesis, Real-time voice recognition with accent adaptation, Prosody and emotion modeling for expressive speech',
                '<strong>Personality Module:</strong> Dynamic response generation with contextual humor, Personality trait modeling for consistent interaction, Adaptive behavior based on user preferences'
            ],
            'Backend': [
                'Python for core processing and ML operations',
                'FastAPI for high-performance API endpoints',
                'Redis for real-time data and context management'
            ],
            'Frontend': [
                'React for responsive web interface',
                'WebSocket for real-time communication',
                'Web Speech API for browser-based voice interaction'
            ],
            'Cloud Infrastructure': [
                'AWS Lambda for serverless computing',
                'Amazon Polly for TTS capabilities',
                'AWS SageMaker for ML model deployment'
            ]
        },
        uniqueAspects: [
            '<strong>Personality Development:</strong> D.O.N.N.A.\'s personality is crafted through a combination of carefully curated training data and dynamic response generation, allowing for witty, contextual humor while maintaining professionalism.',
            '<strong>Emotional Intelligence:</strong> Advanced sentiment analysis and context tracking enable D.O.N.N.A. to provide emotionally appropriate responses and maintain conversation flow naturally.',
            '<strong>Learning Capability:</strong> Continuous learning from interactions helps improve response quality and personality adaptation over time.'
        ],
        futureEnhancements: [
            'Integration with more third-party services and APIs',
            'Enhanced multi-language support with accent recognition',
            'Advanced emotion recognition in voice inputs',
            'Expanded personality customization options',
            'AR/VR integration for immersive interaction'
        ],
        customSections: [
            {
                title: 'Character Inspiration: Donna Paulsen',
                content: `<p>The D.O.N.N.A. AI assistant is inspired by the iconic character Donna Paulsen from the TV series "Suits" (USA Network, 2011–2019), portrayed by Sarah Rafferty.</p>
                
                <h3>Character Overview</h3>
                <p>Donna Paulsen is intelligent, charismatic, sassy, and deeply loyal, known for her quick wit, exceptional memory, and intuitive understanding of people and situations. Her unofficial motto might as well be: "I'm Donna." That line alone encapsulates her confidence and mystique.</p>
                
                <h3>Key Traits</h3>
                <ul>
                    <li><strong>Witty:</strong> Quick with clever remarks and sarcastic comebacks</li>
                    <li><strong>Elegant:</strong> Always stylish and carries herself with grace</li>
                    <li><strong>Smart:</strong> Though not a lawyer, she knows legal strategy and firm politics intimately</li>
                    <li><strong>Loyal:</strong> Her devotion to Harvey and the firm is unmatched</li>
                    <li><strong>Honest:</strong> Doesn't sugarcoat the truth, especially with people she cares about</li>
                    <li><strong>Dramatic:</strong> Loves drama, quoting plays, and creating emotional moments</li>
                    <li><strong>Morally Strong:</strong> Often the conscience of the group, challenging unethical decisions</li>
                </ul>
                
                <h3>D.O.N.N.A. AI Implementation</h3>
                <p>Our AI assistant embodies many of Donna Paulsen's characteristics:</p>
                <ul>
                    <li>Quick wit and appropriate humor in responses</li>
                    <li>Exceptional memory (through conversation context tracking)</li>
                    <li>Intuitive understanding of user needs</li>
                    <li>Professional yet personable communication style</li>
                    <li>Capability to anticipate needs before they're explicitly stated</li>
                    <li>Moral compass and ethical judgment in advice and actions</li>
                </ul>`
            }
        ]
    },

    'ai-task-manager': {
        id: 'ai-task-manager',
        title: 'AI Task Manager',
        date: '2024',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        techStack: ['Python', 'Django', 'TensorFlow', 'PostgreSQL', 'React', 'Redis'],
        overview: 'An intelligent task management application that uses machine learning to prioritize tasks, suggest optimal scheduling, and provide productivity insights based on user behavior patterns.',
        features: [
            'Smart task prioritization using ML models',
            'Personalized scheduling recommendations',
            'Productivity analytics and insights',
            'Task reminders and notifications',
            'Multi-user support with role-based access',
            'Responsive web interface',
            'Integration with calendar applications',
            'Real-time collaboration features'
        ],
        architecture: {
            'Backend': [
                'Python (Django) for API and business logic',
                'PostgreSQL for persistent storage',
                'Redis for caching and real-time features'
            ],
            'Machine Learning': [
                'TensorFlow for task prioritization models',
                'Scikit-learn for productivity analytics',
                'Natural Language Processing for task categorization'
            ],
            'Frontend': [
                'React for interactive user interface',
                'Redux for state management',
                'Material-UI for consistent design'
            ]
        },
        uniqueAspects: [
            'Adaptive learning from user behavior patterns',
            'Real-time productivity feedback and suggestions',
            'Customizable task categories and workflows',
            'Intelligent deadline prediction based on historical data'
        ],
        futureEnhancements: [
            'Voice-controlled task management',
            'Mobile application development',
            'Advanced team collaboration features',
            'Integration with more third-party tools'
        ]
    },

    'ai-knowledge-lake': {
        id: 'ai-knowledge-lake',
        title: 'AI Knowledge Lake',
        date: '2024',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
        techStack: ['Python', 'FastAPI', 'Elasticsearch', 'Neo4j', 'React', 'Docker'],
        overview: 'A comprehensive knowledge management system that uses AI to organize, categorize, and retrieve information from vast data repositories with intelligent search and recommendation capabilities.',
        features: [
            'Intelligent document indexing and categorization',
            'Semantic search with natural language queries',
            'Knowledge graph visualization',
            'Automated content summarization',
            'Collaborative knowledge building',
            'Version control for knowledge assets',
            'Multi-format document support',
            'Real-time knowledge recommendations'
        ],
        architecture: {
            'Data Layer': [
                'Elasticsearch for full-text search and indexing',
                'Neo4j for knowledge graph storage',
                'PostgreSQL for metadata and user management'
            ],
            'AI/ML Components': [
                'Transformer models for document understanding',
                'Graph neural networks for relationship extraction',
                'Clustering algorithms for content organization'
            ],
            'API Layer': [
                'FastAPI for high-performance REST APIs',
                'GraphQL for flexible data querying',
                'WebSocket for real-time updates'
            ]
        },
        uniqueAspects: [
            'Dynamic knowledge graph construction from unstructured data',
            'Context-aware search that understands user intent',
            'Automated knowledge gap identification',
            'Cross-domain knowledge linking and discovery'
        ],
        futureEnhancements: [
            'Multi-language support and translation',
            'Advanced visualization tools',
            'Integration with external knowledge bases',
            'Automated fact-checking capabilities'
        ]
    },

    'universal-mcp-gateway': {
        id: 'universal-mcp-gateway',
        title: 'Universal MCP Gateway',
        date: '2024',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        techStack: ['Node.js', 'TypeScript', 'Docker', 'Kubernetes', 'Redis', 'MongoDB'],
        overview: 'A universal gateway system for Model Context Protocol (MCP) that enables seamless integration and communication between different AI models and services.',
        features: [
            'Protocol translation between different MCP implementations',
            'Load balancing and failover for AI services',
            'Real-time monitoring and analytics',
            'Security and authentication layer',
            'Rate limiting and quota management',
            'Plugin architecture for extensibility',
            'Multi-tenant support',
            'Comprehensive logging and debugging tools'
        ],
        architecture: [
            '<strong>Gateway Core:</strong> Node.js/TypeScript for high-performance request handling',
            '<strong>Service Discovery:</strong> Kubernetes for container orchestration and service mesh',
            '<strong>Data Storage:</strong> MongoDB for configuration and Redis for caching',
            '<strong>Monitoring:</strong> Prometheus and Grafana for metrics and visualization'
        ],
        uniqueAspects: [
            'Universal protocol adaptation for any MCP-compatible service',
            'Dynamic routing based on model capabilities and availability',
            'Intelligent caching to reduce latency and costs',
            'Built-in A/B testing framework for model comparison'
        ],
        futureEnhancements: [
            'GraphQL federation support',
            'Advanced circuit breaker patterns',
            'Machine learning-based routing optimization',
            'Enhanced security with zero-trust architecture'
        ]
    },

    'weather-visualization-dashboard': {
        id: 'weather-dashboard',
        title: 'Weather Visualization Dashboard',
        date: '2024',
        image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        techStack: ['React', 'D3.js', 'Node.js', 'Express', 'MongoDB', 'WebSocket'],
        overview: 'An interactive weather visualization dashboard that provides real-time weather data, forecasts, and climate analytics with beautiful, responsive visualizations.',
        features: [
            'Real-time weather data visualization',
            'Interactive maps with weather overlays',
            'Historical weather trend analysis',
            'Customizable dashboard widgets',
            'Weather alerts and notifications',
            'Multi-location comparison tools',
            'Export capabilities for data and visualizations',
            'Mobile-responsive design'
        ],
        architecture: [
            '<strong>Frontend:</strong> React with D3.js for interactive visualizations',
            '<strong>Backend:</strong> Node.js/Express for API services',
            '<strong>Database:</strong> MongoDB for weather data storage',
            '<strong>Real-time:</strong> WebSocket for live data updates'
        ],
        uniqueAspects: [
            'Advanced data visualization techniques for weather patterns',
            'Predictive analytics for weather forecasting',
            'Integration with multiple weather data sources',
            'Customizable alerting system based on weather conditions'
        ],
        futureEnhancements: [
            'Machine learning for improved weather predictions',
            'Satellite imagery integration',
            'Climate change impact analysis',
            'API for third-party integrations'
        ]
    },

    'e-commerce-platform': {
        id: 'e-commerce-platform',
        title: 'E-Commerce Platform',
        date: '2024',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS', 'Docker'],
        overview: 'A full-featured e-commerce platform with modern design, secure payment processing, inventory management, and comprehensive admin tools.',
        features: [
            'Product catalog with advanced search and filtering',
            'Secure payment processing with multiple gateways',
            'Inventory management and tracking',
            'Order management and fulfillment',
            'Customer account management',
            'Admin dashboard with analytics',
            'Mobile-responsive design',
            'SEO optimization tools'
        ],
        architecture: [
            '<strong>Frontend:</strong> React with Redux for state management',
            '<strong>Backend:</strong> Node.js/Express with RESTful APIs',
            '<strong>Database:</strong> PostgreSQL for relational data',
            '<strong>Payments:</strong> Stripe integration for secure transactions'
        ],
        uniqueAspects: [
            'Microservices architecture for scalability',
            'Advanced recommendation engine',
            'Real-time inventory synchronization',
            'Comprehensive analytics and reporting'
        ],
        futureEnhancements: [
            'AI-powered product recommendations',
            'Multi-vendor marketplace support',
            'Advanced fraud detection',
            'International shipping and tax calculation'
        ]
    },

    'multi-agent-research-assistant': {
        id: 'research-assistant',
        title: 'Multi-Agent Research Assistant',
        date: '2024',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        techStack: ['Python', 'LangChain', 'OpenAI', 'Pinecone', 'FastAPI', 'React'],
        overview: 'An intelligent research assistant that uses multiple AI agents to gather, analyze, and synthesize information from various sources to provide comprehensive research reports.',
        features: [
            'Multi-agent coordination for complex research tasks',
            'Automated source discovery and validation',
            'Intelligent information synthesis',
            'Citation management and formatting',
            'Collaborative research workflows',
            'Real-time fact-checking',
            'Export to multiple formats',
            'Version control for research projects'
        ],
        architecture: [
            '<strong>Agent Framework:</strong> LangChain for multi-agent orchestration',
            '<strong>AI Models:</strong> OpenAI GPT for language understanding',
            '<strong>Vector Database:</strong> Pinecone for semantic search',
            '<strong>API Layer:</strong> FastAPI for backend services'
        ],
        uniqueAspects: [
            'Specialized agents for different research domains',
            'Automated bias detection in sources',
            'Dynamic research strategy adaptation',
            'Collaborative human-AI research workflows'
        ],
        futureEnhancements: [
            'Integration with academic databases',
            'Advanced visualization of research findings',
            'Peer review and collaboration features',
            'Multi-language research capabilities'
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = projectsData;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.projectsData = projectsData;
} 