# memory.md - BFF Design Tokens

## Color Palette

### Dark Mode Components (Stats, Buttons, Info)
- **Card Background**: `#1c1c1e` (Deep charcoal, BFF standard)
- **Card Text**: `#ffffff` (Pure white)
- **Label Text**: `rgba(255, 255, 255, 0.5)` or `text-white/50` (50% opacity white)
- **Icon Circle Background**: `#f5e6d3` (Warm cream)
- **Icon Color**: `#8b6914` (Warm gold/brown)

### Pass Card Gradient (Premium Bold)
- **Type**: Mesh/Complex Gradient
- **Class**: `bg-gradient-to-br from-[#135bec] via-[#2dd4bf] to-[#d97706]` (Subic Blue -> Teal -> Premium Gold)
- **Overlay**: `bg-black/10` (for text legibility if needed)

### Global Background (Bistro Mood)
- **Base**: `bg-[#f5d6c6]`
- **Gradient**: `bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c8dce8] via-[#f5d6c6] to-[#b8a89c]`
- **Orbs**:
    - Coral: `#ffc4a0`
    - Teal: `#a0d4e0`
    - Peach: `#f5c4b0`

## Typography

### Labels (BFF Standard)
- **Size**: 10px
- **Weight**: Bold (700)
- **Case**: UPPERCASE
- **Letter Spacing**: `0.2em` or `tracking-[0.2em]`
- **Color**: `text-white/50` (on dark cards)

### Values
- **Size**: 14px (small) or 16px (medium)
- **Weight**: Bold (700)
- **Color**: `text-white` (on dark cards)

## Spacing & Borders
- **Card Padding**: 16px (`p-4`) or 14px (`p-3.5`)
- **Card Border Radius**: 16px (`rounded-2xl`)
- **Card Shadow**: `shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]`
- **Gap Between Cards**: 10px (`gap-2.5`)
- **Icon Borders**: None (Seamless floating look)

## Icon Circles
- **Size**: 40px × 40px (`w-10 h-10`)
- **Background**: `#f5e6d3` (cream)
- **Icon Size**: 20px (`w-5 h-5`)
- **Icon Color**: `#8b6914` (warm gold)
- **Border Radius**: Full circle (`rounded-full`)

## Implementation Notes
- **Pass Card**: Bold mesh gradient, no badge, no icon borders.
- **Global**: Gradient extends to top, behind transparent header.
- **Typography**: All text on gradients must be Pure White (#FFFFFF).
- **Cleanup**: Remove "Starter Member" badge. No blinking animations.
