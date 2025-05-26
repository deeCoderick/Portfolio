class GitHubActivity {
    constructor(username) {
        this.username = username;
        this.apiBase = 'https://api.github.com';
    }

    async fetchContributions() {
        try {
            // Get user's repositories
            const reposResponse = await fetch(`${this.apiBase}/users/${this.username}/repos`);
            const repos = await reposResponse.json();

            // Get commits from each repository
            const commitPromises = repos.map(repo => 
                fetch(`${this.apiBase}/repos/${this.username}/${repo.name}/commits?author=${this.username}`)
                    .then(res => res.json())
                    .catch(() => [])
            );

            const allCommits = await Promise.all(commitPromises);
            
            // Process commits into a heatmap format
            const commitData = {};
            allCommits.flat().forEach(commit => {
                if (commit && commit.commit) {
                    const date = commit.commit.author.date.split('T')[0];
                    commitData[date] = (commitData[date] || 0) + 1;
                }
            });

            return commitData;
        } catch (error) {
            console.warn('GitHub API temporarily unavailable:', error.message);
            console.info('This is normal if rate limits are exceeded or network is unavailable');
            return {};
        }
    }

    async fetchUserStats() {
        try {
            const response = await fetch(`${this.apiBase}/users/${this.username}`);
            return await response.json();
        } catch (error) {
            console.warn('GitHub user stats temporarily unavailable:', error.message);
            return null;
        }
    }

    createHeatmap(data, container) {
        // Create calendar cells for the last 365 days
        const today = new Date();
        const cells = [];
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            cells.push({
                date: dateStr,
                count: data[dateStr] || 0
            });
        }

        // Create the heatmap HTML
        const heatmapHtml = this.generateHeatmapHtml(cells);
        container.innerHTML = heatmapHtml;

        // Add tooltips
        this.addTooltips(container);
    }

    generateHeatmapHtml(cells) {
        const weeks = [];
        let currentWeek = [];

        cells.forEach((cell, index) => {
            currentWeek.push(cell);
            if ((index + 1) % 7 === 0 || index === cells.length - 1) {
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
        });

        return `
            <div class="github-heatmap">
                <div class="heatmap-container">
                    ${weeks.map(week => `
                        <div class="heatmap-week">
                            ${week.map(day => `
                                <div class="heatmap-cell" 
                                     data-date="${day.date}" 
                                     data-count="${day.count}"
                                     style="background-color: ${this.getColor(day.count)}">
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
                <div class="heatmap-legend">
                    <span>Less</span>
                    ${[0, 1, 2, 3, 4].map(level => `
                        <div class="legend-cell" style="background-color: ${this.getColor(level)}"></div>
                    `).join('')}
                    <span>More</span>
                </div>
            </div>
        `;
    }

    getColor(count) {
        // GitHub-like color scheme
        if (count === 0) return '#ebedf0';
        if (count <= 3) return '#9be9a8';
        if (count <= 6) return '#40c463';
        if (count <= 9) return '#30a14e';
        return '#216e39';
    }

    addTooltips(container) {
        const cells = container.querySelectorAll('.heatmap-cell');
        cells.forEach(cell => {
            cell.addEventListener('mouseover', (e) => {
                const date = new Date(cell.dataset.date);
                const count = cell.dataset.count;
                const tooltip = document.createElement('div');
                tooltip.className = 'heatmap-tooltip';
                tooltip.textContent = `${count} contributions on ${date.toLocaleDateString()}`;
                document.body.appendChild(tooltip);

                const rect = cell.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.top + window.scrollY - 30}px`;
            });

            cell.addEventListener('mouseout', () => {
                const tooltip = document.querySelector('.heatmap-tooltip');
                if (tooltip) tooltip.remove();
            });
        });
    }
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const githubSection = document.createElement('section');
    githubSection.className = 'github-activity-section';
    githubSection.innerHTML = `
        <h2>GitHub Activity</h2>
        <div id="github-container">
            <div id="github-stats" class="github-stats"></div>
            <div id="github-heatmap" class="github-heatmap-wrapper"></div>
        </div>
    `;

    // Insert the section before the footer or at the end of the main content
    const footer = document.querySelector('footer');
    if (footer) {
        footer.parentNode.insertBefore(githubSection, footer);
    } else {
        document.body.appendChild(githubSection);
    }

    const github = new GitHubActivity('deCoderick'); // Replace with your GitHub username
    
    // Fetch and display contributions
    const contributions = await github.fetchContributions();
    const heatmapContainer = document.getElementById('github-heatmap');
    github.createHeatmap(contributions, heatmapContainer);

    // Fetch and display user stats
    const stats = await github.fetchUserStats();
    if (stats) {
        const statsContainer = document.getElementById('github-stats');
        statsContainer.innerHTML = `
            <div class="stat-card">
                <i class="fas fa-code-branch"></i>
                <div class="stat-content">
                    <h3>${stats.public_repos}</h3>
                    <p>Repositories</p>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <div class="stat-content">
                    <h3>${stats.followers}</h3>
                    <p>Followers</p>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-star"></i>
                <div class="stat-content">
                    <h3>${stats.public_gists || 0}</h3>
                    <p>Gists</p>
                </div>
            </div>
        `;
    }
}); 