# SUN Donation Platform - Design System Guide

## Theme Overview
This document outlines the design system used throughout the SUN platform to ensure consistency and alignment across all components.

## Color Palette

### Primary Colors
- **Primary**: `#667eea` - Main brand color (Purple-Blue)
- **Primary Dark**: `#5a67d8` - Darker variation for hover states
- **Primary Light**: `#a3bffa` - Lighter variation for backgrounds

### Secondary Colors
- **Secondary**: `#764ba2` - Secondary brand color (Purple)
- **Accent**: `#f093fb` - Highlight color (Pink/Magenta) for CTAs

### Semantic Colors
- **Success**: `#48bb78` - For positive actions/states
- **Success Dark**: `#38a169`
- **Warning**: `#ed8936` - For alerts and warnings
- **Warning Dark**: `#dd6b20`
- **Danger**: `#fc5c65` - For destructive actions
- **Danger Dark**: `#e53e3e`
- **Info**: `#4299e1` - For informational messages

### Neutral Grays
- **Dark**: `#1a1a2e` - Primary dark background
- **Dark Secondary**: `#16213e` - Secondary dark background
- **Gray 50-800**: Full neutral palette from light to dark

## Typography

- **Font Family**: Inter (from Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900

### Font Sizes
- **Large Headings**: 1.5rem+ (brand, section titles)
- **Section Headings**: 0.95rem (uppercase, letter-spacing)
- **Body Text**: 0.875rem - 0.95rem
- **Small Text**: 0.8rem (secondary information)
- **Letter Spacing**: 0.025em for headers and labels

## Spacing & Sizing

### Border Radius
- **Small**: `8px` - Form elements, buttons
- **Medium**: `12px`
- **Large**: `16px`
- **Extra Large**: `24px` - Large cards

### Padding/Margins
- **Small**: 8px, 16px
- **Medium**: 24px
- **Large**: 40px, 60px
- **Extra Large**: 80px (section spacing)

### Shadows
- **Small**: `0 1px 3px rgba(0, 0, 0, 0.08)`
- **Medium**: `0 4px 6px rgba(0, 0, 0, 0.07)`
- **Large**: `0 10px 25px rgba(0, 0, 0, 0.1)`
- **Extra Large**: `0 20px 40px rgba(0, 0, 0, 0.15)`
- **Glow**: `0 0 30px rgba(102, 126, 234, 0.15)` (primary color glow)

## Transitions
- **Standard Duration**: 0.3s
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Usage**: Use `transition: var(--transition)` on interactive elements

## Component Guidelines

### Navigation Bar
- Dark gradient background (`--dark` to `--dark-secondary`)
- Brand text uses accent-to-primary gradient with text clipping
- Links: white text with 0.75 opacity, hover adds subtle background

### Buttons
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 600
- Include hover/focus states with color or shadow changes
- Use gradient backgrounds for primary action buttons

### Forms
- Input padding: 12px 16px
- Border: 2px solid gray-200
- Focus state: primary color border + glow shadow
- Labels: 600 weight, gray-700 color, 0.875rem

### Cards/Containers
- Background: white or semi-transparent dark
- Border Radius: 12-16px
- Shadow: Medium or Large based on importance
- Padding: 24px

### Footer
- Dark gradient background matching navbar
- Headings: gradient text (accent to primary-light)
- Links: white text at 0.7 opacity with hover animation
- Border top: thin line with primary color opacity
- Small text: 0.8rem with letter spacing

## Common Patterns

### Hover Effects
- Text links: Change color to accent or primary
- Buttons: Add shadow or scale transformation
- Icons/Elements: Subtle transform or opacity change

### Focus States
- Always include for accessibility
- Use primary color with glow effect
- Outline: none (handle with shadows/borders)

### Gradients
- Accent to Primary Light: Used for headings and brand elements
- Dark to Dark Secondary: Used for backgrounds

### Accessibility
- Minimum contrast ratio: WCAG AA (4.5:1 for text)
- Use semantic HTML
- Include focus states on all interactive elements
- Provide alt text for images

## CSS Variables Usage

```css
/* In your component CSS, use these variables */
color: var(--primary);
background: linear-gradient(135deg, var(--dark), var(--dark-secondary));
border-radius: var(--radius-md);
transition: var(--transition);
box-shadow: var(--shadow-lg);
padding: 24px; /* Use spacing scale */
```

## Future Component Checklist

When adding new components, ensure:
- ✅ Uses CSS variables from global.css
- ✅ Follows color palette (no hardcoded colors except in rare cases)
- ✅ Includes responsive design (mobile-first approach)
- ✅ Has proper hover/focus states
- ✅ Uses Inter font family
- ✅ Follows spacing scale (8px, 16px, 24px, etc.)
- ✅ Includes transitions for interactive elements
- ✅ Maintains accessibility standards
- ✅ Consistent with navbar/footer styling approach

## Files Reference

- **Colors & System**: `/src/styles/global.css` (CSS variables in `:root`)
- **Base Styles**: `/src/index.css` (typography, scrollbar)
- **Footer**: `/src/styles/footer.css` (aligned with design system)
- **Components**: Place component-specific styles in component folder or create modular CSS files
