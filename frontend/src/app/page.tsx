import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { locales, defaultLocale, type Locale } from '@/lib/i18n';

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Get preferred locale from Accept-Language header
  let preferredLocale: Locale = defaultLocale;
  
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(',')
      .map((lang: string) => lang.split(';')[0].trim())
      .find((lang: string) => locales.includes(lang.split('-')[0] as Locale));
    
    if (preferred) {
      preferredLocale = preferred.split('-')[0] as Locale;
    }
  }
  
  // Redirect to the preferred locale
  redirect(`/${preferredLocale}`);
}
