# Subic.Life Design Inspiration & Ruleset

## Vision
**"Airbnb meets Premium Membership Club (Bistro BFF Style)"**

The goal is to create a visual experience that feels **exclusive, premium, and trustworthy**, yet **simple and accessible**. We move away from generic "bootstrap" styles to a tailored, high-end aesthetic.

## Visual DNA (The "Bistro BFF" Look)

### 1. Color Palette
*   **Canvas**: Pure White (`#FFFFFF`) or very subtle off-white (`#F9FAFB`) for the main background.
*   **Contrast**: Deep Black (`#111318`) or Dark Gray (`#1F2937`) for cards and primary actions.
*   **Accents**:
    *   **Subic Blue**: `#135bec` (Primary Brand)
    *   **Premium Gold**: `#D97706` (for Elite/VIP elements)
    *   **Teal/Green**: `#10B981` (Success/Value)
*   **Gradients**:
    *   **"The BFF Glow"**: A soft, diffused gradient often used on cards.
        *   *CSS*: `bg-gradient-to-br from-gray-900 to-gray-800` (Dark Mode Card)
        *   *Glass*: `backdrop-blur-xl bg-white/10` (Frosted Glass)
    *   **"Northern Lights"**: Subtle teal-to-blue-to-orange blur in backgrounds (used sparingly).

### 2. Typography
*   **Font**: `Inter` (Sans-serif). Clean, geometric, readable.
*   **Headings**: Bold, tight tracking (`tracking-tight`).
    *   `text-3xl font-bold tracking-tight text-gray-900`
*   **Body**: Readable, comfortable line height (`leading-relaxed`).
*   **Hierarchy**: clearly distinguishes "Label" (uppercase, small, tracking-wide) from "Value" (large, bold).

### 3. Component Styling
*   **Cards**:
    *   **Border Radius**: Generous. `rounded-2xl` (16px) or `rounded-3xl` (24px).
    *   **Shadows**: Soft, diffused shadows. `shadow-lg shadow-gray-200/50`.
    *   **Borders**: Subtle. `border border-gray-100`.
*   **Buttons**:
    *   **Shape**: Full pill shape (`rounded-full`) is preferred for primary CTAs.
    *   **Style**: Solid Black or Brand Blue text on White (or vice versa). High contrast.
*   **Inputs**:
    *   `rounded-xl` (12px). Gray-50 background. Focus rings are subtle brand color.

### 4. Layout Principles
*   **Mobile-First**: Design for the thumb zone. Bottom navigation, reachable cards.
*   **Whitespace**: "Premium" means space. Don't crowd elements. Use `gap-6` or `gap-8`.
*   **Horizontal Scroll**: Use horizontal scrolling rails for categories and cards to keep vertical space clean.

---

## Technical Implementation Rules (Tailwind v4)

### Gradients
```css
.bg-premium-dark {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.bg-glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.text-gradient-gold {
  background: linear-gradient(to right, #D97706, #F59E0B);
  -webkit-background-clip: text;
  color: transparent;
}
```

### Shadows
```css
.shadow-premium {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.1);
}
```

---

## Component Library Choices
*   **Base**: Shadcn UI (Radix Primitives).
*   **Icons**: Lucide React (Stroke width: 1.5px or 2px).
*   **Animation**: `tailwindcss-animate` (Subtle fades and slides).

---

## "World Class" Characteristics
1.  **Pixel Perfection**: Alignments must be exact.
2.  **Interaction Design**: Hover states, active states, and focus rings are mandatory.
3.  **Empty States**: Never leave a blank screen. Always guide the user.
4.  **Performance**: Images use `next/image`. No layout shifts.
