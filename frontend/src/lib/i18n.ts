import en from './translations/en.json';
import zh from './translations/zh.json';

export type Locale = 'en' | 'zh';

const translations = {
  en,
  zh,
};

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.en;
}

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale] || translations.en;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = keys.reduce((obj, key) => obj?.[key], translations.en);
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export const locales: Locale[] = ['en', 'zh'];
export const defaultLocale: Locale = 'en';

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;
  return locales.includes(locale) ? locale : defaultLocale;
}

export function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;
  
  if (locales.includes(locale)) {
    return '/' + segments.slice(2).join('/');
  }
  
  return pathname;
}
