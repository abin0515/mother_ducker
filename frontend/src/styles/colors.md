# 🏥 Healthcare Professional Color System

## Overview
The Mother Ducker platform uses a healthcare professional color system designed to convey trust, cleanliness, and medical expertise. This color palette is optimized for accessibility and elderly-friendly usage.

## Primary Colors (Medical Teal)
**Brand Identity**: Trustworthy, professional, healthcare-focused

- `primary-50`: `#f0fdfa` - Very light teal backgrounds
- `primary-100`: `#ccfbf1` - Light teal subtle backgrounds  
- `primary-200`: `#99f6e4` - Soft teal hover states
- `primary-300`: `#5eead4` - Medium teal accents
- `primary-400`: `#2dd4bf` - Bright teal interactive
- `primary-500`: `#14b8a6` - **Main brand color**
- `primary-600`: `#0d9488` - Darker teal hover
- `primary-700`: `#0f766e` - Deep teal active
- `primary-800`: `#115e59` - Very deep teal text
- `primary-900`: `#134e4a` - Darkest teal headings

## Secondary Colors (Medical Gray)
**Supporting**: Clean, professional, readable

- `secondary-50`: `#f8fafc` - Pure white alternative
- `secondary-100`: `#f1f5f9` - Light background
- `secondary-200`: `#e2e8f0` - Borders, dividers
- `secondary-300`: `#cbd5e1` - Muted elements
- `secondary-400`: `#94a3b8` - Placeholder text
- `secondary-500`: `#64748b` - Secondary text
- `secondary-600`: `#475569` - Primary text
- `secondary-700`: `#334155` - Headings
- `secondary-800`: `#1e293b` - Strong emphasis
- `secondary-900`: `#0f172a` - Darkest text

## Semantic Colors (Medical-Grade)

### Success (Medical Green)
- `success-50`: `#f0fdf4` - Light background
- `success-500`: `#059669` - Main success color
- `success-600`: `#047857` - Hover state
- `success-700`: `#065f46` - Active state

### Warning (Medical Amber)
- `warning-50`: `#fffbeb` - Light background
- `warning-500`: `#d97706` - Main warning color
- `warning-600`: `#c2410c` - Hover state
- `warning-700`: `#9a3412` - Active state

### Error (Medical Red)
- `error-50`: `#fef2f2` - Light background
- `error-500`: `#dc2626` - Main error color
- `error-600`: `#b91c1c` - Hover state
- `error-700`: `#991b1b` - Active state

### Info (Medical Blue)
- `info-50`: `#eff6ff` - Light background
- `info-500`: `#0284c7` - Main info color
- `info-600`: `#0369a1` - Hover state
- `info-700`: `#1e40af` - Active state

## Usage Guidelines

### ✅ Do
- Use `primary-500` for main action buttons
- Use `secondary-600` for primary text
- Use `secondary-400` for placeholder text
- Use semantic colors for their intended purpose
- Maintain high contrast ratios for accessibility

### ❌ Don't
- Mix generic Tailwind colors with our healthcare palette
- Use bright, alarming colors for warnings
- Use low contrast combinations
- Override semantic color meanings

## Accessibility
All color combinations meet WCAG 2.1 AA standards:
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text
- Colors are distinguishable for color-blind users

## Component Integration
All design system components automatically use these colors:
- `Button` - Uses primary, secondary, success, error variants
- `Badge` - Uses all semantic colors with proper backgrounds
- `Alert` - Uses semantic colors with appropriate backgrounds
- `Card` - Uses secondary colors for borders and text
- `SectionHeader` - Uses primary and secondary colors for hierarchy

---
*This color system is designed specifically for the Mother Ducker platform to establish trust and professionalism in the postpartum care industry.*
