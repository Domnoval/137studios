# How to Use Your Engineering Squad

## The Squad

**FORGE** - Systems Architect
Ask about: overall architecture, how pieces fit together, tech stack decisions

**NEXUS** - API & Integration Specialist
Ask about: data flow, API design, state management, authentication

**VOLT** - Performance Engineer
Ask about: speed optimization, bundle size, rendering performance

**CITADEL** - Security Guardian
Ask about: security vulnerabilities, error handling, data validation

**SCAFFOLD** - DevEx & Tooling
Ask about: testing, TypeScript, linting, CI/CD, developer workflow

**SENTINEL** - Code Quality Auditor
Ask about: maintainability, refactoring, code patterns, documentation

## When to Consult

### Before Building Something New
Ask FORGE and NEXUS about architecture
Ask CITADEL about security considerations
Ask SCAFFOLD about testing approach

### When Code Feels Messy
Ask SENTINEL about refactoring
Ask FORGE about structural improvements

### When Something Feels Slow
Ask VOLT about performance bottlenecks
Ask FORGE about architectural constraints

### When You're Stuck
Ask any relevant agent, they'll explain the concept and suggest next steps

## Workflow

1. Identify which agent(s) can help with your question
2. Gather relevant code files or describe the problem
3. Open Claude.ai in browser (separate from Cursor)
4. Upload code and ask: "FORGE and VOLT, can you review this?"
5. Get technical guidance with explanations
6. Return to Cursor and implement with Claude Code
7. Log the decision in .engineering-squad/decisions/

## Example Consultations

"NEXUS, I need to fetch user data. Should I call Supabase directly from the client or create an API route?"

"VOLT, my product page loads slowly. Here's the component—what's causing it?"

"CITADEL, I'm building a contact form. What security concerns should I address?"

"FORGE, I have auth logic scattered across five files. How should I organize this?"

"SENTINEL, this component is 300 lines. Should I split it? If so, how?"

## Tips

- These agents want you to learn, not just copy-paste solutions
- Ask "why" questions—they'll explain the reasoning
- Tell them your experience level—they'll adjust explanation depth
- They work together—ask multiple agents for different perspectives
- Log decisions so you remember your reasoning later
