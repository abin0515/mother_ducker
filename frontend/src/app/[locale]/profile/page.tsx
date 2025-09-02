'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTranslations, type Locale } from '@/lib/i18n';
import { apiService, UserDto } from '@/lib/api';

import ProfileEditModal from '@/components/features/profile/ProfileEditModal';
import ProfileAvatar from '@/components/features/profile/ProfileAvatar';
import PhotoGallery from '@/components/ui/PhotoGallery';

export default function ProfilePage() {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const { user, backendUser, loading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserDto | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [editingModal, setEditingModal] = useState<{
    isOpen: boolean;
    section: 'professional' | 'experience' | 'photos' | 'certificates' | 'basic';
  }>({ isOpen: false, section: 'professional' });

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

  // Handle inline field updates
  const handleFieldUpdate = async (fieldName: string, value: string | number) => {
    if (!user?.uid) throw new Error(t.profile.editing.loginRequired);
    
    try {
      await apiService.updateProfileField(user.uid, fieldName, value);
      
      // Update local state
      const updatedProfile = { ...profile, [fieldName]: value };
      setProfileData(updatedProfile);
      
      // Also update the backendUser in useAuth if it's the same user
      // This would require extending the useAuth hook, for now we'll refetch
      await fetchProfileData();
      
    } catch (error) {
      console.error('Field update failed:', error);
      throw new Error(t.profile.editing.updateFailed);
    }
  };

  // Handle complex section updates via modal
  const handleSectionUpdate = async (updates: Partial<UserDto>) => {
    if (!user?.uid) throw new Error(t.profile.editing.loginRequired);
    
    try {
      await apiService.updateProfile(user.uid, updates);
      
      // Update local state
      const updatedProfile = { ...profile, ...updates };
      setProfileData(updatedProfile);
      
      // Refetch to ensure consistency
      await fetchProfileData();
      
    } catch (error) {
      console.error('Section update failed:', error);
      throw new Error(t.profile.editing.updateFailed);
    }
  };

  // Open modal for complex editing
  const openEditModal = (section: 'professional' | 'experience' | 'photos' | 'certificates' | 'basic') => {
    setEditingModal({ isOpen: true, section });
  };

  // Close modal
  const closeEditModal = () => {
    setEditingModal({ isOpen: false, section: 'professional' });
  };

  // Handle avatar update
  const handleAvatarUpdate = async (newAvatarUrl: string) => {
    if (!user?.uid) throw new Error(t.profile.editing.loginRequired);
    
    try {
      await apiService.updateProfileField(user.uid, 'profilePhotoUrl', newAvatarUrl);
      
      // Update local state
      const updatedProfile = { ...profile, profilePhotoUrl: newAvatarUrl };
      setProfileData(updatedProfile);
      
      // Refetch to ensure consistency
      await fetchProfileData();
      
    } catch (error) {
      console.error('Avatar update failed:', error);
      throw new Error(t.profile.editing.avatarUploadFailed);
    }
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
                  <div className="flex justify-center">
                    <ProfileAvatar
                      profilePhotoUrl={profile.profilePhotoUrl}
                      fullName={profile.fullName}
                      displayName={profile.displayName}
                      isEditable={true}
                      size="large"
                      onAvatarUpdate={handleAvatarUpdate}
                    />
                  </div>
                  
                  {/* Basic Info */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{t.profile.sections.basicInfo}</h3>
                      <button
                        onClick={() => openEditModal('basic')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>{t.profile.editing.edit}</span>
                      </button>
                    </div>
                    <div className="space-y-3">
                                             {/* Full Name */}
                       <div className="text-center">
                         <span className="text-sm font-medium text-gray-700">{t.profile.fields.fullName}: </span>
                         <span className="text-xl font-bold text-gray-900">{profile.fullName || t.profile.placeholders.fullName}</span>
                       </div>
                       {/* Display Name */}
                       <div className="text-center">
                         <span className="text-sm font-medium text-gray-700">{t.profile.fields.displayName}: </span>
                         <span className="text-gray-900">{profile.displayName || t.profile.placeholders.displayName}</span>
                       </div>
                    </div>
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
                      <div className="flex-1 text-center">
                        <span className="text-gray-900 font-medium">{profile.age || t.profile.placeholders.age}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t.profile.fields.phone}:</span>
                      <div className="flex-1 ml-2">
                        <span className="text-gray-900 text-right">
                          {profile.primaryPhone || t.profile.placeholders.phone}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t.profile.fields.wechat}:</span>
                      <div className="flex-1 ml-2">
                        <span className="text-gray-900 text-right">
                          {profile.wechatId || t.profile.placeholders.wechat}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t.profile.fields.location}:</span>
                      <div className="flex-1 ml-2">
                        <span className="text-gray-900 text-right">
                          {profile.city && profile.province 
                            ? `${profile.city}, ${profile.province}` 
                            : profile.city || t.profile.placeholders.city}
                        </span>
                      </div>
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{t.profile.professional.title}</h3>
                    <button
                      onClick={() => openEditModal('professional')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>{t.profile.editing.edit}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t.profile.professional.experience}</label>
                      <p className="mt-1 text-gray-900">
                        {profile.yearsOfExperience ? formatWithParams(t.profile.professional.experienceYears, { years: profile.yearsOfExperience }) : t.profile.fields.notSet}
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{t.profile.sections.aboutMe}</h3>
                  <button
                    onClick={() => openEditModal('experience')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>{t.profile.editing.edit}</span>
                  </button>
                </div>
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

            {/* Special Skills (for Caregivers) */}
            {profile.userType === 'CAREGIVER' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t.profile.sections.specialSkills}</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {profile.specialSkills || t.profile.sections.specialSkillsEmpty}
                  </p>
                </div>
              </div>
            )}

            {/* Gallery Photos */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{t.profile.sections.gallery}</h3>
                  <button
                    onClick={() => openEditModal('photos')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{t.profile.editing.managePhotos}</span>
                  </button>
                </div>
                <PhotoGallery
                  photos={profile.galleryPhotos ? JSON.parse(profile.galleryPhotos) : []}
                  title={t.profile.sections.gallery}
                  gridCols={3}
                  aspectRatio="square"
                  showCount={false}
                  className="mt-4"
                />
              </div>
            </div>

            {/* Certificates (for Caregivers) */}
            {profile.userType === 'CAREGIVER' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{t.profile.sections.certificates}</h3>
                    <button
                      onClick={() => openEditModal('certificates')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{t.profile.editing.manageCertificates}</span>
                    </button>
                  </div>
                  <PhotoGallery
                    photos={profile.certificatesPhotos ? JSON.parse(profile.certificatesPhotos) : []}
                    title={t.profile.sections.certificates}
                    gridCols={2}
                    aspectRatio="video"
                    showCount={false}
                    className="mt-4"
                  />
                </div>
              </div>
            )}

          </div>
        </div>


      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={editingModal.isOpen}
        onClose={closeEditModal}
        profile={profile}
        section={editingModal.section}
        onSave={handleSectionUpdate}
      />
    </div>
  );
}
