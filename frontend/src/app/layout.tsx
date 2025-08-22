import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Your New Project',
    template: '%s | Your New Project',
  },
  description: 'A modern web application built with Next.js, TypeScript, and Tailwind CSS',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Your New Project',
    description: 'A modern web application built with Next.js, TypeScript, and Tailwind CSS',
    siteName: 'Your New Project',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your New Project',
    description: 'A modern web application built with Next.js, TypeScript, and Tailwind CSS',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Navigation Header - Appears on ALL pages */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="text-xl font-bold text-gray-900">
                🚀 Your App
              </div>
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Home
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  About
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Contact
                </Link>
                <Link href="/signup" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Signup
                </Link>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Login
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content Area - Where page.tsx content goes */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

        {/* Footer - Appears on ALL pages */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Your New Project. Built with Next.js & Tailwind CSS.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
