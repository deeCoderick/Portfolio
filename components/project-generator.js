/**
 * Project Generator
 * Generates project HTML files using ProjectTemplate and project data
 */

// Import dependencies (adjust paths as needed)
const ProjectTemplate = require('./project-template.js');
const projectsData = require('./project-data.js');
const fs = require('fs');
const path = require('path');

class ProjectGenerator {
    constructor(outputDir = '../') {
        this.outputDir = outputDir;
        this.template = ProjectTemplate;
        this.projects = projectsData;
    }

    /**
     * Generate a single project HTML file
     * @param {string} projectId - The project identifier
     * @param {string} filename - Optional custom filename
     * @returns {string} Generated HTML content
     */
    generateProject(projectId, filename = null) {
        if (!this.projects[projectId]) {
            throw new Error(`Project '${projectId}' not found in project data`);
        }

        const projectData = this.projects[projectId];
        const template = new this.template(projectData);
        const html = template.generateHTML();

        if (filename) {
            this.saveToFile(html, filename);
        }

        return html;
    }

    /**
     * Generate all project HTML files
     * @param {boolean} overwrite - Whether to overwrite existing files
     * @returns {Object} Results of generation process
     */
    generateAllProjects(overwrite = false) {
        const results = {
            success: [],
            errors: [],
            skipped: []
        };

        Object.keys(this.projects).forEach(projectId => {
            try {
                const filename = `project-${projectId}.html`;
                const filepath = path.join(this.outputDir, filename);

                // Check if file exists and overwrite flag
                if (fs.existsSync(filepath) && !overwrite) {
                    results.skipped.push({
                        projectId,
                        filename,
                        reason: 'File exists and overwrite is false'
                    });
                    return;
                }

                const html = this.generateProject(projectId);
                this.saveToFile(html, filename);

                results.success.push({
                    projectId,
                    filename,
                    size: html.length
                });

                console.log(`✅ Generated: ${filename}`);

            } catch (error) {
                results.errors.push({
                    projectId,
                    error: error.message
                });
                console.error(`❌ Error generating ${projectId}:`, error.message);
            }
        });

        return results;
    }

    /**
     * Save HTML content to file
     * @param {string} html - HTML content to save
     * @param {string} filename - Target filename
     */
    saveToFile(html, filename) {
        const filepath = path.join(this.outputDir, filename);
        fs.writeFileSync(filepath, html, 'utf8');
    }

    /**
     * Generate a project with custom data (not from the predefined data)
     * @param {Object} customProjectData - Custom project data
     * @param {string} filename - Output filename
     * @returns {string} Generated HTML content
     */
    generateCustomProject(customProjectData, filename) {
        const template = new this.template(customProjectData);
        const html = template.generateHTML();
        
        if (filename) {
            this.saveToFile(html, filename);
        }

        return html;
    }

    /**
     * Update an existing project's data and regenerate
     * @param {string} projectId - Project to update
     * @param {Object} updates - Data updates to apply
     * @param {string} filename - Optional custom filename
     * @returns {string} Generated HTML content
     */
    updateProject(projectId, updates, filename = null) {
        if (!this.projects[projectId]) {
            throw new Error(`Project '${projectId}' not found in project data`);
        }

        // Merge updates with existing data
        const updatedData = { ...this.projects[projectId], ...updates };
        
        const template = new this.template(updatedData);
        const html = template.generateHTML();

        if (filename) {
            this.saveToFile(html, filename);
        } else {
            this.saveToFile(html, `project-${projectId}.html`);
        }

        return html;
    }

    /**
     * List all available projects
     * @returns {Array} List of project information
     */
    listProjects() {
        return Object.keys(this.projects).map(projectId => ({
            id: projectId,
            title: this.projects[projectId].title,
            date: this.projects[projectId].date,
            techStack: this.projects[projectId].techStack
        }));
    }

    /**
     * Validate project data structure
     * @param {string} projectId - Project to validate
     * @returns {Object} Validation results
     */
    validateProject(projectId) {
        if (!this.projects[projectId]) {
            return { valid: false, errors: ['Project not found'] };
        }

        try {
            new this.template(this.projects[projectId]);
            return { valid: true, errors: [] };
        } catch (error) {
            return { valid: false, errors: [error.message] };
        }
    }

    /**
     * Generate a summary report of all projects
     * @returns {Object} Summary report
     */
    generateSummaryReport() {
        const projects = this.listProjects();
        const techStackCount = {};
        
        projects.forEach(project => {
            project.techStack.forEach(tech => {
                techStackCount[tech] = (techStackCount[tech] || 0) + 1;
            });
        });

        return {
            totalProjects: projects.length,
            projects: projects,
            techStackUsage: Object.entries(techStackCount)
                .sort(([,a], [,b]) => b - a)
                .reduce((obj, [tech, count]) => {
                    obj[tech] = count;
                    return obj;
                }, {}),
            generatedAt: new Date().toISOString()
        };
    }
}

// CLI functionality for Node.js usage
if (require.main === module) {
    const generator = new ProjectGenerator();
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'generate':
            const projectId = args[1];
            if (projectId && projectId !== 'all') {
                try {
                    generator.generateProject(projectId, `project-${projectId}.html`);
                    console.log(`✅ Generated project: ${projectId}`);
                } catch (error) {
                    console.error(`❌ Error:`, error.message);
                }
            } else {
                const results = generator.generateAllProjects(args.includes('--overwrite'));
                console.log('\n📊 Generation Summary:');
                console.log(`✅ Success: ${results.success.length}`);
                console.log(`❌ Errors: ${results.errors.length}`);
                console.log(`⏭️  Skipped: ${results.skipped.length}`);
            }
            break;

        case 'list':
            const projects = generator.listProjects();
            console.log('\n📋 Available Projects:');
            projects.forEach(project => {
                console.log(`• ${project.id}: ${project.title} (${project.date})`);
                console.log(`  Tech: ${project.techStack.join(', ')}\n`);
            });
            break;

        case 'validate':
            const validateId = args[1];
            if (validateId) {
                const validation = generator.validateProject(validateId);
                if (validation.valid) {
                    console.log(`✅ Project '${validateId}' is valid`);
                } else {
                    console.log(`❌ Project '${validateId}' has errors:`);
                    validation.errors.forEach(error => console.log(`  • ${error}`));
                }
            } else {
                console.log('Please specify a project ID to validate');
            }
            break;

        case 'report':
            const report = generator.generateSummaryReport();
            console.log('\n📊 Project Summary Report:');
            console.log(`Total Projects: ${report.totalProjects}`);
            console.log('\nTech Stack Usage:');
            Object.entries(report.techStackUsage).forEach(([tech, count]) => {
                console.log(`  ${tech}: ${count} project(s)`);
            });
            break;

        default:
            console.log(`
🚀 Project Generator CLI

Usage:
  node project-generator.js <command> [options]

Commands:
  generate [projectId]     Generate project HTML file(s)
                          Use 'all' or omit projectId to generate all
                          Add --overwrite to overwrite existing files
  
  list                    List all available projects
  
  validate <projectId>    Validate project data structure
  
  report                  Generate summary report

Examples:
  node project-generator.js generate donna
  node project-generator.js generate all --overwrite
  node project-generator.js list
  node project-generator.js validate donna
  node project-generator.js report
            `);
    }
}

// Export for use as module
module.exports = ProjectGenerator; 