'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTranslations, type Locale } from '@/lib/i18n';
import { apiService, UserDto } from '@/lib/api';

export default function ProfilePage() {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const { user, backendUser, loading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserDto | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, loading, router, locale]);

  useEffect(() => {
    if (user && backendUser) {
      fetchProfileData();
    }
  }, [user, backendUser]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    setLoadingProfile(true);
    try {
      const response = await apiService.getUserByFirebaseUid(user.uid);
      setProfileData(response);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const getVerificationBadge = (status?: string) => {
    const badges = {
      VERIFIED: { bg: 'bg-green-100', text: 'text-green-800', label: t.profile.verification.verified },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: t.profile.verification.pending },
      UNVERIFIED: { bg: 'bg-gray-100', text: 'text-gray-800', label: t.profile.verification.unverified }
    };
    const badge = badges[status as keyof typeof badges] || badges.UNVERIFIED;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatWithParams = (template: string, params: Record<string, any>) => {
    return template.replace(/{(\w+)}/g, (match, key) => params[key] || match);
  };

  const formatPhotoPlaceholder = (type: string) => (
    <div className="text-center py-8 text-gray-500">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="mt-2 text-sm">{formatWithParams(t.profile.fields.noPhoto, { type })}</p>
      <p className="text-xs text-gray-400">{t.profile.fields.uploadLater}</p>
    </div>
  );

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!backendUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.profile.completeProfile}</h2>
                <p className="text-gray-600 mb-6">{t.profile.completeRegistrationDesc}</p>
                <button 
                  onClick={() => router.push(`/${locale}/profile/complete`)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  {t.profile.completeRegistration}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profile = profileData || backendUser;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">{t.profile.title}</h1>
            <div className="flex items-center space-x-4">
              {getVerificationBadge(profile.verificationStatus)}
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {t.profile.completionRate}: {profile.profileCompletionPercentage || 0}%
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${profile.profileCompletionPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  {/* Profile Photo */}
                  <div className="mx-auto h-32 w-32 rounded-full overflow-hidden bg-gray-100">
                    {profile.profilePhotoUrl ? (
                      <img src={profile.profilePhotoUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-medium">
                        {profile.displayName?.charAt(0) || profile.fullName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  
                  {/* Basic Info */}
                  <div className="mt-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {profile.fullName || t.profile.fields.notSet}
                    </h2>
                    <p className="text-gray-600">
                      {profile.displayName || t.profile.fields.notSet}
                    </p>
                    <div className="mt-2 flex justify-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        profile.userType === 'CAREGIVER' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {profile.userType === 'CAREGIVER' ? t.profile.userTypes.caregiver : t.profile.userTypes.parent}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t.profile.fields.age}:</span>
                      <span className="text-gray-900">{profile.age || t.profile.fields.notSet}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t.profile.fields.phone}:</span>
                      <span className="text-gray-900">{profile.primaryPhone || t.profile.fields.notSet}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t.profile.fields.wechat}:</span>
                      <span className="text-gray-900">{profile.wechatId || t.profile.fields.notSet}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t.profile.fields.location}:</span>
                      <span className="text-gray-900">
                        {profile.city && profile.province ? `${profile.city}, ${profile.province}` : t.profile.fields.notSet}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Professional Info (for Caregivers) */}
            {profile.userType === 'CAREGIVER' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t.profile.professional.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t.profile.professional.experience}</label>
                      <p className="mt-1 text-gray-900">
                        {profile.yearsOfExperience ? formatWithParams(t.profile.professional.experienceYears, { years: profile.yearsOfExperience }) : t.profile.fields.notSet}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t.profile.professional.serviceRate}</label>
                      <p className="mt-1 text-gray-900">
                        {profile.hourlyRate ? formatWithParams(t.profile.professional.hourlyRate, { rate: profile.hourlyRate }) : t.profile.fields.notSet}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t.profile.professional.languages}</label>
                      <p className="mt-1 text-gray-900">{profile.languages || t.profile.fields.notSet}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t.profile.professional.rating}</label>
                      <p className="mt-1 text-gray-900">
                        {profile.totalRating ? formatWithParams(t.profile.professional.ratingDisplay, { rating: profile.totalRating, reviews: profile.totalReviews }) : t.profile.professional.noRating}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t.profile.professional.specializations}</label>
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">{profile.specializations || t.profile.fields.notSet}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t.profile.professional.servicesOffered}</label>
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">{profile.servicesOffered || t.profile.fields.notSet}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t.profile.professional.certifications}</label>
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">{profile.certifications || t.profile.fields.notSet}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Me */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t.profile.sections.aboutMe}</h3>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {profile.aboutMe || t.profile.sections.aboutMeEmpty}
                </p>
              </div>
            </div>

            {/* Professional Experience (for Caregivers) */}
            {profile.userType === 'CAREGIVER' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t.profile.sections.workExperience}</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {profile.professionalExperience || t.profile.sections.workExperienceEmpty}
                  </p>
                </div>
              </div>
            )}

            {/* Education & Skills (for Caregivers) */}
            {profile.userType === 'CAREGIVER' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t.profile.sections.education}</h3>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {profile.educationBackground || t.profile.sections.educationEmpty}
                    </p>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t.profile.sections.specialSkills}</h3>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {profile.specialSkills || t.profile.sections.specialSkillsEmpty}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Photos */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t.profile.sections.gallery}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.galleryPhotos ? (
                    JSON.parse(profile.galleryPhotos).map((photo: string, index: number) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 md:col-span-3">
                      {formatPhotoPlaceholder(t.profile.photoTypes.gallery)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Certificates (for Caregivers) */}
            {profile.userType === 'CAREGIVER' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t.profile.sections.certificates}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.certificatesPhotos ? (
                      JSON.parse(profile.certificatesPhotos).map((cert: string, index: number) => (
                        <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img src={cert} alt={`Certificate ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-1 md:col-span-2">
                        {formatPhotoPlaceholder(t.profile.photoTypes.certificate)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-8 flex justify-center">
          <button 
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => alert(t.profile.editComingSoon)}
          >
            {t.profile.editProfile}
          </button>
        </div>
      </div>
    </div>
  );
}
