'use client';

import { useState, useEffect } from 'react';
import { getTranslations, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';
import { UserDto } from '@/lib/api';
import ImageUploadSection from './ImageUploadSection';
import LanguageSelector from '../../ui/LanguageSelector';
import SpecializationSelector from '../../ui/SpecializationSelector';
import ServiceSelector from '../../ui/ServiceSelector';
import ProvinceSelector from '../../ui/ProvinceSelector';
import CurrentLocationMap from '../../ui/CurrentLocationMap';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserDto;
  section: 'professional' | 'experience' | 'photos' | 'certificates' | 'basic' | 'location';
  onSave: (updates: Partial<UserDto>) => Promise<void>;
}

/**
 * Modal for editing complex profile sections
 * Optimized for 月嫂 with large interface and clear navigation
 */
export default function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  section,
  onSave
}: ProfileEditModalProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const [formData, setFormData] = useState<Partial<UserDto>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const formatWithParams = (template: string, params: Record<string, any>) => {
    return template.replace(/{(\w+)}/g, (match, key) => params[key] || match);
  };

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        // Basic information fields
        fullName: profile.fullName,
        displayName: profile.displayName,
        age: profile.age,
        primaryPhone: profile.primaryPhone,
        wechatId: profile.wechatId,
        province: profile.province,
        currentLocation: profile.currentLocation,
        // Professional fields
        yearsOfExperience: profile.yearsOfExperience,

        languages: profile.languages,
        specializations: profile.specializations,
        servicesOffered: profile.servicesOffered,

        aboutMe: profile.aboutMe,
        professionalExperience: profile.professionalExperience,

        specialSkills: profile.specialSkills,
        galleryPhotos: profile.galleryPhotos,
        certificatesPhotos: profile.certificatesPhotos
      });
      setError('');
    }
  }, [isOpen, profile]);

  const handleInputChange = (field: keyof UserDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      
      await onSave(formData);
      onClose();
      
    } catch (error) {
      console.error('Save failed:', error);
      setError(error instanceof Error ? error.message : t.profile.editing.updateFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImagesUpdate = async (field: 'galleryPhotos' | 'certificatesPhotos', urls: string[]) => {
    const jsonString = JSON.stringify(urls);
    handleInputChange(field, jsonString);
  };

  if (!isOpen) return null;

  const getSectionTitle = () => {
    switch (section) {
      case 'basic': return t.profile.sections.basicInfo;
      case 'location': return t.profile.location.currentLocation;
      case 'professional': return t.profile.professional.title;
      case 'experience': return t.profile.sections.workExperienceAndSkills;
      case 'photos': return t.profile.sections.gallery;
      case 'certificates': return t.profile.sections.certificates;
      default: return t.profile.editProfile;
    }
  };

  const renderSectionContent = () => {
    switch (section) {
      case 'professional':
        return (
          <div className="space-y-6">
            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.professional.experience}
              </label>
              <input
                type="number"
                value={formData.yearsOfExperience || ''}
                onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t.profile.placeholders.experience}
                min="0"
                max="50"
              />
            </div>



            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.professional.languages}
              </label>
              <LanguageSelector
                value={formData.languages || ''}
                onChange={(value) => handleInputChange('languages', value)}
                placeholder={t.profile.placeholders.languages}
              />
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.professional.specializations}
              </label>
              <SpecializationSelector
                value={formData.specializations || ''}
                onChange={(value) => handleInputChange('specializations', value)}
                placeholder={t.profile.placeholders.specializations}
              />
            </div>

            {/* Services Offered */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.professional.servicesOffered}
              </label>
              <ServiceSelector
                value={formData.servicesOffered || ''}
                onChange={(value) => handleInputChange('servicesOffered', value)}
                placeholder={t.profile.placeholders.servicesOffered}
              />
            </div>


          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            {/* About Me */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.sections.aboutMe}
              </label>
              <textarea
                value={formData.aboutMe || ''}
                onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={t.profile.placeholders.aboutMe}
                rows={6}
                maxLength={500}
              />
            </div>

            {/* Professional Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.sections.workExperience}
              </label>
              <textarea
                value={formData.professionalExperience || ''}
                onChange={(e) => handleInputChange('professionalExperience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={t.profile.placeholders.professionalExperience}
                rows={6}
                maxLength={1000}
              />
            </div>



            {/* Special Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.sections.specialSkills}
              </label>
              <textarea
                value={formData.specialSkills || ''}
                onChange={(e) => handleInputChange('specialSkills', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={t.profile.placeholders.specialSkills}
                rows={4}
                maxLength={500}
              />
            </div>
          </div>
        );

      case 'photos':
        return (
          <div>
            <ImageUploadSection
              title={t.profile.sections.gallery}
              images={formData.galleryPhotos ? JSON.parse(formData.galleryPhotos) : []}
              category="gallery"
              maxImages={20}
              onImagesUpdate={(urls) => handleImagesUpdate('galleryPhotos', urls)}
              aspectRatio="square"
            />
          </div>
        );

      case 'certificates':
        return (
          <div>
            <ImageUploadSection
              title={t.profile.sections.certificates}
              images={formData.certificatesPhotos ? JSON.parse(formData.certificatesPhotos) : []}
              category="certificates"
              maxImages={8}
              onImagesUpdate={(urls) => handleImagesUpdate('certificatesPhotos', urls)}
              aspectRatio="video"
            />
          </div>
        );

      case 'basic':
        return (
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.fields.fullName}
              </label>
              <input
                type="text"
                value={formData.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder={t.profile.placeholders.fullName}
                maxLength={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.fields.displayName}
              </label>
              <input
                type="text"
                value={formData.displayName || ''}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder={t.profile.placeholders.displayName}
                maxLength={30}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.fields.age}
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                placeholder={t.profile.placeholders.age}
                min={18}
                max={80}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.fields.phone}
              </label>
              <input
                type="tel"
                value={formData.primaryPhone || ''}
                onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
                placeholder={t.profile.placeholders.phone}
                maxLength={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* WeChat ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.fields.wechat}
              </label>
              <input
                type="text"
                value={formData.wechatId || ''}
                onChange={(e) => handleInputChange('wechatId', e.target.value)}
                placeholder={t.profile.placeholders.wechat}
                maxLength={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.fields.location}
              </label>
              <ProvinceSelector
                value={formData.province || ''}
                onChange={(value) => handleInputChange('province', value)}
                placeholder={t.profile.placeholders.province}
              />
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            {/* Current Location Map */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.profile.location.currentLocation}
              </label>
              <CurrentLocationMap
                value={formData.currentLocation || ''}
                onChange={(value) => handleInputChange('currentLocation', value)}
                readonly={false}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {getSectionTitle()}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderSectionContent()}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            {/* Error Message */}
            {error && (
              <div className="flex items-center text-red-600 text-sm">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            {/* Buttons */}
            <div className="flex items-center space-x-3 ml-auto">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.profile.editing.cancel}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors min-w-[80px] justify-center"
              >
                {isSaving ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <span>{t.profile.editing.save}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
