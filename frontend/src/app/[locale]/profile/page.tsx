'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTranslations, type Locale } from '@/lib/i18n';
import { apiService, UserDto } from '@/lib/api';

import ProfileEditModal from '@/components/features/profile/ProfileEditModal';
import ProfileAvatar from '@/components/features/profile/ProfileAvatar';
import PhotoGallery from '@/components/ui/PhotoGallery';
import CurrentLocationMap from '@/components/ui/CurrentLocationMap';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SectionHeader from '@/components/ui/SectionHeader';
import { parseLocationString, openGoogleMaps, hasCoordinates } from '@/lib/mapUtils';

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
    section: 'professional' | 'experience' | 'photos' | 'certificates' | 'basic' | 'location';
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
    const badgeConfig = {
      VERIFIED: { variant: 'success' as const, label: t.profile.verification.verified },
      PENDING: { variant: 'warning' as const, label: t.profile.verification.pending },
      UNVERIFIED: { variant: 'default' as const, label: t.profile.verification.unverified }
    };
    const config = badgeConfig[status as keyof typeof badgeConfig] || badgeConfig.UNVERIFIED;
    
    return (
      <Badge variant={config.variant} size="sm">
        {config.label}
      </Badge>
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
  const openEditModal = (section: 'professional' | 'experience' | 'photos' | 'certificates' | 'basic' | 'location') => {
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
            <Card variant="elevated" padding="lg">
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
                <div className="mt-6">
                  <CardHeader>
                    <CardTitle level={3}>{t.profile.sections.basicInfo}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal('basic')}
                      icon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      }
                    >
                      {t.profile.editing.edit}
                    </Button>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Name Information */}
                    <div className="text-center space-y-2 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{t.profile.fields.fullName}: </span>
                        <span className="text-xl font-bold text-gray-900">{profile.fullName || t.profile.placeholders.fullName}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">{t.profile.fields.displayName}: </span>
                        <span className="text-gray-900 font-medium">{profile.displayName || t.profile.placeholders.displayName}</span>
                      </div>
                    </div>

                    {/* User Type Badge */}
                    <div className="flex justify-center mb-6">
                      <Badge 
                        variant={profile.userType === 'CAREGIVER' ? 'purple' : 'info'} 
                        size="md"
                      >
                        {profile.userType === 'CAREGIVER' ? t.profile.userTypes.caregiver : t.profile.userTypes.parent}
                      </Badge>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{t.profile.fields.age}</span>
                        <span className="text-sm font-semibold text-gray-900">{profile.age || t.profile.placeholders.age}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{t.profile.fields.phone}</span>
                        <span className="text-sm text-gray-900">{profile.primaryPhone || t.profile.placeholders.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{t.profile.fields.wechat}</span>
                        <span className="text-sm text-gray-900">{profile.wechatId || t.profile.placeholders.wechat}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{t.profile.fields.location}</span>
                        <span className="text-sm text-gray-900">{profile.province || t.profile.placeholders.province}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
            {/* Current Location Map */}
            <div className="mt-6">
              <Card variant="elevated" padding="md">
                <CardHeader>
                  <CardTitle level={3}>{t.profile.location.currentLocation}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal('location')}
                    icon={
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  >
                    {t.profile.editing.edit}
                  </Button>
                </CardHeader>
                
                <CardContent>
                  {/* Current Location Display */}
                  {profile.currentLocation && hasCoordinates(profile.currentLocation) ? (
                  <div>
                    {/* Clickable Address Block */}
                    <div 
                      onClick={() => {
                        const location = parseLocationString(profile.currentLocation);
                        if (location) {
                          openGoogleMaps(location, `${profile.displayName || profile.fullName}的位置`);
                        }
                      }}
                      className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors relative group"
                      title={t.profile.location.clickToViewDistance}
                    >
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-900">{t.profile.location.currentLocation}</p>
                          <p className="text-sm text-blue-700 break-words">{parseLocationString(profile.currentLocation)?.address}</p>
                        </div>
                        
                        {/* Click Indicator */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Hover Tooltip */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        {t.profile.location.clickToViewDistance}
                      </div>
                    </div>
                    
                    {/* Non-clickable Map Display */}
                    <CurrentLocationMap
                      value={profile.currentLocation}
                      readonly={true}
                      className="mb-4"
                    />
                  </div>
                ) : (
                  // Non-clickable display for locations without coordinates
                  <div>
                    {profile.currentLocation && (
                      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{t.profile.location.currentLocation}</p>
                            <p className="text-sm text-gray-700 break-words">{profile.currentLocation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <CurrentLocationMap
                      value={profile.currentLocation}
                      readonly={true}
                      className="mb-4"
                    />
                  </div>
                )}
                
                  {!profile.currentLocation && (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="mt-1">{t.profile.location.noLocationSet}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Professional Info (for Caregivers) */}
            {profile.userType === 'CAREGIVER' && (
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <CardTitle level={3}>{t.profile.professional.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal('professional')}
                    icon={
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    }
                  >
                    {t.profile.editing.edit}
                  </Button>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">{t.profile.professional.experience}</label>
                      <p className="mt-2 text-gray-900 font-medium">
                        {profile.yearsOfExperience ? formatWithParams(t.profile.professional.experienceYears, { years: profile.yearsOfExperience }) : t.profile.fields.notSet}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-600">{t.profile.professional.languages}</label>
                      <p className="mt-2 text-gray-900">{profile.languages || t.profile.fields.notSet}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-600">{t.profile.professional.rating}</label>
                      <p className="mt-2 text-gray-900">
                        {profile.totalRating ? formatWithParams(t.profile.professional.ratingDisplay, { rating: profile.totalRating, reviews: profile.totalReviews }) : t.profile.professional.noRating}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-6 pt-6 border-t border-gray-100">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">{t.profile.professional.specializations}</label>
                      <p className="mt-2 text-gray-900 whitespace-pre-wrap leading-relaxed">{profile.specializations || t.profile.fields.notSet}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">{t.profile.professional.servicesOffered}</label>
                      <p className="mt-2 text-gray-900 whitespace-pre-wrap leading-relaxed">{profile.servicesOffered || t.profile.fields.notSet}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* About Me */}
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle level={3}>{t.profile.sections.aboutMe}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal('experience')}
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  }
                >
                  {t.profile.editing.edit}
                </Button>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {profile.aboutMe || t.profile.sections.aboutMeEmpty}
                </p>
              </CardContent>
            </Card>

            {/* Professional Experience (for Caregivers) */}
            {profile.userType === 'CAREGIVER' && (
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <CardTitle level={3}>{t.profile.sections.workExperience}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {profile.professionalExperience || t.profile.sections.workExperienceEmpty}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Special Skills (for Caregivers) */}
            {profile.userType === 'CAREGIVER' && (
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <CardTitle level={3}>{t.profile.sections.specialSkills}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {profile.specialSkills || t.profile.sections.specialSkillsEmpty}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Gallery Photos */}
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle level={3}>{t.profile.sections.gallery}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal('photos')}
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                >
                  {t.profile.editing.managePhotos}
                </Button>
              </CardHeader>
              
              <CardContent>
                <PhotoGallery
                  photos={profile.galleryPhotos ? JSON.parse(profile.galleryPhotos) : []}
                  title={t.profile.sections.gallery}
                  gridCols={3}
                  aspectRatio="square"
                  showCount={false}
                />
              </CardContent>
            </Card>

            {/* Certificates (for Caregivers) */}
            {profile.userType === 'CAREGIVER' && (
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <CardTitle level={3}>{t.profile.sections.certificates}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal('certificates')}
                    icon={
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                  >
                    {t.profile.editing.manageCertificates}
                  </Button>
                </CardHeader>
                
                <CardContent>
                  <PhotoGallery
                    photos={profile.certificatesPhotos ? JSON.parse(profile.certificatesPhotos) : []}
                    title={t.profile.sections.certificates}
                    gridCols={2}
                    aspectRatio="video"
                    showCount={false}
                  />
                </CardContent>
              </Card>
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
