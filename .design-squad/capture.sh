#!/bin/bash
# Simple screenshot capture

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT=".design-squad/captures/${TIMESTAMP}.png"

# Try scrot first, fall back to import
if command -v scrot &> /dev/null; then
    scrot -u "$OUTPUT"
    echo "📸 Captured: $OUTPUT"
elif command -v import &> /dev/null; then
    import -window $(xdotool getactivewindow) "$OUTPUT"
    echo "📸 Captured: $OUTPUT"
else
    echo "❌ Need scrot or imagemagick. Install with:"
    echo "   sudo apt install scrot"
    exit 1
fi

echo "$OUTPUT"
