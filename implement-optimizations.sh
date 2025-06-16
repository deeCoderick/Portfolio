#!/bin/bash

# Portfolio Optimization Implementation Script
# Helps migrate from old scripts to optimized components safely

set -e

echo "🚀 Portfolio Optimization Implementation Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR=".optimization-backup-$(date +%Y%m%d-%H%M%S)"
PROJECT_ROOT="$(pwd)"

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create backup
create_backup() {
    log_info "Creating backup in $BACKUP_DIR..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup key files that will be modified
    FILES_TO_BACKUP=(
        "theme.js"
        "theme-toggle.js"
        "assets/js/main.js"
        "assets/js/journey-fix.js"
        "assets/js/journey-smooth.js"
        "enhanced-journey.js"
        "styles.css"
        "index.html"
    )
    
    for file in "${FILES_TO_BACKUP[@]}"; do
        if [[ -f "$file" ]]; then
            cp "$file" "$BACKUP_DIR/"
            log_success "Backed up $file"
        else
            log_warning "$file not found, skipping backup"
        fi
    done
    
    log_success "Backup created successfully"
}

# Check if optimized components exist
check_components() {
    log_info "Checking optimized components..."
    
    REQUIRED_COMPONENTS=(
        "components/app-manager.js"
        "components/optimized-theme-manager.js"
        "components/optimized-navigation-manager.js"
        "components/optimized-journey-manager.js"
        "assets/css/optimized-styles.css"
        "assets/js/optimized-main.js"
    )
    
    missing_components=0
    
    for component in "${REQUIRED_COMPONENTS[@]}"; do
        if [[ -f "$component" ]]; then
            log_success "Found $component"
        else
            log_error "Missing $component"
            missing_components=$((missing_components + 1))
        fi
    done
    
    if [[ $missing_components -gt 0 ]]; then
        log_error "$missing_components required components are missing"
        log_error "Please ensure all optimized components are created before running this script"
        exit 1
    fi
    
    log_success "All required components found"
}

