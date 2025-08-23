import { Suspense } from 'react';
import UserProfileForm from '@/components/UserProfileForm';
import { getTranslations } from '@/lib/i18n';

interface CompleteProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default async function CompleteProfilePage({ params }: CompleteProfilePageProps) {
  const { locale } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <UserProfileForm locale={locale} />
    </Suspense>
  );
}
