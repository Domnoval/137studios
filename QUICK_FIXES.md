# QUICK FIXES - Start Here

These are the fastest, highest-impact fixes you can make right now.

---

## 🔴 FIX #1: Server Error (BLOCKING EVERYTHING)

### Check your terminal where `npm run dev` is running

Look for error messages. Common issues:

#### Issue: Missing DATABASE_URL
```bash
Error: Environment variable not found: DATABASE_URL
```

**Fix:** Create/update `.env.local`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

#### Issue: Prisma not generated
```bash
Error: @prisma/client did not initialize yet
```

**Fix:**
```bash
npx prisma generate
npx prisma db push
```

#### Issue: NextAuth configuration
```bash
Error: NEXTAUTH_SECRET must be provided
```

**Fix:** Add to `.env.local`:
```env
NEXTAUTH_SECRET="run-this-to-generate-secret"
```

Generate secret:
```bash
openssl rand -base64 32
```

---

## 🟠 FIX #2: Text Contrast (15 minutes)

### File: `/mnt/c/Users/Domno/137studios/137studios/tailwind.config.ts`

**Find line 27:**
```ts
light: '#c084fc',
```

**Change to:**
```ts
light: '#d8b4fe',  // Lighter for better contrast
```

### File: `/mnt/c/Users/Domno/137studios/137studios/app/page.tsx`

**Find and remove opacity modifiers on text:**

**Before:**
```tsx
<p className="text-cosmic-light/70 text-base">
```

**After:**
```tsx
<p className="text-cosmic-light text-base">
```

**Find all instances:**
- Line 127: `text-cosmic-light/70` → `text-cosmic-light`
- Line 184: `text-cosmic-light/80` → `text-cosmic-light`

---

## 🟠 FIX #3: Mobile Navigation Spacing (10 minutes)

### File: `/mnt/c/Users/Domno/137studios/137studios/components/Navigation.tsx`

**Find line 55 (the flex container):**

**Before:**
```tsx
<div className="flex justify-between items-center">
```

**After:**
```tsx
<div className="flex justify-between items-center gap-4">
```

**Find line 85 (mobile menu button):**

**Before:**
```tsx
className="md:hidden w-10 h-10 rounded-full..."
```

**After:**
```tsx
className="md:hidden w-12 h-12 rounded-full..."
```

### File: `/mnt/c/Users/Domno/137studios/137studios/components/MobileMenu.tsx`

**Find line 74:**

**Before:**
```tsx
className="fixed top-0 right-0 w-80 h-full..."
```

**After:**
```tsx
className="fixed top-0 right-0 w-72 h-full..."
```

---

## 🟠 FIX #4: Contact Form Validation (30 minutes)

### File: `/mnt/c/Users/Domno/137studios/137studios/app/page.tsx`

**Find the form section (around line 209). Replace the form element:**

**Before:**
```tsx
<form className="space-y-6">
```

**After:**
```tsx
'use client';

import { useState } from 'react';

// Add at top of component
const [formState, setFormState] = useState({ name: '', email: '', message: '' });
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

  // Validate
  const newErrors = {};
  if (!formState.name.trim()) newErrors.name = 'Name is required';
  if (!formState.email.trim()) newErrors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(formState.email)) newErrors.email = 'Email is invalid';
  if (!formState.message.trim()) newErrors.message = 'Message is required';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsSubmitting(true);

  try {
    // TODO: Create API route
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    });

    if (response.ok) {
      setSubmitStatus('success');
      setFormState({ name: '', email: '', message: '' });
    } else {
      setSubmitStatus('error');
    }
  } catch (error) {
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
};

// Replace form:
<form onSubmit={handleSubmit} className="space-y-6">
```

**Update inputs to be controlled:**

```tsx
<input
  type="text"
  id="name"
  value={formState.name}
  onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
  className={`w-full px-4 py-3 bg-cosmic-void/50 border ${errors.name ? 'border-red-500' : 'border-cosmic-aura/30'} rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma transition-colors`}
  placeholder="Your name"
/>
{errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
```

**Update submit button:**

