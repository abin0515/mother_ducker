import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, type Locale } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  
  return {
    title: t.common.appName,
    description: 'Connecting families with professional postpartum caregivers',
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  
  return (
    <>
      {/* Navigation Header - Appears on ALL pages */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">
              🚀 {t.common.appName}
            </div>
            <div className="flex items-center space-x-4">
              <Link href={`/${locale}`} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                {t.navigation.home}
              </Link>
              <Link href={`/${locale}/about`} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                {t.navigation.about}
              </Link>
              <Link href={`/${locale}/contact`} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                {t.navigation.contact}
              </Link>
              <Link href={`/${locale}/signup`} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                {t.navigation.signup}
              </Link>
              <Link href={`/${locale}/login`} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                {t.navigation.login}
              </Link>
                             <LanguageSwitcher currentLocale={locale as Locale} />
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
          <p>&copy; 2024 {t.common.appName}. Built with Next.js & Tailwind CSS.</p>
        </div>
      </footer>
    </>
  );
}


