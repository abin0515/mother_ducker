'use client';

import React from 'react';
import Link from 'next/link';
import { 
  SectionContainer, Section, SectionHeaderLayout, SectionTitle, SectionContent,
  Card, CardContent, CardHeader, CardTitle, Badge, Button,
  CurrentLocationMap, Alert
} from '@/components/ui';

interface ProfileLabels {
  // Profile sections
  basicInfo: string;
  professionalInfo: string;
  aboutMe: string;
  workExperience: string;
  specialSkills: string;
  gallery: string;
  certificates: string;
  currentLocation: string;
  
  // Profile fields
  fullName: string;
  age: string;
  phone: string;
  wechat: string;
  location: string;
  experience: string;
  languages: string;
  specializations: string;
  servicesOffered: string;
  hourlyRate: string;
  rating: string;
  
  // User types and verification
  verified: string;
  pending: string;
  unverified: string;
  caregiver: string;
  
  // Empty states
  aboutMeEmpty: string;
  workExperienceEmpty: string;
  specialSkillsEmpty: string;
  noPhotos: string;
  notSet: string;
  
  // Formatting
  experienceYears: string;
  ratingDisplay: string;
  noRating: string;
  
  // Actions
  viewOnGoogleMaps: string;
  clickToViewDistance: string;
  contactCaregiver: string;
  sendMessage: string;
  viewProfile: string;
  backToSearch: string;
  
  // Loading and errors
  loading: string;
  error: string;
  profileNotFound: string;
}

interface Props {
  locale: string;
  profile: any; // UserDto from backend
  labels: ProfileLabels;
}

export default function CaregiverProfileClient({ locale, profile, labels }: Props) {

  if (!profile) {
    return (
      <SectionContainer>
        <Section>
          <SectionContent>
            <Alert variant="error">{labels.profileNotFound}</Alert>
            <div className="mt-card">
              <Link href={`/${locale}/search`}>
                <Button variant="secondary">{labels.backToSearch}</Button>
              </Link>
            </div>
          </SectionContent>
        </Section>
      </SectionContainer>
    );
  }

  const getVerificationBadge = () => {
    const status = profile.verificationStatus?.toLowerCase();
    if (status === 'verified') return <Badge variant="success">{labels.verified}</Badge>;
    if (status === 'pending') return <Badge variant="warning">{labels.pending}</Badge>;
    return <Badge variant="default">{labels.unverified}</Badge>;
  };

  const formatExperience = (years: number) => {
    return labels.experienceYears.replace('{years}', years.toString());
  };

  const formatRating = (rating: number, reviews: number) => {
    return labels.ratingDisplay
      .replace('{rating}', rating.toFixed(1))
      .replace('{reviews}', reviews.toString());
  };

  return (
    <SectionContainer>
      <Section>
        <SectionHeaderLayout>
          <div className="flex items-center justify-between">
            <SectionTitle>{profile.displayName || profile.fullName || labels.caregiver}</SectionTitle>
            <Link href={`/${locale}/search`}>
              <Button variant="ghost" size="sm">{labels.backToSearch}</Button>
            </Link>
          </div>
        </SectionHeaderLayout>
        
        <SectionContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-card">
            {/* Left Column - Basic Info & Contact */}
            <div className="lg:col-span-1 space-y-card">
              {/* Profile Avatar & Basic Info */}
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <CardTitle level={3}>{labels.basicInfo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-medical-lg">
                    {profile.profilePhotoUrl ? (
                      <img
                        src={profile.profilePhotoUrl}
                        alt={`${profile.displayName || profile.fullName}${labels.verified}`}
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-100"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto bg-secondary-100 flex items-center justify-center">
                        <span className="text-secondary-500 text-medical-lg">
                          {(profile.displayName || profile.fullName || '?')[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="mt-medical-md">
                      <h2 className="text-medical-xl font-bold text-secondary-900">
                        {profile.displayName || profile.fullName}
                      </h2>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Badge variant="info">{labels.caregiver}</Badge>
                        {getVerificationBadge()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-medical-md">
                    {profile.age && (
                      <div className="flex justify-between">
                        <span className="text-secondary-600">{labels.age}:</span>
                        <span className="font-medium">{profile.age}</span>
                      </div>
                    )}
                    {profile.province && (
                      <div className="flex justify-between">
                        <span className="text-secondary-600">{labels.location}:</span>
                        <span className="font-medium">{profile.province}</span>
                      </div>
                    )}
                    {profile.yearsOfExperience && (
                      <div className="flex justify-between">
                        <span className="text-secondary-600">{labels.experience}:</span>
                        <span className="font-medium">{formatExperience(profile.yearsOfExperience)}</span>
                      </div>
                    )}
                    {profile.totalRating && profile.totalReviews > 0 && (
                      <div className="flex justify-between">
                        <span className="text-secondary-600">{labels.rating}:</span>
                        <span className="font-medium">{formatRating(profile.totalRating, profile.totalReviews)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-medical-lg pt-medical-lg border-t border-secondary-200">
                    <Button variant="primary" size="lg" className="w-full">
                      {labels.contactCaregiver}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Current Location Map */}
              {profile.currentLocation && (
                <Card variant="elevated" padding="lg">
                  <CardHeader>
                    <CardTitle level={3}>{labels.currentLocation}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CurrentLocationMap 
                      value={profile.currentLocation}
                      readonly={true}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Professional Info & Details */}
            <div className="lg:col-span-2 space-y-card">
              {/* Professional Information */}
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <CardTitle level={3}>{labels.professionalInfo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-medical-lg">
                    {profile.languages && (
                      <div>
                        <h4 className="font-semibold text-secondary-800 mb-2">{labels.languages}</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.languages.split(',').map((lang: string, idx: number) => (
                            <Badge key={idx} variant="info">{lang.trim()}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.servicesOffered && (
                      <div>
                        <h4 className="font-semibold text-secondary-800 mb-2">{labels.servicesOffered}</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.servicesOffered.split(',').map((service: string, idx: number) => (
                            <Badge key={idx} variant="success">{service.trim()}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.specializations && (
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-secondary-800 mb-2">{labels.specializations}</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.specializations.split(',').map((spec: string, idx: number) => (
                            <Badge key={idx} variant="default">{spec.trim()}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* About Me */}
              {profile.aboutMe && (
                <Card variant="elevated" padding="lg">
                  <CardHeader>
                    <CardTitle level={3}>{labels.aboutMe}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-secondary-700 leading-relaxed whitespace-pre-line">
                      {profile.aboutMe}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Work Experience */}
              {profile.professionalExperience && (
                <Card variant="elevated" padding="lg">
                  <CardHeader>
                    <CardTitle level={3}>{labels.workExperience}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-secondary-700 leading-relaxed whitespace-pre-line">
                      {profile.professionalExperience}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Special Skills */}
              {profile.specialSkills && (
                <Card variant="elevated" padding="lg">
                  <CardHeader>
                    <CardTitle level={3}>{labels.specialSkills}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-secondary-700 leading-relaxed whitespace-pre-line">
                      {profile.specialSkills}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Photo Gallery */}
              {profile.galleryPhotos && (
                <Card variant="elevated" padding="lg">
                  <CardHeader>
                    <CardTitle level={3}>{labels.gallery}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-medical-md">
                      {profile.galleryPhotos.split(',').filter((url: string) => url.trim()).map((url: string, idx: number) => (
                        <div key={idx} className="aspect-square rounded-medical overflow-hidden bg-secondary-100">
                          <img 
                            src={url.trim()} 
                            alt={`Gallery photo ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </SectionContent>
      </Section>
    </SectionContainer>
  );
}
