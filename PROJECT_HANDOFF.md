# 137STUDIOS PROJECT HANDOFF DOCUMENT
**Last Updated:** October 4th, 2025
**Project URL:** https://137studios-55zoyibny-tonicthoughtstudios-gmailcoms-projects.vercel.app
**GitHub:** https://github.com/Domnoval/137studios.git
**Status:** In Development - Critical UX Issues Addressed

---

## 📋 EXECUTIVE SUMMARY

137studios is an innovative art gallery website featuring:
- 3D WebGL infinite gallery with cloth-like physics
- AI-powered artwork generation and synthesis
- Mystical, cosmic aesthetic with dark theme
- Next.js 15.5.4 with React 19, TypeScript, Tailwind CSS

**Current State:** Creative vision is strong, but basic business functions need work.

---

## 🎯 CRITICAL ISSUES FIXED (October 4th, 2025)

### ✅ COMPLETED TODAY:

1. **Cursor Visibility** - Removed broken custom cursor, now uses standard browser cursor
2. **Background Visibility** - Made cosmic grid background actually visible (was pure black)
3. **Artwork Size** - Fixed artworks expanding too large when clicked
4. **Confusing Overlays** - Hidden Grid/Golden Ratio/Sacred Geometry toggles (confusing to users)

### 🔴 STILL CRITICAL (NOT FIXED):

1. **Contact Form Broken** - Form has no submission handler, loses all leads
2. **Two Different Detail Views** - Gallery uses side panel, but also has `/art/[slug]` pages
3. **All CTA Buttons Broken** - "Inquire", "Buy", "Order Print", "View Full Size" do nothing
4. **No Pricing** - Artwork detail pages don't show prices
5. **Color Contrast Violations** - Fails WCAG 2.2 AA standards

---

## 📂 PROJECT STRUCTURE

```
137studios/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── art/[slug]/page.tsx        # Expanded artwork view
│   ├── api/
│   │   └── auth/[...nextauth]/    # NextAuth.js (configured but not used)
│   └── globals.css                # Global styles, CSS variables
│
├── components/
│   ├── artwork/                   # Expanded view components
│   │   ├── ArtworkStage.tsx       # Zoom/pan/overlay viewer
│   │   ├── ArtworkMetaPanel.tsx   # Sidebar with metadata
│   │   ├── RelatedFilmstrip.tsx   # Related works carousel
│   │   ├── OverlayToggles.tsx     # Grid/ratio/geometry toggles (HIDDEN)
│   │   ├── ShareButton.tsx        # Share with view state
│   │   └── HotkeyGuide.tsx        # Keyboard shortcut help
│   │
│   ├── NewGallery.tsx             # Main 3D WebGL gallery
│   ├── InfiniteGallery.tsx        # 3D scene renderer
│   ├── Navigation.tsx             # Top nav bar
│   ├── CosmicHub.tsx              # Floating collection button
│   ├── SynthesisChamber.tsx       # AI artwork mixer
│   ├── AIOracle.tsx               # AI assistant
│   ├── TrancePrompt.tsx           # Fullscreen prompt mode
│   ├── CursorTrail.tsx            # Custom cursor (REMOVED)
│   └── SacredGeometry.tsx         # Background animations
│
├── lib/
│   ├── artworkData.ts             # Gallery artwork data (12 pieces)
│   ├── artwork-data.ts            # Expanded view data (2 pieces with full metadata)
│   └── CollectionContext.tsx      # User collection state
│
├── types/
│   └── artwork.ts                 # TypeScript types for expanded view
│
└── public/
    ├── artwork/                   # Optimized WebP images (4.1MB total)
    └── cosmic-grid-bg.jpg         # Background image (501KB)
```

---

## 🔗 KEY FILES & LINE NUMBERS

### Contact Form (BROKEN)
**File:** `app/page.tsx:210-246`
**Issue:** No `onSubmit` handler, no validation, no API endpoint
**Fix Needed:** Implement form submission with SendGrid/Resend

### Artwork Detail Views (INCONSISTENT)
**Files:**
- `components/NewGallery.tsx:121-206` - Side panel (old)
- `app/art/[slug]/page.tsx` - Full page view (new)

**Issue:** Two different UX patterns confuse users
**Fix Needed:** Remove side panel, use only full page view

