'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { getTranslations, type Locale } from '@/lib/i18n';

export default function SignupPasswordPage() {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUpWithEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('signupEmail');
    if (!storedEmail) {
      // If no email, redirect back to signup
      router.push(`/${locale}/signup`);
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!password) {
      setError(t.validation.passwordRequired);
      return;
    }
    
    if (password.length < 6) {
      setError(t.validation.passwordTooShort);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signUpWithEmail(email, password);
      console.log('Email signup successful:', result.user);
      
      // Clear stored email
      sessionStorage.removeItem('signupEmail');
      
      // TODO: Send user data to your backend
      // const userData = {
      //   firebaseUid: result.user.uid,
      //   email: result.user.email,
      //   userType: 'PARENT' // or 'CAREGIVER'
      // };
      
      // Redirect to dashboard
      router.push(`/${locale}/dashboard`);
    } catch (error: any) {
      console.error('Email signup failed:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        setError(t.errors.invalidCredentials);
      } else if (error.code === 'auth/weak-password') {
        setError(t.validation.passwordTooShort);
      } else {
        setError(error.message || t.errors.unknownError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEmail = () => {
    // Clear stored email and go back to signup
    sessionStorage.removeItem('signupEmail');
    router.push(`/${locale}/signup`);
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-gray-900">月嫂Hub</h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {t.auth.signup.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t.auth.password.subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t.contact.email}
              </label>
              <div className="mt-1 flex">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  disabled
                  className="flex-1 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-500 bg-gray-50 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleEditEmail}
                  className="ml-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  {t.auth.password.editEmail}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t.auth.password.passwordPlaceholder.replace('Enter your password', 'Password')}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder={t.auth.password.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t.auth.creatingAccount}
                  </div>
                ) : (
                  t.auth.continue
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t.auth.signup.alreadyHaveAccount}{' '}
              <Link href={`/${locale}/login`} className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                {t.auth.signup.loginLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