```tsx
<motion.button
  type="submit"
  disabled={isSubmitting}
  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
  className={`w-full py-4 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold text-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  {isSubmitting ? 'Sending...' : 'Send Message'}
</motion.button>

{submitStatus === 'success' && (
  <p className="text-green-400 text-center">Message sent successfully!</p>
)}
{submitStatus === 'error' && (
  <p className="text-red-400 text-center">Failed to send. Please try again.</p>
)}
```

---

## 🟠 FIX #5: Gallery Loading State (2 hours)

### File: `/mnt/c/Users/Domno/137studios/137studios/components/NewGallery.tsx`

**Add state for texture loading:**

```tsx
const [texturesLoaded, setTexturesLoaded] = useState(0);
const [totalTextures, setTotalTextures] = useState(0);

useEffect(() => {
  setTotalTextures(artworks.filter(a => a.imageUrl).length);
}, [artworks]);
```

**Update loading display:**

```tsx
{loading ? (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin text-6xl mb-4">✦</div>
      <p className="text-cosmic-light">Loading gallery...</p>
      {totalTextures > 0 && (
        <p className="text-cosmic-light/70 text-sm mt-2">
          {texturesLoaded} / {totalTextures} artworks
        </p>
      )}
      <div className="w-64 h-2 bg-cosmic-void/50 rounded-full mt-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cosmic-plasma to-cosmic-aura"
          initial={{ width: 0 }}
          animate={{ width: `${(texturesLoaded / totalTextures) * 100}%` }}
        />
      </div>
    </div>
  </div>
) : (
```

---

## 🟡 FIX #6: Reduced Motion Support (20 minutes)

### File: `/mnt/c/Users/Domno/137studios/137studios/components/InfiniteGallery.tsx`

**Add at top of GalleryScene component:**

```tsx
const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  setPrefersReducedMotion(mediaQuery.matches);

  const handler = (e) => setPrefersReducedMotion(e.matches);
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}, []);
```

**Update auto-play logic (line 394):**

```tsx
// Apply auto-play (only if motion not reduced)
if (autoPlay && !prefersReducedMotion) {
  setScrollVelocity((prev) => prev + 0.3 * delta);
}
```

---

## ✅ TEST YOUR FIXES

After each fix:

1. **Restart the dev server:**
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Test the specific feature:**
   - Server: Visit http://localhost:3000
   - Contrast: Check text readability
   - Mobile nav: Resize browser to 375px wide
   - Form: Try to submit empty, invalid, valid
   - Gallery: Watch for loading progress
   - Motion: Enable reduced motion in OS settings

4. **Check browser console:**
   - Look for any new errors
   - Warnings are usually okay

---

## 📱 QUICK MOBILE TEST

1. **Chrome DevTools Device Mode:**
   - F12 → Click phone icon
   - Select "iPhone SE"
   - Test navigation, forms, gallery

2. **Real Device (if available):**
   - Find your computer's local IP: `ipconfig` or `ifconfig`
   - Visit `http://YOUR_IP:3000` on phone
   - Must be on same WiFi network

---

## 🎯 SUCCESS CHECKLIST

After implementing these fixes:

- [ ] Site loads without 500 error
- [ ] Text is easily readable on all sections
- [ ] Mobile navigation doesn't overlap
- [ ] Form validates and shows errors
- [ ] Gallery shows loading progress
- [ ] Reduced motion is respected
- [ ] No console errors

---

## 🆘 IF STUCK

### Still getting 500 error?
1. Check `.env.local` exists and has all variables
2. Run `npx prisma generate`
3. Restart dev server
4. Check terminal for specific error messages

### Changes not showing?
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache completely
3. Restart dev server
4. Check you're editing correct file

### TypeScript errors?
1. Some fixes require adding imports
2. Check file has `'use client'` at top if using hooks
3. Restart TypeScript server in VSCode

---

**Estimated Total Time:** 3-4 hours
**Impact:** Site becomes functional, accessible, and ready for testing
**Next Steps:** Review full VISUAL_QA_REPORT.md for all recommendations
