# VISUAL QA - QUICK ACTION CHECKLIST

## 🔴 CRITICAL - DO FIRST

- [ ] **FIX SERVER ERROR** - Site returns 500 error at http://localhost:3000
  - Check Next.js console for errors
  - Verify environment variables are set
  - Test database connection (Prisma)
  - Review recent code changes

## 🟠 HIGH PRIORITY - THIS WEEK

- [ ] **Improve Text Contrast**
  - [ ] Update `cosmic-light` in tailwind.config.ts from `#c084fc` to `#d8b4fe`
  - [ ] Remove `/70`, `/80` opacity modifiers on body text
  - [ ] Add text-shadow to low-contrast areas

- [ ] **Fix Mobile Navigation**
  - [ ] Test on iPhone SE (375px width)
  - [ ] Reduce mobile menu width from `w-80` to `w-72`
  - [ ] Add explicit gap between hamburger and Oracle button
  - [ ] Consider hiding Oracle button on mobile

- [ ] **Add Form Validation**
  - [ ] Create `handleSubmit` function for contact form
  - [ ] Add email format validation
  - [ ] Add required field checks
  - [ ] Show success/error messages
  - [ ] Add loading state during submission

- [ ] **Gallery Loading States**
  - [ ] Add progressive texture loading (chunks of 3-5)
  - [ ] Show loading progress: "Loading 5/20 artworks"
  - [ ] Add error handling for failed texture loads
  - [ ] Create performance mode toggle (disable blur on mobile)

## 🟡 MEDIUM PRIORITY - NEXT SPRINT

- [ ] **Spacing Consistency**
  - [ ] Use Tailwind custom spacing (`py-section`, `px-content`)
  - [ ] Standardize heading margins
  - [ ] Create reusable Section component

- [ ] **Animation Accessibility**
  - [ ] Add reduced motion check to InfiniteGallery auto-play
  - [ ] Disable cursor trail in reduced motion mode
  - [ ] Add "pause animations" toggle button

- [ ] **Z-Index Management**
  - [ ] Create z-index scale in tailwind.config.ts
  - [ ] Update all components to use scale
  - [ ] Test overlapping elements

- [ ] **Cursor Visibility**
  - [ ] Add contrasting stroke to custom cursor
  - [ ] Consider mix-blend-mode for dynamic contrast
  - [ ] Add cursor visibility toggle

## 🟢 LOW PRIORITY - POLISH

- [ ] **Alt Text Audit**
  - [ ] Ensure all artworks have alt text
  - [ ] Add fallback alt generation with AI

- [ ] **Scroll Indicator**
  - [ ] Hide after first scroll
  - [ ] Make responsive to scroll position

- [ ] **Performance Optimization**
  - [ ] Add code splitting for heavy components
  - [ ] Lazy load gallery when scrolled into view
  - [ ] Run bundle analysis

## ✨ WOW MOMENTS - FUTURE

- [ ] **Particle Effects**
  - [ ] Add burst animation when channeling artwork
  - [ ] Consider sound effects (opt-in)
  - [ ] Haptic feedback on mobile

- [ ] **Loading Experience**
  - [ ] Replace spinners with constellation animation
  - [ ] Add progressive image reveal
  - [ ] Show inspiring quotes during load

- [ ] **Guided Tour**
  - [ ] Create first-time user walkthrough
  - [ ] Add feature highlights
  - [ ] Implement achievement system

- [ ] **Sound Design**
  - [ ] Ambient cosmic soundtrack (opt-in)
  - [ ] Interaction sound effects
  - [ ] Audio-reactive sacred geometry

## 📱 TESTING REQUIRED

- [ ] **Real Device Testing**
  - [ ] iPhone SE (375px)
  - [ ] iPhone 14 (390px)
  - [ ] Small Android (360px)
  - [ ] iPad (768px)
  - [ ] Desktop (1920px)

- [ ] **Browser Testing**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Safari iOS
  - [ ] Chrome Android

- [ ] **Accessibility Testing**
  - [ ] Screen reader (NVDA/JAWS)
  - [ ] Keyboard-only navigation
  - [ ] Color blindness simulation
  - [ ] High contrast mode

- [ ] **Performance Testing**
  - [ ] Lighthouse audit (aim for 90+ on all metrics)
  - [ ] Test on throttled 3G connection
  - [ ] Check memory usage in DevTools
  - [ ] Profile React renders

## 🎯 SUCCESS METRICS

### Lighthouse Goals:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### User Experience Goals:
- Time to Interactive: < 3 seconds
- First Contentful Paint: < 1.5 seconds
- Gallery loads in: < 2 seconds (first 5 images)
- Mobile navigation responsive: < 200ms
- Form submission: < 500ms

### Accessibility Goals:
- WCAG AA compliance: 100%
- Keyboard navigation: All features accessible
- Screen reader friendly: All content announced
- Reduced motion: All animations respect preference

---

## 📊 PROGRESS TRACKING

**Last Updated:** October 4, 2025

### Completed:
- ✅ Code structure analysis
- ✅ Color contrast audit
- ✅ Component review
- ✅ Responsive design assessment
- ✅ Comprehensive QA report generated

### In Progress:
- 🔄 Server error investigation
- 🔄 Awaiting site to load for live testing

### Blocked:
- ⛔ Visual testing (waiting for server fix)
- ⛔ Interaction testing (waiting for server fix)
- ⛔ Screenshot capture (waiting for server fix)

---

**Next Review Date:** TBD (after server fix)
