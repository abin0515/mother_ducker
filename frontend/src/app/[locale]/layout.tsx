import type { Metadata } from 'next';
import { getTranslations, type Locale } from '@/lib/i18n';
import Navigation from '@/components/layout/Navigation';

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
      <Navigation locale={locale as Locale} />

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


