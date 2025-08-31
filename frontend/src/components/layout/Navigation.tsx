'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getTranslations, type Locale } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NavigationProps {
  locale: Locale;
}

export default function Navigation({ locale }: NavigationProps) {
  const { user, backendUser, loading, signOut } = useAuth();
  const t = getTranslations(locale);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user's first initial
  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);
      // Redirect to home page after logout
      window.location.href = `/${locale}`;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            🚀 {t.common.appName}
          </div>
          <div className="flex items-center space-x-4">
            {/* Common navigation links */}
            <Link 
              href={`/${locale}`} 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {t.navigation.home}
            </Link>
            <Link 
              href={`/${locale}/about`} 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {t.navigation.about}
            </Link>
            <Link 
              href={`/${locale}/contact`} 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {t.navigation.contact}
            </Link>

            {/* Conditional navigation based on authentication state */}
            {!loading && (
              <>
                {user ? (
                  // Authenticated user navigation
                  <>
                    <Link 
                      href={`/${locale}/dashboard`} 
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      {t.navigation.dashboard}
                    </Link>
                    
                    {/* User profile dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      {/* Profile button with user initial */}
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        {user.photoURL ? (
                          <img
                            className="w-10 h-10 rounded-full"
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                          />
                        ) : (
                          getUserInitial()
                        )}
                      </button>

                      {/* Dropdown panel */}
                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            {/* User info section */}
                            <div className="px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  {user.photoURL ? (
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={user.photoURL}
                                      alt={user.displayName || 'User'}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium">
                                      {getUserInitial()}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.displayName || 'User'}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                              <Link
                                href={`/${locale}/profile`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {t.dashboard.profile}
                              </Link>
                              
                              <button
                                onClick={handleSignOut}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-left"
                              >
                                <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {t.navigation.logout}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // Unauthenticated user navigation
                  <>
                    <Link 
                      href={`/${locale}/signup`} 
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      {t.navigation.signup}
                    </Link>
                    <Link 
                      href={`/${locale}/login`} 
                      className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                    >
                      {t.navigation.login}
                    </Link>
                  </>
                )}
              </>
            )}
            
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </nav>
      </div>
    </header>
  );
}
