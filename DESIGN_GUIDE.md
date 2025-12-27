# Subic.Life Design Guide
**Based on Bistro Frequent Foodie Reference Design**

---

## 1. DESIGN PHILOSOPHY

### Core Principles
- **Mobile-First**: Design for mobile screens first, then scale up
- **Clean & Minimal**: Embrace white space, avoid clutter
- **Card-Based UI**: Use elevated cards for content grouping
- **Soft & Modern**: Gentle gradients, rounded corners, subtle shadows
- **User-Friendly**: Clear hierarchy, intuitive interactions, accessible design

---

## 2. COLOR PALETTE

### Primary Colors
```css
--primary-gradient-start: #B8E6E1;  /* Soft cyan/turquoise */
--primary-gradient-end: #E8F4F8;    /* Very light blue/white */
--background: linear-gradient(180deg, #B8E6E1 0%, #E8F4F8 100%);
```

### Neutral Colors
```css
--white: #FFFFFF;
--off-white: #F8F9FA;
--card-background: #FFFFFF;
--text-primary: #1A1A1A;          /* Near black for headings */
--text-secondary: #4A5568;        /* Medium gray for body text */
--text-muted: #718096;            /* Light gray for hints */
--border-light: #E2E8F0;
--border-medium: #CBD5E0;
```

### Accent Colors
```css
--accent-dark: #2D3748;           /* Dark buttons/icons */
--accent-hover: #1A202C;
--success: #48BB78;
--error: #F56565;
--warning: #ED8936;
--info: #4299E1;
```

---

## 3. TYPOGRAPHY

### Font Families
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-secondary: 'SF Pro Display', -apple-system, system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes & Weights
```css
/* Headings */
--h1-size: 32px;        /* Page titles like "Bistro Frequent Foodie" */
--h1-weight: 700;       /* Bold */
--h1-line-height: 1.2;

--h2-size: 24px;        /* Section headers */
--h2-weight: 600;       /* Semi-bold */

--h3-size: 18px;        /* Card titles like "No BFF card yet?" */
--h3-weight: 600;

--h4-size: 14px;        /* Small headers like "Sign In" */
--h4-weight: 500;       /* Medium */
--h4-letter-spacing: 0.5px;
--h4-text-transform: none;

/* Body Text */
--body-size: 16px;
--body-weight: 400;
--body-line-height: 1.5;

--small-size: 14px;     /* Labels, hints */
--small-weight: 400;
--small-line-height: 1.4;

--tiny-size: 12px;      /* Footnotes */
--tiny-weight: 400;
```

