// Recent Activity Management
document.addEventListener('DOMContentLoaded', function() {
    // Insert the activity dropdown HTML into the navigation
    const navContainer = document.querySelector('.nav-container');
    const themeToggleContainer = document.querySelector('.theme-toggle-container');
    
    if (navContainer && themeToggleContainer) {
        const activityDropdown = document.createElement('div');
        activityDropdown.className = 'recent-activity-dropdown';
        activityDropdown.innerHTML = `
            <button class="recent-activity-btn">
                <i class="fas fa-bell"></i>
                <span class="activity-count">3</span>
            </button>
            <div class="recent-activity-menu">
                <div class="activity-header">
                    <h3>Recent Activity</h3>
                    <button class="mark-all-read">Mark all as read</button>
                </div>
                <div class="activity-list">
                    <div class="activity-item unread">
                        <i class="fas fa-code"></i>
                        <div class="activity-content">
                            <p>New project added: AI Chatbot</p>
                            <span class="activity-time">2 hours ago</span>
                        </div>
                    </div>
                    <div class="activity-item unread">
                        <i class="fas fa-book"></i>
                        <div class="activity-content">
                            <p>New book review: "The Pragmatic Programmer"</p>
                            <span class="activity-time">5 hours ago</span>
                        </div>
                    </div>
                    <div class="activity-item unread">
                        <i class="fas fa-camera"></i>
                        <div class="activity-content">
                            <p>New travel photos added</p>
                            <span class="activity-time">1 day ago</span>
                        </div>
                    </div>
                </div>
                <div class="activity-footer">
                    <a href="#activity" class="view-all">View all activity</a>
                </div>
            </div>
        `;
        
        // Insert the activity dropdown before the theme toggle
        navContainer.insertBefore(activityDropdown, themeToggleContainer);
        
        // Get references to the activity elements
        const activityMenu = activityDropdown.querySelector('.recent-activity-menu');
        const markAllReadBtn = activityDropdown.querySelector('.mark-all-read');
        const activityItems = activityDropdown.querySelectorAll('.activity-item');
        const activityCount = activityDropdown.querySelector('.activity-count');
        
        // Toggle activity menu on click
        activityDropdown.addEventListener('click', function(e) {
            if (e.target.closest('.recent-activity-btn')) {
                activityMenu.style.display = activityMenu.style.display === 'block' ? 'none' : 'block';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!activityDropdown.contains(e.target)) {
                activityMenu.style.display = 'none';
            }
        });

        // Mark all as read
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function() {
                activityItems.forEach(item => {
                    item.classList.remove('unread');
                });
                updateActivityCount();
            });
        }

        // Mark individual items as read
        activityItems.forEach(item => {
            item.addEventListener('click', function() {
                this.classList.remove('unread');
                updateActivityCount();
            });
        });

        // Update activity count
        function updateActivityCount() {
            const unreadCount = activityDropdown.querySelectorAll('.activity-item.unread').length;
            if (activityCount) {
                activityCount.textContent = unreadCount;
                activityCount.style.display = unreadCount > 0 ? 'block' : 'none';
            }
        }

        // Initialize activity count
        updateActivityCount();
    }
}); 