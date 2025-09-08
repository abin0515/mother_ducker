import { notFound } from 'next/navigation';
import { getTranslations, type Locale } from '@/lib/i18n';
import { apiService, type UserDto } from '@/lib/api';
import CaregiverProfileClient from './profileClient';

interface PageProps {
  params: { locale: Locale; id: string };
}

async function getCaregiverProfile(id: string): Promise<UserDto | null> {
  try {
    // Allow unauthenticated fetch on server; don't throw on 401/404
    const profile = await apiService.get<UserDto>(`/api/v1/users/${id}`, { requireAuth: false, throwOnError: false });
    return profile || null;
  } catch (error) {
    console.error('Failed to fetch caregiver profile:', error);
    return null;
  }
}

export default async function CaregiverProfilePage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = getTranslations(locale) as any;

  // Validate ID is numeric
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const profile = await getCaregiverProfile(id);
  
  if (!profile || profile.userType !== 'CAREGIVER') {
    notFound();
  }

  return (
    <CaregiverProfileClient 
      locale={locale} 
      profile={profile}
      labels={{
        // Profile sections
        basicInfo: t.profile?.sections?.basicInfo ?? 'Basic Information',
        professionalInfo: t.profile?.professional?.title ?? 'Professional Information',
        aboutMe: t.profile?.sections?.aboutMe ?? 'About Me',
        workExperience: t.profile?.sections?.workExperience ?? 'Work Experience',
        specialSkills: t.profile?.sections?.specialSkills ?? 'Special Skills',
        gallery: t.profile?.sections?.gallery ?? 'Photo Gallery',
        certificates: t.profile?.sections?.certificates ?? 'Certificates',
        currentLocation: t.profile?.location?.currentLocation ?? 'Current Location',
        
        // Profile fields
        fullName: t.profile?.fields?.fullName ?? 'Full Name',
        age: t.profile?.fields?.age ?? 'Age',
        phone: t.profile?.fields?.phone ?? 'Phone',
        wechat: t.profile?.fields?.wechat ?? 'WeChat',
        location: t.profile?.fields?.location ?? 'Location',
        experience: t.profile?.professional?.experience ?? 'Experience',
        languages: t.profile?.professional?.languages ?? 'Languages',
        specializations: t.profile?.professional?.specializations ?? 'Specializations',
        servicesOffered: t.profile?.professional?.servicesOffered ?? 'Services Offered',
        hourlyRate: t.profile?.professional?.hourlyRate ?? 'Hourly Rate',
        rating: t.profile?.professional?.rating ?? 'Rating',
        
        // User types and verification
        verified: t.profile?.verification?.verified ?? 'Verified',
        pending: t.profile?.verification?.pending ?? 'Pending',
        unverified: t.profile?.verification?.unverified ?? 'Unverified',
        caregiver: t.profile?.userTypes?.caregiver ?? 'Caregiver',
        
        // Empty states
        aboutMeEmpty: t.profile?.sections?.aboutMeEmpty ?? 'No personal introduction yet',
        workExperienceEmpty: t.profile?.sections?.workExperienceEmpty ?? 'No work experience yet',
        specialSkillsEmpty: t.profile?.sections?.specialSkillsEmpty ?? 'No special skills yet',
        noPhotos: t.profile?.gallery?.noPhotos ?? 'No photos available',
        notSet: t.profile?.fields?.notSet ?? 'Not Set',
        
        // Formatting
        experienceYears: t.profile?.professional?.experienceYears ?? '{years} years',
        ratingDisplay: t.profile?.professional?.ratingDisplay ?? '{rating}★ ({reviews} reviews)',
        noRating: t.profile?.professional?.noRating ?? 'No ratings yet',
        
        // Actions
        viewOnGoogleMaps: t.profile?.location?.viewOnGoogleMaps ?? 'View on Google Maps',
        clickToViewDistance: t.profile?.location?.clickToViewDistance ?? 'Click to view distance details',
        
        // Contact
        contactCaregiver: 'Contact Caregiver',
        sendMessage: 'Send Message',
        viewProfile: 'View Full Profile',
        backToSearch: 'Back to Search',
        
        // Loading and errors
        loading: t.common?.loading ?? 'Loading...',
        error: t.common?.error ?? 'Error',
        profileNotFound: 'Profile not found'
      }}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, id } = await params;
  const profile = await getCaregiverProfile(id);
  
  if (!profile) {
    return {
      title: 'Profile Not Found',
      description: 'The requested caregiver profile could not be found.'
    };
  }

  return {
    title: `${profile.displayName || profile.fullName || 'Caregiver'} - YuesaoHub`,
    description: `Professional caregiver with ${profile.yearsOfExperience || 0} years of experience. ${profile.aboutMe ? profile.aboutMe.substring(0, 150) + '...' : 'View detailed profile and services.'}`,
  };
}