### Text Styles
- **Page Titles**: Large (32px), Bold (700), Dark (#1A1A1A), Centered
- **Section Labels**: Small (14px), Medium (500), Uppercase, Letter-spaced, Muted
- **Card Titles**: Medium (18px), Semi-bold (600), Dark
- **Body Text**: Regular (16px), Medium gray (#4A5568)
- **Helper Text**: Small (14px), Light gray (#718096)

---

## 4. LAYOUT & SPACING

### Container & Grid
```css
--max-width-mobile: 375px;
--max-width-tablet: 768px;
--max-width-desktop: 1200px;
--container-padding: 24px;
```

### Spacing Scale (8px base)
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

### Card Spacing
- **Card padding**: 24px (all sides)
- **Card margin**: 16px between cards
- **Card gap**: 12px between elements inside cards
- **Section spacing**: 32px between major sections

---

## 5. COMPONENTS

### Cards
```css
.card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
```

### Input Fields
```css
.input-field {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 16px;
  color: #1A1A1A;
  transition: all 0.2s ease;
}

.input-field:focus {
  border-color: #4299E1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  outline: none;
}

.input-label {
  font-size: 14px;
  color: #4A5568;
  margin-bottom: 8px;
  font-weight: 500;
}
```

### Buttons

**Primary Button (Dark Circle)**
```css
.btn-primary {
  background: #2D3748;
  color: #FFFFFF;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #1A202C;
  transform: scale(1.05);
}
```

**Secondary Button (Arrow)**
```css
.btn-secondary {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  transform: translateX(4px);
}
```

**Text Link**
```css
.text-link {
  color: #4A5568;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;
}

.text-link:hover {
  color: #2D3748;
}
```

### Icons
- **Size**: 20px - 24px for standard icons
- **Stroke width**: 2px
- **Style**: Outlined/line icons (similar to Lucide icons)
- **Color**: Inherit from parent or use --text-primary

---

## 6. SHADOWS & DEPTH

### Shadow Scale
```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);    /* Cards default */
--shadow-lg: 0 6px 16px rgba(0, 0, 0, 0.12);    /* Cards hover */
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.15);   /* Modals */
```

### Usage
- **Cards at rest**: shadow-md
- **Cards on hover**: shadow-lg
- **Modals/overlays**: shadow-xl
- **Subtle elements**: shadow-sm

---

## 7. BORDER RADIUS

```css
--radius-sm: 8px;      /* Small elements */
--radius-md: 12px;     /* Input fields */
--radius-lg: 16px;     /* Buttons, small cards */
--radius-xl: 20px;     /* Main cards */
--radius-2xl: 24px;    /* Large containers */
--radius-full: 9999px; /* Pills, circular buttons */
```

---

## 8. ANIMATIONS & TRANSITIONS

### Timing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Standard Transitions
```css
--transition-fast: 150ms ease-out;
--transition-base: 200ms ease-out;
--transition-slow: 300ms ease-out;
```

### Common Animations
- **Hover lift**: `transform: translateY(-2px)` + shadow increase
- **Button press**: `transform: scale(0.95)`
- **Button hover**: `transform: scale(1.05)`
- **Fade in**: `opacity: 0 → 1` over 300ms
- **Slide in**: `translateY(20px) → 0` over 400ms

---

## 9. RESPONSIVE BREAKPOINTS

```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
```

### Mobile-First Approach
1. Design for 375px width first
2. Scale up for tablets (768px+)
3. Optimize for desktop (1024px+)

---

## 10. ACCESSIBILITY

### Contrast Ratios
- **Normal text**: Minimum 4.5:1
- **Large text (18px+)**: Minimum 3:1
- **UI components**: Minimum 3:1

### Focus States
```css
:focus-visible {
  outline: 2px solid #4299E1;
  outline-offset: 2px;
}
```

### Touch Targets
- **Minimum size**: 44px × 44px
- **Recommended**: 48px × 48px
- **Spacing**: At least 8px between interactive elements

---

## 11. SPECIFIC COMPONENT PATTERNS

### Login/Sign-in Cards
- **Background**: Gradient from soft cyan to white
- **Cards**: White with 20px border-radius, 24px padding
- **Input fields**: White background, light border, 12px radius
- **Primary action**: Dark circular button (48px) with icon
- **Labels**: Small, medium weight, gray
- **Helper links**: Small text with icon, centered

### Information Cards
- **Title**: 18px, semi-bold, dark
- **Body**: 14-16px, regular, medium gray
- **Action**: Arrow icon aligned right
- **Hover**: Subtle lift + shadow increase

### Navigation
- **Clean top bar**: Minimal, transparent or white
- **Bottom spacing**: Plenty of breathing room
- **Icons**: Consistent 24px size

### My Pass Components (New)
- **Primary Color**: `#135bec` (Subic Blue)
- **Cards**: `rounded-3xl` (24px) or `rounded-[2rem]` (32px)
- **Shadows**: Deep elevation `shadow-[0_8px_32px_-4px_rgba(0,0,0,0.15)]`
- **Gradients**: "Northern Lights" glow effects for premium tiers
- **Navigation**: Sticky tabs with glassmorphism `backdrop-blur-xl`
- **Interactions**: 3D Flip, Shimmer effects, Pulse animations

---

## 12. DO'S AND DON'TS

### DO:
✓ Use soft gradients for backgrounds
✓ Give components breathing room with generous padding
✓ Use subtle shadows for depth
✓ Keep rounded corners consistent (20px for cards)
✓ Center important content on mobile
✓ Use high-quality icons (Lucide, Heroicons, etc.)
✓ Maintain visual hierarchy with font sizes and weights
✓ Add smooth transitions to interactive elements

### DON'T:
✗ Use harsh colors or high contrast gradients
✗ Overcrowd components
✗ Use multiple conflicting border radius values
✗ Use heavy shadows or dramatic effects
✗ Use busy backgrounds or patterns
✗ Mix too many font weights or sizes
✗ Forget hover/focus states
✗ Ignore mobile responsiveness

---

## 13. IMPLEMENTATION CHECKLIST

When styling the Concierge page (or any page), ensure:

- [ ] Soft gradient background applied
- [ ] All cards have 20px border-radius and proper shadow
- [ ] Typography follows the scale (32px titles, 16px body, etc.)
- [ ] Spacing uses the 8px scale consistently
- [ ] Input fields have proper focus states
- [ ] Buttons have hover and active states
- [ ] Icons are 20-24px and styled consistently
- [ ] Mobile-first responsive design
- [ ] Accessibility standards met (contrast, focus, touch targets)
- [ ] Smooth transitions on interactive elements (200-300ms)

---

## 14. DESIGN TOKENS (Ready for CSS Variables)

```css
:root {
  /* Colors */
  --gradient-start: #B8E6E1;
  --gradient-end: #E8F4F8;
  --white: #FFFFFF;
  --card-bg: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-secondary: #4A5568;
  --text-muted: #718096;
  --accent-dark: #2D3748;
  --border: #E2E8F0;

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --h1: 700 32px/1.2 var(--font-primary);
  --h2: 600 24px/1.3 var(--font-primary);
  --h3: 600 18px/1.4 var(--font-primary);
  --body: 400 16px/1.5 var(--font-primary);
  --small: 400 14px/1.4 var(--font-primary);

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Radius */
  --radius-input: 12px;
  --radius-card: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 6px 16px rgba(0, 0, 0, 0.12);

  /* Transitions */
  --transition: 200ms ease-out;
}
```

---

**End of Design Guide**

This guide should be referenced by all LLMs when working on the Subic.Life website to ensure visual consistency across all pages and components.