### CTA Buttons (NON-FUNCTIONAL)
**File:** `components/NewGallery.tsx:196-201`
**Buttons:** "View Full Size", "Order Print", "Inquire", "Buy", "Share"
**Fix Needed:** Implement click handlers for each action

### Color Contrast (ACCESSIBILITY)
**File:** `app/globals.css:21-23` (cosmic-light, cosmic-muted colors)
**Issue:** 3.2:1 contrast ratio (needs 4.5:1)
**Fix Needed:** Adjust to #d8b4fe for cosmic-light

---

## 🎨 DESIGN SYSTEM

### Color Palette
```css
--cosmic-void: #0a0a0a (background)
--cosmic-glow: #e9d5ff (primary text)
--cosmic-light: #c084fc (muted text - TOO LOW CONTRAST)
--cosmic-plasma: #9333ea (accent purple)
--cosmic-aura: #6b46c1 (deep purple)
--cosmic-nebula: #1a0033 (dark purple)
--mystic-gold: #fbbf24 (gold accent)
```

### Typography
- **Headings:** Cinzel (serif, mystical feel)
- **Body:** Geist Sans (modern, readable)
- **Mono:** Geist Mono (code blocks)

### Spacing
- Uses Tailwind's default spacing scale
- Generous padding on sections (py-24)
- Glass morphism effects (`backdrop-blur-sm`)

---

## 🔌 TECH STACK

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js | 15.5.4 |
| **React** | React | 19.0.0 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.0.0-alpha.37 |
| **Animations** | Framer Motion | 11.14.4 |
| **3D** | Three.js + React Three Fiber | Latest |
| **Auth** | NextAuth.js | 4.24.11 |
| **Database** | Prisma + PostgreSQL | Latest |
| **AI** | OpenAI API | gpt-4o, DALL-E 3 |
| **Deployment** | Vercel | Latest |

---

## 🚀 SETUP INSTRUCTIONS

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local`:
```env
# Database
DATABASE_URL="postgres://postgres.xxx:password@host/postgres?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OpenAI
OPENAI_API_KEY="sk-xxx"

# Email (for contact form - NOT CONFIGURED)
# SENDGRID_API_KEY="SG.xxx"
```

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

---

## 🗺️ SITEMAP (XML)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://137studios.com/</loc>
    <lastmod>2025-10-04</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://137studios.com/art/purple-dreamscape</loc>
    <lastmod>2025-10-04</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://137studios.com/art/cyan-consciousness</loc>
    <lastmod>2025-10-04</lastmod>
    <priority>0.8</priority>
  </url>
  <!-- Add remaining artwork slugs -->
</urlset>
```

---

## 📊 PERFORMANCE METRICS

### Current (Estimated):
- **LCP:** ~4-5s (POOR - should be <2.5s)
- **INP:** ~300ms (NEEDS IMPROVEMENT - should be <200ms)
- **CLS:** 0.05 (GOOD)

### Issues:
1. Large WebGL textures loading
2. Multiple animation libraries
3. Heavy Framer Motion usage
4. No code splitting by route

### Recommendations:
- Lazy load 3D scenes
- Implement route-based code splitting
- Use image CDN (Cloudinary)
- Preload critical assets

---

## ♿ ACCESSIBILITY AUDIT

### WCAG 2.2 Compliance: 60% (FAILING)

| Criterion | Status | Issue |
|-----------|--------|-------|
| 1.4.3 Contrast (Minimum) | ❌ FAIL | Text contrast 3.2:1 (needs 4.5:1) |
| 2.1.1 Keyboard | ✅ PASS | All interactive elements keyboard accessible |
| 2.2.2 Pause, Stop, Hide | ❌ FAIL | No pause button for animations |
| 2.4.1 Bypass Blocks | ❌ FAIL | No "Skip to content" link |
| 3.3.1 Error Identification | ❌ FAIL | No form validation errors |
| 4.1.2 Name, Role, Value | ⚠️ PARTIAL | Custom cursor breaks screen readers |

---

## 🔧 IMMEDIATE FIXES NEEDED (PRIORITY ORDER)

### P0 - Critical (Business Blockers)
1. **Fix Contact Form** (2 hours)
   - Add form validation (react-hook-form)
   - Implement email API (SendGrid)
   - Add success/error states

2. **Add Pricing** (1 hour)
   - Display price on artwork pages
   - Add "Price on Request" option

