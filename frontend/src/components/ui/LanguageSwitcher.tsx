'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, type Locale, getPathnameWithoutLocale } from '@/lib/i18n';

export interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
    const pathWithoutLocale = getPathnameWithoutLocale(pathname);
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  const getLanguageName = (locale: Locale) => {
    switch (locale) {
      case 'en':
        return 'English';
      case 'zh':
        return 'Chinese';
      default:
        return locale;
    }
  };

  const getLanguageFlag = (locale: Locale) => {
    switch (locale) {
      case 'en':
        return '🇺🇸';
      case 'zh':
        return '🇨🇳';
      default:
        return '🌐';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        <span>{getLanguageFlag(currentLocale)}</span>
        <span>{getLanguageName(currentLocale)}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2 ${
                  locale === currentLocale ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span>{getLanguageFlag(locale)}</span>
                <span>{getLanguageName(locale)}</span>
                {locale === currentLocale && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
