#!/bin/bash
# Quick test to verify Engineering Squad is set up correctly

echo "🔧 Testing Engineering Squad Setup..."
echo ""

# Check structure
echo "📁 Checking folder structure..."
[ -d ".engineering-squad/agents" ] && echo "✅ agents/ exists" || echo "❌ agents/ missing"
[ -d ".engineering-squad/analyses" ] && echo "✅ analyses/ exists" || echo "❌ analyses/ missing"
[ -d ".engineering-squad/decisions" ] && echo "✅ decisions/ exists" || echo "❌ decisions/ missing"
echo ""

# Check agent files
echo "👥 Checking agents..."
for agent in forge nexus volt citadel scaffold sentinel; do
    [ -f ".engineering-squad/agents/$agent.md" ] && echo "✅ $agent.md exists" || echo "❌ $agent.md missing"
done
echo ""

# Check scripts
echo "📜 Checking scripts..."
[ -f ".engineering-squad/analyze-code.sh" ] && echo "✅ analyze-code.sh exists" || echo "❌ analyze-code.sh missing"
[ -f ".engineering-squad/HOW-TO-USE.md" ] && echo "✅ HOW-TO-USE.md exists" || echo "❌ HOW-TO-USE.md missing"
echo ""

echo "🎉 Engineering Squad setup complete!"
echo ""
echo "Try it out:"
echo "  ./.engineering-squad/analyze-code.sh ProductCard"
echo ""
echo "Or consult an agent:"
echo "  'FORGE, can you review my architecture?'"