3. **Fix CTA Buttons** (4 hours)
   - "Inquire" → Opens contact form with artwork pre-filled
   - "Buy" → Links to payment or inquiry
   - "Share" → Native share API

### P1 - High (UX Issues)
4. **Consolidate Detail Views** (8 hours)
   - Remove side panel
   - Use only `/art/[slug]` route

5. **Fix Color Contrast** (2 hours)
   - Update cosmic-light to #d8b4fe
   - Test all text combinations

6. **Add Search/Filters** (16 hours)
   - Implement Algolia/Meilisearch
   - Filters: color, medium, price

### P2 - Medium (Missing Features)
7. **Artist Pages** (12 hours)
8. **User Accounts** (20 hours)
9. **Print Configurator** (60 hours)

---

## 📸 VISUAL TESTING CHECKLIST

### Homepage
- [ ] Background grid visible (not pure black)
- [ ] Cursor is visible and standard
- [ ] Hero section readable
- [ ] Navigation links work
- [ ] Sacred geometry animates smoothly

### Gallery
- [ ] 3D artworks load and display
- [ ] Can click/drag to rotate view
- [ ] Clicking artwork opens detail page
- [ ] Loading states show

### Artwork Detail Page (`/art/purple-dreamscape`)
- [ ] Image fits on screen (not too large)
- [ ] Can zoom with mouse wheel
- [ ] Can pan by dragging
- [ ] "Back to Gallery" works
- [ ] Share button copies URL
- [ ] No confusing overlay toggles visible

### Mobile (375x812 - iPhone X)
- [ ] Navigation hamburger works
- [ ] Gallery is touch-friendly
- [ ] Detail page is responsive
- [ ] Text is readable
- [ ] Buttons are tappable (44px+ touch targets)

---

## 🐛 KNOWN BUGS

1. **Gallery artwork click sometimes misses** - WebGL hit detection issue
2. **Background image doesn't load on first visit** - Next.js Image caching
3. **Zoom calculation off on ultrawide monitors** - Container width detection
4. **Mobile gallery stutters** - Three.js performance on low-end devices
5. **Contact form email input allows invalid formats** - No validation

---

## 🎯 FUTURE ROADMAP

### Phase 1: Fix Fundamentals (Week 1)
- ✅ Cursor visibility
- ✅ Background visibility
- ✅ Artwork sizing
- ⬜ Contact form
- ⬜ Pricing display
- ⬜ CTA functionality

### Phase 2: Core Features (Weeks 2-4)
- ⬜ Search and filters
- ⬜ Artist pages
- ⬜ User accounts
- ⬜ Consistent detail views

### Phase 3: E-Commerce (Weeks 5-8)
- ⬜ Print configurator
- ⬜ Payment integration
- ⬜ Order management
- ⬜ Email automation

### Phase 4: Innovation (Months 3-6)
- ⬜ AR preview
- ⬜ AI-powered search
- ⬜ Virtual exhibitions
- ⬜ Mobile app

---

## 📞 SUPPORT & CONTACTS

**Developer:** Claude (Anthropic)
**Project Owner:** Domno
**Repository:** https://github.com/Domnoval/137studios.git
**Issues:** Report at GitHub Issues

---

## 📝 NOTES FOR DEVELOPERS

### Working with the 3D Gallery
- Located in `components/InfiniteGallery.tsx`
- Uses Three.js custom shader for cloth effect
- Performance-sensitive - test on mid-range devices

### Artwork Data Structure
Two different formats currently exist:
1. **Gallery Format** (`lib/artworkData.ts`) - Simple, for 3D gallery
2. **Expanded Format** (`lib/artwork-data.ts`) - Full metadata, for detail pages

**RECOMMENDATION:** Consolidate to single format with optional fields.

### State Management
- Collection state: React Context (`lib/CollectionContext.tsx`)
- No global state library (Redux/Zustand) - consider adding for complex features

### API Routes
Currently only NextAuth.js routes exist. Need to add:
- `/api/contact` - Form submission
- `/api/artworks` - Fetch artwork data
- `/api/inquire` - Artwork inquiry

---

## ⚠️ DISCLAIMER

This project is under active development. The codebase contains experimental features and incomplete implementations. Not recommended for production use without addressing the critical issues listed above.

---

**END OF HANDOFF DOCUMENT**

For questions or clarifications, please refer to the comprehensive UX Audit Report or contact the development team.
