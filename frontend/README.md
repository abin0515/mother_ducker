# Your New Project

A modern web application built with Next.js 13+, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Development**: Cursor with custom rules

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── loading.tsx        # Loading UI
│   ├── error.tsx          # Error UI
│   └── not-found.tsx      # 404 page
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
├── constants/            # Application constants
├── services/             # API services
├── store/                # State management
├── lib/                  # Library configurations
└── styles/               # Additional styles
```

## 🎯 Getting Started

1. **Install dependencies**:
   ```bash
   cd frontend
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Cursor Rules
This project uses custom Cursor rules for consistent development:

- **Component patterns**: `component-patterns.mdc`
- **TypeScript standards**: `typescript-standards.mdc`
- **Tailwind guidelines**: `tailwind-guidelines.mdc`
- **App Router patterns**: `app-router-patterns.mdc`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## 🎨 Styling

This project uses Tailwind CSS with a clean, minimal setup. Custom styles can be added in:

- `src/styles/globals.css` - Global styles
- Component-specific styles using Tailwind classes

## 📝 Next Steps

1. **Create your first component** in `src/components/ui/`
2. **Add new pages** in `src/app/`
3. **Define TypeScript types** in `src/types/`
4. **Create custom hooks** in `src/hooks/`
5. **Add API routes** in `src/app/api/`

## 🚀 Ready to Build!

Your frontend is now clean and ready for development. Start building your amazing application! 🎉
