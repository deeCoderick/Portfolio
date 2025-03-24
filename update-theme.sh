#!/bin/bash

# Update HTML files to include theme.js and set data-theme attribute
find . -name "*.html" | grep -v node_modules | grep -v dist | while read file; do
    echo "Processing $file"
    
    # Add data-theme attribute to html tag if not already present
    # This uses perl because it handles multi-line matching better than sed
    perl -i -pe 's/<html lang="en">/<html lang="en" data-theme="dark">/g' "$file"
    
    # Check if theme.js is already included
    if ! grep -q 'theme.js' "$file"; then
        # Find the line with ScrollReveal script and add theme.js after it
        perl -i -pe 's|(.*scrollreveal.*min\.js.*</script>)|$1\n    <script src="theme.js" defer></script>|i' "$file"
        
        # If ScrollReveal isn't found, try to add it before the closing head tag
        if ! grep -q 'theme.js' "$file"; then
            perl -i -pe 's|(</head>)|    <script src="theme.js" defer></script>\n$1|' "$file"
        fi
    fi
    
    # For sports subdirectory, fix the path to theme.js
    if [[ "$file" == ./sports/* ]]; then
        perl -i -pe 's|<script src="theme.js" defer></script>|<script src="../theme.js" defer></script>|' "$file"
    fi
done

echo "Theme update completed!" 