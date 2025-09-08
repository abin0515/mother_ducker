/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy CSS variables (keep for compatibility)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        // 🏥 Healthcare Professional Color System
        // Primary: Medical Teal (trustworthy, professional, healthcare)
        primary: {
          50: '#f0fdfa',   // Very light teal backgrounds
          100: '#ccfbf1',  // Light teal subtle backgrounds
          200: '#99f6e4',  // Soft teal hover states
          300: '#5eead4',  // Medium teal accents
          400: '#2dd4bf',  // Bright teal interactive
          500: '#14b8a6',  // Main brand color
          600: '#0d9488',  // Darker teal hover
          700: '#0f766e',  // Deep teal active
          800: '#115e59',  // Very deep teal text
          900: '#134e4a',  // Darkest teal headings
        },
        
        // Secondary: Medical Gray (clean, professional, readable)
        secondary: {
          50: '#f8fafc',   // Pure white alternative
          100: '#f1f5f9',  // Light background
          200: '#e2e8f0',  // Borders, dividers
          300: '#cbd5e1',  // Muted elements
          400: '#94a3b8',  // Placeholder text
          500: '#64748b',  // Secondary text
          600: '#475569',  // Primary text
          700: '#334155',  // Headings
          800: '#1e293b',  // Strong emphasis
          900: '#0f172a',  // Darkest text
        },
        
        // Semantic Colors (medical-grade)
        success: {
          50: '#f0fdf4',
          500: '#059669',  // Medical green
          600: '#047857',
          700: '#065f46',
        },
        warning: {
          50: '#fffbeb',
          500: '#d97706',  // Medical amber
          600: '#c2410c',
          700: '#9a3412',
        },
        error: {
          50: '#fef2f2',
          500: '#dc2626',  // Medical red
          600: '#b91c1c',
          700: '#991b1b',
        },
        info: {
          50: '#eff6ff',
          500: '#0284c7',  // Medical blue
          600: '#0369a1',
          700: '#1e40af',
        },
      },
      
      // Healthcare-friendly typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // Healthcare-Optimized Spacing System
      spacing: {
        // Large touch targets for elderly users
        '18': '4.5rem',     // 72px - large touch targets
        '22': '5.5rem',     // 88px - extra large touch targets
        
        // Medical content spacing
        'medical-xs': '0.375rem',  // 6px - tight medical spacing
        'medical-sm': '0.75rem',   // 12px - small medical spacing
        'medical-md': '1.25rem',   // 20px - medium medical spacing
        'medical-lg': '2rem',      // 32px - large medical spacing
        'medical-xl': '3rem',      // 48px - extra large medical spacing
        'medical-2xl': '4rem',     // 64px - section spacing
        
        // Content-specific spacing
        'section': '2.5rem',       // 40px - between major sections
        'card': '1.5rem',          // 24px - between cards
        'field': '1rem',           // 16px - between form fields
      },
      
      // Professional border radius
      borderRadius: {
        'medical': '0.5rem',  // 8px - professional, clean corners
        'card': '0.75rem',    // 12px - card elements
      },
      
      // Healthcare shadows (subtle, clean)
      boxShadow: {
        'medical': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'medical-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medical-xl': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      
      // Healthcare-Optimized Responsive Breakpoints
      screens: {
        'mobile': '375px',    // Small phones
        'sm': '640px',        // Large phones / small tablets
        'md': '768px',        // Tablets
        'lg': '1024px',       // Small laptops
        'xl': '1280px',       // Desktop
        '2xl': '1536px',      // Large desktop
        
        // Healthcare-specific breakpoints
        'tablet-portrait': '768px',
        'tablet-landscape': '1024px',
        'desktop-medical': '1200px',  // Optimal for medical forms
      },
      
      // Enhanced Typography Scale for Healthcare
      fontSize: {
        'medical-xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px
        'medical-sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'medical-base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'medical-lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px - good for elderly
        'medical-xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px - headings
        'medical-2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px - section headers
        'medical-3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - page titles
      },
      
      // Healthcare Professional Animations
      animation: {
        // Subtle, professional animations
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'progress-fill': 'progressFill 1s ease-out',
        
        // Medical-grade loading states
        'medical-pulse': 'medicalPulse 1.5s ease-in-out infinite',
        'medical-spin': 'medicalSpin 1s linear infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      
      // Custom Keyframes for Healthcare Animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        medicalPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        medicalSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
      },
      
      // Professional Transition Timings
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
      },
      
      // Healthcare Hover Effects
      backdropBlur: {
        'medical': '8px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

