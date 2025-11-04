/**
 * Update Project Links Script
 * Updates all project links to use the new dynamic template system
 */

// Project ID mappings for the new system
const projectMappings = {
    'project-donna.html': 'donna',
    'project-ai-task-manager.html': 'ai-task-manager',
    'project-ai-task-manager-new.html': 'ai-task-manager',
    'project-ai-knowledge-lake.html': 'ai-knowledge-lake',
    'project-universal-mcp-gateway.html': 'universal-mcp-gateway',
    'project-weather-visualization-dashboard.html': 'weather-dashboard',
    'project-e-commerce-platform.html': 'e-commerce-platform',
    'project-multi-agent-research-assistant.html': 'research-assistant'
};

/**
 * Generate new project URL using the dynamic template
 * @param {string} projectId - The project identifier
 * @returns {string} New URL for the project
 */
function generateProjectURL(projectId) {
    return `project-template.html?project=${projectId}`;
}

/**
 * Update project links in HTML content
 * @param {string} htmlContent - HTML content to update
 * @returns {string} Updated HTML content
 */
function updateProjectLinks(htmlContent) {
    let updatedContent = htmlContent;
    
    // Update each project link
    Object.entries(projectMappings).forEach(([oldFile, projectId]) => {
        const newURL = generateProjectURL(projectId);
        
        // Replace href attributes
        const hrefPattern = new RegExp(`href=["']${oldFile}["']`, 'g');
        updatedContent = updatedContent.replace(hrefPattern, `href="${newURL}"`);
        
        // Replace any other references
        const generalPattern = new RegExp(oldFile, 'g');
        updatedContent = updatedContent.replace(generalPattern, newURL);
    });
    
    return updatedContent;
}

/**
 * Generate portfolio section with updated links
 * @returns {string} Portfolio section HTML with updated links
 */
