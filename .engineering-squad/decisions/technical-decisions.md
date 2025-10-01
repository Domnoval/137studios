# Technical Decisions Log

Record your technical choices so you remember why you made them.

## Format

### [Date]: [What You Decided]
**Problem:** [What you were trying to solve]
**Agents consulted:** [Which ones]
**Options considered:** [List the alternatives]
**Decision:** [What you chose]
**Reasoning:** [Why, based on agent feedback]
**Trade-offs:** [What you gained/lost]
**Implemented in:** [File/component]

---

## Example

### 2025-10-01: Authentication Strategy
**Problem:** Need user login for checkout
**Agents consulted:** NEXUS, CITADEL, SCAFFOLD
**Options considered:**
1. NextAuth.js (flexible but more config)
2. Supabase Auth (integrated with our DB)
3. Clerk (beautiful UI but costs money)

**Decision:** Supabase Auth
**Reasoning:**
- NEXUS: "You're already using Supabase—auth integrates seamlessly"
- CITADEL: "Built-in security best practices, well-tested"
- SCAFFOLD: "Simpler to test than rolling custom JWT logic"

**Trade-offs:**
- Gain: Fast setup, secure by default, works with existing DB
- Lose: Less customization than NextAuth, tied to Supabase ecosystem

**Implemented in:** /lib/auth.ts, /app/login/page.tsx

---

## Your Decisions

[Start logging below]
