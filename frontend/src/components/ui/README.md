# 🎨 Mother Ducker Design System

A comprehensive UI component library built for the Mother Ducker platform. Designed with accessibility, consistency, and ease of use in mind.

## 📦 Installation & Usage

### Basic Import
```typescript
import { Button, Card, Badge } from '@/components/ui';
```

### Category-based Import
```typescript
import { CoreComponents, FormComponents } from '@/components/ui';

// Use like this:
const { Button, Card } = CoreComponents;
const { LanguageSelector } = FormComponents;
```

### Individual Component Import
```typescript
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
```

## 🧩 Component Categories

### 🏗️ Core Components
Essential building blocks for consistent UI:

- **Button** - Primary action component with multiple variants
- **Card** - Container component with elevation and padding options  
- **Badge** - Status indicators and labels
- **SectionHeader** - Consistent section titles with actions

### 📝 Form Components  
Interactive elements for data input:

- **LanguageSelector** - Multi-language selection with presets
- **SpecializationSelector** - Professional skills selector
- **ServiceSelector** - Service type selector
- **ProvinceSelector** - Chinese provinces dropdown

### 🖼️ Media Components
Image and media handling:

- **PhotoGallery** - Responsive image grid with lightbox
- **PhotoLightbox** - Full-screen image viewer with navigation

### 🗺️ Map Components
Location functionality:

- **CurrentLocationMap** - Interactive Google Maps integration

### 🧭 Navigation Components
Navigation and language switching:

- **LanguageSwitcher** - Locale switching dropdown

## 🎯 Quick Examples

### Button Usage
```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" size="md" onClick={handleSave}>
  Save Changes
</Button>

// Button with icon and loading state
<Button 
  variant="secondary" 
  size="sm" 
  loading={isLoading}
  icon={<SaveIcon />}
>
  Save Draft
</Button>
```

### Card Usage
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardActions } from '@/components/ui';

<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle level={3}>User Profile</CardTitle>
    <Button variant="ghost" size="sm">Edit</Button>
  </CardHeader>
  
  <CardContent>
    <p>Profile information goes here...</p>
  </CardContent>
  
  <CardActions align="right">
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardActions>
</Card>
```

### Badge Usage
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="sm">Verified</Badge>
<Badge variant="warning" size="md">Pending</Badge>
<Badge variant="purple" size="lg">Caregiver</Badge>
```

## 🎨 Design Tokens

### Spacing Scale
```typescript
import { spacing } from '@/components/ui';

// Available spacing: xs, sm, md, lg, xl, 2xl, 3xl
const mySpacing = spacing.lg; // '1.5rem'
```

### Component Variants
```typescript
import { variants } from '@/components/ui';

// Button variants: primary, secondary, ghost, danger, success
// Badge variants: default, success, warning, danger, info, purple  
// Card variants: default, elevated, outlined, ghost
```

### Component Sizes
```typescript
import { sizes } from '@/components/ui';

// Button sizes: sm, md, lg, xl
// Badge sizes: sm, md, lg
```

## ♿ Accessibility Features

All components include:

- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Focus Management** - Clear focus indicators
- ✅ **ARIA Labels** - Proper semantic markup
- ✅ **Color Contrast** - WCAG AA compliant colors
- ✅ **Screen Reader** - Compatible with assistive technologies

## 🎯 Design Principles

### 1. **Consistency**
- Unified visual language across all components
- Standardized spacing, colors, and typography
- Predictable interaction patterns

### 2. **Accessibility First**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- High contrast color schemes

### 3. **Elderly-Friendly**
- Large touch targets (min 44px)
- Clear visual hierarchy
- Simple, intuitive interactions

### 4. **Developer Experience**
- TypeScript support with full type safety
- Comprehensive prop interfaces
- Clear component APIs

## 🚀 Performance

- **Tree Shaking** - Only import what you need
- **Lightweight** - Minimal bundle impact
- **Optimized** - Efficient rendering and re-renders
- **Cached** - Smart memoization where appropriate

## 📱 Responsive Design

All components are mobile-first and responsive:

- **Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- **Touch-Friendly**: Minimum 44px touch targets
- **Flexible Layouts**: Adapts to different screen sizes

## 🔧 Customization

### Extending Components
```tsx
import { Button, ButtonProps } from '@/components/ui';

interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}

const CustomButton = ({ customProp, ...props }: CustomButtonProps) => {
  return <Button {...props} className={`custom-class ${props.className}`} />;
};
```

### Theme Customization
Components use Tailwind CSS classes and can be customized through:

1. **Tailwind Config** - Modify colors, spacing, fonts
2. **CSS Variables** - Override specific design tokens
3. **Component Props** - Use className prop for custom styles

## 🧪 Testing

All components include:

- **Unit Tests** - Component behavior testing
- **Accessibility Tests** - ARIA and keyboard testing
- **Visual Regression** - Screenshot comparisons
- **Type Safety** - TypeScript compilation checks

## 📝 Contributing

When adding new components:

1. **Follow Naming Convention** - PascalCase for components
2. **Export Props Interface** - Always export TypeScript interfaces
3. **Include Documentation** - Add JSDoc comments
4. **Add to Index** - Update the main index.ts file
5. **Write Tests** - Include comprehensive test coverage

## 🔄 Version History

- **v1.0.0** - Initial release with core components
- Component library established with full TypeScript support
- Accessibility features implemented
- Mobile-responsive design system

---

**Happy Coding! 🚀**

For questions or contributions, please refer to the main project documentation.
