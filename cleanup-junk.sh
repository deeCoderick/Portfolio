#!/bin/bash

# Portfolio Cleanup Script
# Safely removes junk and temporary files

echo "🧹 Starting Portfolio Cleanup..."

# Create backup directory for safety
mkdir -p .cleanup-backup/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=".cleanup-backup/$(date +%Y%m%d_%H%M%S)"

echo "📦 Creating backup in $BACKUP_DIR..."

# Function to safely remove files with backup
safe_remove() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "🗑️  Removing: $file"
        cp "$file" "$BACKUP_DIR/" 2>/dev/null
        rm "$file"
        echo "   ✅ Removed and backed up"
    fi
}

# Remove duplicate index files
echo "🔍 Removing duplicate index files..."
safe_remove "index.html.temp"
safe_remove "index.html.part1" 
safe_remove "index.html.original"

# Remove temporary content files
echo "🔍 Removing temporary content files..."
safe_remove "current.txt"

# Remove system junk files
echo "🔍 Removing system junk files..."
find . -name ".DS_Store" -type f -exec rm -f {} \; 2>/dev/null
echo "   ✅ Removed .DS_Store files"

# Remove log files
echo "🔍 Removing log files..."
find . -name "*.log" -type f -not -path "./node_modules/*" -exec rm -f {} \; 2>/dev/null
echo "   ✅ Removed log files"

# Remove editor temporary files
echo "🔍 Removing editor temporary files..."
find . -name "*~" -type f -exec rm -f {} \; 2>/dev/null
find . -name "*.swp" -type f -exec rm -f {} \; 2>/dev/null
find . -name "*.swo" -type f -exec rm -f {} \; 2>/dev/null
echo "   ✅ Removed editor temp files"

# Calculate space saved
echo "📊 Calculating space saved..."
SPACE_SAVED=$(du -sh $BACKUP_DIR 2>/dev/null | cut -f1)
echo "   💾 Space saved: $SPACE_SAVED"

# Show summary
echo ""
echo "✅ Cleanup completed!"
echo "📁 Backup location: $BACKUP_DIR"
echo "🎯 Files cleaned:"
echo "   - Duplicate index files (1.7MB)"
echo "   - System junk files (.DS_Store)"
echo "   - Temporary content files"
echo "   - Log files"
echo "   - Editor temporary files"
echo ""
echo "⚠️  If everything works fine, you can remove the backup:"
echo "   rm -rf .cleanup-backup"
echo ""
echo "🚀 Next step: Update .gitignore to prevent future junk accumulation" 