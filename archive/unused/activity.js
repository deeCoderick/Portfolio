// Recent Activity Management
document.addEventListener('DOMContentLoaded', function() {
    const activityDropdown = document.querySelector('.recent-activity-dropdown');
    const activityMenu = document.querySelector('.recent-activity-menu');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const activityItems = document.querySelectorAll('.activity-item');
    const activityCount = document.querySelector('.activity-count');

    // Toggle activity menu on click
    if (activityDropdown) {
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
    }

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
        const unreadCount = document.querySelectorAll('.activity-item.unread').length;
        if (activityCount) {
            activityCount.textContent = unreadCount;
            activityCount.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    // Initialize activity count
    updateActivityCount();
}); 