'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { getTranslations, type Locale } from '@/lib/i18n';
import UserProfileForm from '@/components/UserProfileForm';

export default function ProfilePage() {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const { user, backendUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push(`/${locale}/login`);
    }
  }, [user, loading, router, locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{t.dashboard.profile}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  {t.profile.personalInfo || 'Personal Information'}
                </h2>
                <p className="text-sm text-gray-600">
                  {t.profile.personalInfoDesc || 'Update your personal information and profile settings.'}
                </p>
              </div>

              {/* User Profile Info Display */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {user.photoURL ? (
                      <img
                        className="h-16 w-16 rounded-full"
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl font-medium">
                        {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {user.displayName || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Firebase UID: {user.uid}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      backendUser 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {backendUser ? 'Profile Complete' : 'Profile Incomplete'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              {!backendUser ? (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Complete Your Profile
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Please complete your profile to access all features of the platform.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <UserProfileForm locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
