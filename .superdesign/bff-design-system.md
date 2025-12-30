# BFF Design System - Subiclife Pass Page

## Overview
This design system documents the BFF (Bistro Frequent Foodie) inspired design tokens for the Subiclife pass page redesign. The system emphasizes warm, inviting colors with soft gradients and accessible dark card components.

---

## Color Palette

### Background Gradient
The primary gradient flows across the page from warm peachy tones to soft cool tones:

- **Top**: `#f5d6c6` (Peachy Coral) - Warm, inviting entry point
- **Mid**: `#d4e4ec` (Soft Blue-Gray) - Transitional, calming middle
- **Bottom**: `#c8b8a8` (Warm Taupe) - Grounding, earthy finish

### Blur Orbs (Decorative Elements)
Soft, semi-transparent orbs provide depth and visual interest:

- **Coral Orb**: `#f5c4a8` at 40% opacity - Warm accent
- **Teal Orb**: `#a8d4dc` at 40% opacity - Cool accent
- **Warm Orb**: `#d4c4b8` at 40% opacity - Neutral warm accent

### Dark Card Components
High-contrast dark cards ensure readability and visual hierarchy:

- **Card Background**: `#1c1c1e` - Deep, sophisticated dark
- **Card Text**: `#ffffff` - Pure white for maximum contrast
- **Icon Circles**: `#f5e6d3` (Cream) - Warm, soft background for icons
- **Icon Color**: `#8b6914` (Warm Gold/Brown) - Rich, earthy accent

---

## Typography

### Font Stack
Maintain existing font hierarchy and stack across the application.

### Card Labels
- **Size**: 10px
- **Weight**: Bold/Semi-bold
- **Case**: UPPERCASE
- **Letter Spacing**: `tracking-[0.2em]` (0.2em)
- **Color**: Inherit from card context (white on dark cards)

### Benefits List Text
- **Size**: 14px
- **Weight**: Medium (500)
- **Color**: `#ffffff` (white)
- **Line Height**: Comfortable reading (1.6)

---

## Spacing

### Card Layout
- **Padding**: 24px (`p-6`) - Comfortable breathing room inside cards
- **Border Radius**: 2rem (32px) - Soft, rounded corners for approachability

### List Components
- **Item Gap**: 16px (`space-y-4`) - Clear visual separation between list items
- **Horizontal Spacing**: Maintain consistent padding within list items

### Icon Sizing
- **Dimensions**: 40px × 40px (`w-10 h-10`)
- **Container**: Icon circles in cream background (`#f5e6d3`)
- **Alignment**: Centered within circles, vertically aligned with text

---

## Components

### Perks Card Structure

The perks card displays membership benefits in an organized, visually appealing manner.

#### Layout Hierarchy
1. **Card Container**
   - Background: `#1c1c1e`
   - Padding: 24px
   - Border Radius: 2rem
   - Shadow: Subtle depth (existing shadow system)

2. **Card Header**
   - Title/Label: 10px, UPPERCASE, letter-spacing 0.2em
   - Positioned at top with clear visual separation

3. **Benefits List**
   - List Container: Vertical stack with 16px gaps (`space-y-4`)
   - List Item Structure:
     - Icon Circle: 40px × 40px, background `#f5e6d3` (cream)
     - Icon: 24px, color `#8b6914` (warm gold/brown)
     - Label Text: 14px, medium weight, white
     - Layout: Flexbox with icon left, text right, centered vertically

4. **Visual Consistency**
   - All icons use consistent color scheme
   - Maintain visual rhythm with uniform spacing
   - Ensure icon circles have subtle shadow or depth treatment

#### Responsive Considerations
- Card adapts to container width while maintaining padding ratios
- Icon and text alignment remains consistent across breakpoints
- List items stack naturally on mobile without layout shift

---

## Design Tokens Summary

| Token | Value | Usage |
|-------|-------|-------|
| `color-gradient-top` | `#f5d6c6` | Background gradient start |
| `color-gradient-mid` | `#d4e4ec` | Background gradient middle |
| `color-gradient-bottom` | `#c8b8a8` | Background gradient end |
| `color-orb-coral` | `#f5c4a8` @ 40% | Decorative accent orbs |
| `color-orb-teal` | `#a8d4dc` @ 40% | Decorative accent orbs |
| `color-orb-warm` | `#d4c4b8` @ 40% | Decorative accent orbs |
| `color-card-bg` | `#1c1c1e` | Dark card background |
| `color-card-text` | `#ffffff` | Card text color |
| `color-icon-circle` | `#f5e6d3` | Icon circle background |
| `color-icon-fill` | `#8b6914` | Icon fill color |
| `font-label-size` | 10px | Card labels |
| `font-label-weight` | Bold | Card labels |
| `font-label-spacing` | 0.2em | Card label letter spacing |
| `font-benefit-size` | 14px | Benefits list text |
| `font-benefit-weight` | 500 | Benefits list weight |
| `spacing-card-pad` | 24px | Card padding |
| `spacing-list-gap` | 16px | List item spacing |
| `sizing-icon` | 40px | Icon dimensions |
| `radius-card` | 2rem | Card border radius |

---

## Implementation Notes

1. **Color Accuracy**: Use exact hex values provided to maintain design consistency
2. **Opacity**: Blur orbs use 40% opacity for subtle layering without overwhelming the design
3. **Contrast**: Dark cards with white text meet WCAG AA accessibility standards
4. **Icon Integration**: Ensure icons within cream circles are SVGs or properly sized images
5. **Gradient Application**: Consider using CSS gradients or Tailwind's gradient utilities for smooth transitions
6. **Responsive**: Test card layouts across mobile (320px), tablet (768px), and desktop (1024px+) viewports
