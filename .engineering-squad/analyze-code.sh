#!/bin/bash
# Helps gather code context for Engineering Squad consultation

echo "🔍 Engineering Squad Code Analysis Helper"
echo ""

# Ask what to analyze
if [ -z "$1" ]; then
    echo "Usage: ./.engineering-squad/analyze-code.sh [component-name]"
    echo "Example: ./.engineering-squad/analyze-code.sh ProductCard"
    echo ""
    echo "Or just run without args to analyze current git changes"
    echo ""
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR=".engineering-squad/analyses"
mkdir -p "$OUTPUT_DIR"

if [ -n "$1" ]; then
    # Specific component analysis
    COMPONENT=$1
    OUTPUT="$OUTPUT_DIR/${TIMESTAMP}_${COMPONENT}.md"

    echo "📝 Analyzing: $COMPONENT"
    echo "# Code Analysis: $COMPONENT" > "$OUTPUT"
    echo "Generated: $(date -Iseconds)" >> "$OUTPUT"
    echo "" >> "$OUTPUT"

    # Find files matching component name
    echo "## Files Found" >> "$OUTPUT"
    find . -type f -name "*$COMPONENT*" \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) | while read file; do
        echo "- $file" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
        echo "\`\`\`typescript" >> "$OUTPUT"
        cat "$file" >> "$OUTPUT"
        echo "\`\`\`" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
    done

else
    # Analyze recent changes
    OUTPUT="$OUTPUT_DIR/${TIMESTAMP}_recent-changes.md"

    echo "📝 Analyzing recent git changes"
    echo "# Recent Code Changes" > "$OUTPUT"
    echo "Generated: $(date -Iseconds)" >> "$OUTPUT"
    echo "" >> "$OUTPUT"

    echo "## Changed Files" >> "$OUTPUT"
    git diff --name-only HEAD >> "$OUTPUT"
    echo "" >> "$OUTPUT"

    echo "## Diff" >> "$OUTPUT"
    echo "\`\`\`diff" >> "$OUTPUT"
    git diff HEAD >> "$OUTPUT"
    echo "\`\`\`" >> "$OUTPUT"
fi

echo "✅ Analysis saved to: $OUTPUT"
echo ""
echo "Next steps:"
echo "1. Open $OUTPUT"
echo "2. Copy relevant sections"
echo "3. Share with Engineering Squad in Claude.ai"
echo "4. Ask specific agents for review"
