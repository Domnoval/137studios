# How to Use Your Design Squad

## Quick Workflow

### When you hit a design decision:

1. Take a screenshot:
   ```bash
   ./.design-squad/capture.sh
   ```

2. Open Claude.ai in a separate browser tab

3. Upload the screenshot and say something like:
   ```
   "I'm building [describe feature]. 
   
   Please analyze this as:
   - ARIA (accessibility & UX)
   - LEX (layout & structure)
   - NOVA (colors & style)
   - FLUX (interactions & tech)
   
   Then ORACLE, tell me if we're missing something.
   
   Agent definitions are in .design-squad/agents/ if you need them."
   ```

4. Get their advice, return here to Cursor

5. Implement based on agent recommendations

6. Log the decision in .design-squad/context/design-decisions.md

## Agent Quick Reference

**ARIA** - Accessibility, user experience, cognitive load
**LEX** - Layout, spacing, hierarchy, structure  
**NOVA** - Color, typography, visual style, aesthetics
**FLUX** - Animations, interactions, performance, modern patterns
**ORACLE** - Wild ideas, inversions, cultural context, emergence
**HARMONY** - Synthesis when agents conflict, system thinking

## Tips

- Don't need all agents every time—pick 2-3 relevant ones
- ORACLE is optional but often surprising
- Log decisions so you remember the "why"
- This system doesn't interfere with code—it's pure consultation