function generateUpdatedPortfolioSection() {
    return `
<!-- Portfolio Section with Updated Links -->
<section id="portfolio" class="portfolio">
    <div class="container">
        <h2 class="section-title">My Projects</h2>
        <div class="portfolio-grid">
            
            <!-- Project D.O.N.N.A. -->
            <div class="portfolio-item">
                <div class="portfolio-image">
                    <img src="assets/images/DonnaPersonal.jpg" alt="Project D.O.N.N.A.">
                    <div class="portfolio-overlay">
                        <div class="portfolio-content">
                            <h3>Project D.O.N.N.A.</h3>
                            <p>Advanced AI Assistant with Natural Voice Interaction</p>
                            <div class="portfolio-tech">
                                <span>LLM</span>
                                <span>NLP</span>
                                <span>TTS</span>
                                <span>Python</span>
                                <span>React</span>
                                <span>AWS</span>
                            </div>
                            <a href="${generateProjectURL('donna')}" class="btn-primary">View Project</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AI Task Manager -->
            <div class="portfolio-item">
                <div class="portfolio-image">
                    <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="AI Task Manager">
                    <div class="portfolio-overlay">
                        <div class="portfolio-content">
                            <h3>AI Task Manager</h3>
                            <p>Intelligent Task Management with ML-powered Prioritization</p>
                            <div class="portfolio-tech">
                                <span>Python</span>
                                <span>Django</span>
                                <span>TensorFlow</span>
                                <span>PostgreSQL</span>
                                <span>React</span>
                            </div>
                            <a href="${generateProjectURL('ai-task-manager')}" class="btn-primary">View Project</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AI Knowledge Lake -->
            <div class="portfolio-item">
                <div class="portfolio-image">
                    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80" alt="AI Knowledge Lake">
                    <div class="portfolio-overlay">
                        <div class="portfolio-content">
                            <h3>AI Knowledge Lake</h3>
                            <p>Comprehensive Knowledge Management with AI-powered Search</p>
                            <div class="portfolio-tech">
                                <span>Python</span>
                                <span>FastAPI</span>
                                <span>Elasticsearch</span>
                                <span>Neo4j</span>
                                <span>React</span>
                            </div>
                            <a href="${generateProjectURL('ai-knowledge-lake')}" class="btn-primary">View Project</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Universal MCP Gateway -->
            <div class="portfolio-item">
                <div class="portfolio-image">
                    <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Universal MCP Gateway">
                    <div class="portfolio-overlay">
                        <div class="portfolio-content">
                            <h3>Universal MCP Gateway</h3>
                            <p>Gateway System for Model Context Protocol Integration</p>
                            <div class="portfolio-tech">
                                <span>Node.js</span>
                                <span>TypeScript</span>
                                <span>Docker</span>
                                <span>Kubernetes</span>
                                <span>Redis</span>
                            </div>
                            <a href="${generateProjectURL('universal-mcp-gateway')}" class="btn-primary">View Project</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Weather Visualization Dashboard -->
            <div class="portfolio-item">
                <div class="portfolio-image">
                    <img src="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Weather Dashboard">
                    <div class="portfolio-overlay">
                        <div class="portfolio-content">
                            <h3>Weather Visualization Dashboard</h3>
                            <p>Interactive Weather Data Visualization and Analytics</p>
                            <div class="portfolio-tech">
                                <span>React</span>
                                <span>D3.js</span>
                                <span>Node.js</span>
                                <span>MongoDB</span>
                                <span>WebSocket</span>
                            </div>
                            <a href="${generateProjectURL('weather-dashboard')}" class="btn-primary">View Project</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- E-Commerce Platform -->
            <div class="portfolio-item">
                <div class="portfolio-image">
                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="E-Commerce Platform">
                    <div class="portfolio-overlay">
                        <div class="portfolio-content">
                            <h3>E-Commerce Platform</h3>
                            <p>Full-featured E-commerce Solution with Modern Design</p>
                            <div class="portfolio-tech">
                                <span>React</span>
                                <span>Node.js</span>
                                <span>PostgreSQL</span>
                                <span>Stripe</span>
                                <span>AWS</span>
                            </div>
                            <a href="${generateProjectURL('e-commerce-platform')}" class="btn-primary">View Project</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Multi-Agent Research Assistant -->
            <div class="portfolio-item">
                <div class="portfolio-image">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Research Assistant">
                    <div class="portfolio-overlay">
                        <div class="portfolio-content">
                            <h3>Multi-Agent Research Assistant</h3>
                            <p>AI-powered Research Assistant with Multi-Agent Coordination</p>
                            <div class="portfolio-tech">
                                <span>Python</span>
                                <span>LangChain</span>
                                <span>OpenAI</span>
                                <span>Pinecone</span>
                                <span>FastAPI</span>
                            </div>
                            <a href="${generateProjectURL('research-assistant')}" class="btn-primary">View Project</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>
    `;
}

/**
 * Console output for manual updates
 */
function showUpdateInstructions() {
    // console.log('🔄 Project Link Update Instructions\n');
    // console.log('Replace the following old links with new dynamic template URLs:\n');
    
    Object.entries(projectMappings).forEach(([oldFile, projectId]) => {
        const newURL = generateProjectURL(projectId);
        // console.log(`❌ OLD: ${oldFile}`);
        // console.log(`✅ NEW: ${newURL}\n`);
    });
    
    // console.log('📋 Updated Portfolio Section:');
    // console.log('Copy the following HTML to replace your portfolio section:\n');
    // console.log(generateUpdatedPortfolioSection());
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        projectMappings,
        generateProjectURL,
        updateProjectLinks,
        generateUpdatedPortfolioSection,
        showUpdateInstructions
    };
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.ProjectLinkUpdater = {
        projectMappings,
        generateProjectURL,
        updateProjectLinks,
        generateUpdatedPortfolioSection,
        showUpdateInstructions
    };
}

// Run instructions if called directly
if (typeof require !== 'undefined' && require.main === module) {
    showUpdateInstructions();
} 