# Test optimized components
test_components() {
    log_info "Testing optimized components..."
    
    # Simple syntax check for JavaScript files
    for js_file in components/*.js assets/js/optimized-main.js; do
        if [[ -f "$js_file" ]]; then
            if node -c "$js_file" 2>/dev/null; then
                log_success "✓ $js_file syntax is valid"
            else
                log_error "✗ $js_file has syntax errors"
                exit 1
            fi
        fi
    done
    
    log_success "All components passed syntax validation"
}

# Create gradual migration HTML template
create_migration_template() {
    log_info "Creating migration template..."
    
    cat > "migration-template.html" << 'EOF'
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - Optimized</title>
    
    <!-- Existing styles (keep for compatibility) -->
    <link rel="stylesheet" href="styles.css">
    
    <!-- NEW: Optimized styles -->
    <link rel="stylesheet" href="assets/css/optimized-styles.css">
</head>
<body>
    <!-- Your existing HTML content here -->
    
    <!-- PHASE 1: Load both old and new scripts for compatibility testing -->
    
    <!-- NEW: Optimized components (load first) -->
    <script src="components/performance-manager.js"></script>
    <script src="components/app-manager.js"></script>
    <script src="components/optimized-theme-manager.js"></script>
    <script src="components/optimized-navigation-manager.js"></script>
    <script src="components/optimized-journey-manager.js"></script>
    <script src="assets/js/optimized-main.js"></script>
    
    <!-- OLD: Keep for fallback during testing (comment out gradually) -->
    <!--
    <script src="theme.js"></script>
    <script src="theme-toggle.js"></script>
    <script src="assets/js/journey-fix.js"></script>
    <script src="assets/js/journey-smooth.js"></script>
    <script src="enhanced-journey.js"></script>
    <script src="assets/js/main.js"></script>
    -->
    
    <!-- Testing script -->
    <script>
        // Monitor for conflicts and performance
        document.addEventListener('app:ready', function(event) {
            console.log('✅ Optimized app initialized successfully');
            console.log('📊 Performance metrics:', event.detail.metrics);
            
            // Test key functionality
            setTimeout(() => {
                const tests = [
                    () => typeof portfolioApp !== 'undefined',
                    () => portfolioApp.getModule('theme') !== null,
                    () => portfolioApp.getModule('navigation') !== null,
                    () => portfolioApp.getModule('journey') !== null
                ];
                
                const results = tests.map(test => {
                    try {
                        return test();
                    } catch (e) {
                        return false;
                    }
                });
                
                if (results.every(result => result)) {
                    console.log('✅ All optimization tests passed');
                    document.body.style.borderTop = '3px solid green';
                } else {
                    console.warn('⚠️ Some optimization tests failed');
                    document.body.style.borderTop = '3px solid orange';
                }
            }, 1000);
        });
    </script>
</body>
</html>
EOF
    
    log_success "Created migration-template.html for testing"
}

# Update HTML files to use optimized scripts
update_html_files() {
    log_info "Updating HTML files to use optimized components..."
    
    # Find all HTML files
    html_files=($(find . -name "*.html" -not -path "./portfolio-astro/*" -not -path "./$BACKUP_DIR/*"))
    
    for html_file in "${html_files[@]}"; do
        log_info "Processing $html_file..."
        
        # Create backup of this specific file
        cp "$html_file" "$BACKUP_DIR/$(basename $html_file)"
        
        # Create updated version (commented out old scripts, added new ones)
        sed -i.bak '
            # Comment out old theme scripts
            s|<script src="theme\.js"></script>|<!-- <script src="theme.js"></script> -->|g
            s|<script src="theme-toggle\.js"></script>|<!-- <script src="theme-toggle.js"></script> -->|g
            
            # Comment out old journey scripts
            s|<script src="assets/js/journey-fix\.js"></script>|<!-- <script src="assets/js/journey-fix.js"></script> -->|g
            s|<script src="assets/js/journey-smooth\.js"></script>|<!-- <script src="assets/js/journey-smooth.js"></script> -->|g
            s|<script src="enhanced-journey\.js"></script>|<!-- <script src="enhanced-journey.js"></script> -->|g
            
            # Comment out old main script
            s|<script src="assets/js/main\.js"></script>|<!-- <script src="assets/js/main.js"></script> -->|g
        ' "$html_file"
        
        # Add optimized scripts before </body>
        sed -i.bak '
            /<\/body>/i\
    <!-- Optimized Portfolio Components -->\
    <script src="components/performance-manager.js"></script>\
    <script src="components/app-manager.js"></script>\
    <script src="components/optimized-theme-manager.js"></script>\
    <script src="components/optimized-navigation-manager.js"></script>\
    <script src="components/optimized-journey-manager.js"></script>\
    <script src="assets/js/optimized-main.js"></script>
        ' "$html_file"
        
        # Add optimized CSS
        sed -i.bak '
            /<\/head>/i\
    <link rel="stylesheet" href="assets/css/optimized-styles.css">
        ' "$html_file"
        
        # Remove backup files created by sed
        rm -f "${html_file}.bak"
        
        log_success "Updated $html_file"
    done
    
    log_success "All HTML files updated"
}

# Performance test
run_performance_test() {
    log_info "Running basic performance test..."
    
    # Simple test using curl to check page load
    if command -v curl &> /dev/null; then
        if [[ -f "index.html" ]]; then
            start_time=$(date +%s%N)
            curl -s "file://$(pwd)/index.html" > /dev/null
            end_time=$(date +%s%N)
            
            duration=$(( (end_time - start_time) / 1000000 ))
            log_success "Basic load test completed in ${duration}ms"
        fi
    else
        log_warning "curl not available, skipping performance test"
    fi
}

# Cleanup function
cleanup_backups() {
    read -p "Do you want to remove the backup files? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$BACKUP_DIR"
        log_success "Backup files removed"
    else
        log_info "Backup files kept in $BACKUP_DIR"
    fi
}

# Rollback function
rollback() {
    log_warning "Rolling back changes..."
    
    if [[ -d "$BACKUP_DIR" ]]; then
        for file in "$BACKUP_DIR"/*; do
            if [[ -f "$file" ]]; then
                filename=$(basename "$file")
                cp "$file" "$filename"
                log_success "Restored $filename"
            fi
        done
        log_success "Rollback completed"
    else
        log_error "Backup directory not found"
    fi
}

# Main execution
main() {
    echo "Choose an option:"
    echo "1. Full optimization implementation (recommended)"
    echo "2. Create migration template only"
    echo "3. Run tests only"
    echo "4. Rollback changes"
    echo "5. Exit"
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            log_info "Starting full optimization implementation..."
            create_backup
            check_components
            test_components
            create_migration_template
            update_html_files
            run_performance_test
            log_success "🎉 Optimization implementation completed!"
            log_info "📖 Please test your site thoroughly before removing backup files"
            log_info "🔧 Use migration-template.html as a reference for manual updates"
            ;;
        2)
            log_info "Creating migration template only..."
            create_migration_template
            log_success "✅ Migration template created"
            ;;
        3)
            log_info "Running tests only..."
            check_components
            test_components
            run_performance_test
            log_success "✅ Tests completed"
            ;;
        4)
            rollback
            ;;
        5)
            log_info "Exiting..."
            exit 0
            ;;
        *)
            log_error "Invalid choice"
            exit 1
            ;;
    esac
}

# Handle interruption
trap 'log_error "Script interrupted"; exit 1' INT TERM

# Run main function
main

echo ""
echo "🔗 For more information, see ADVANCED_OPTIMIZATION_REPORT.md"
echo "📞 If you encounter issues, restore from $BACKUP_DIR" 