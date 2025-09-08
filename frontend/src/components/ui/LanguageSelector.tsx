'use client';

import { useState } from 'react';
import { getTranslations, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

export interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Language selector with preset options and manual input
 * Optimized for 月嫂 with common language buttons + custom input
 */
export default function LanguageSelector({
  value,
  onChange,
  placeholder,
  className = ''
}: LanguageSelectorProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Common languages for 月嫂 platform
  const languagePresets = [
    { key: 'chinese', label: t.profile.languages.chinese },
    { key: 'english', label: t.profile.languages.english },
    { key: 'cantonese', label: t.profile.languages.cantonese },
    { key: 'spanish', label: t.profile.languages.spanish },
    
    
  ];

  // Parse current languages into array
  const getCurrentLanguages = (): string[] => {
    if (!value || value.trim() === '') return [];
    return value.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);
  };

  // Add language to the list
  const addLanguage = (language: string) => {
    const currentLanguages = getCurrentLanguages();
    
    // Check if language already exists (case insensitive)
    const exists = currentLanguages.some(lang => 
      lang.toLowerCase() === language.toLowerCase()
    );
    
    if (!exists) {
      const newLanguages = [...currentLanguages, language];
      onChange(newLanguages.join(', '));
    }
  };

  // Remove language from the list
  const removeLanguage = (languageToRemove: string) => {
    const currentLanguages = getCurrentLanguages();
    const filteredLanguages = currentLanguages.filter(lang => 
      lang.toLowerCase() !== languageToRemove.toLowerCase()
    );
    onChange(filteredLanguages.join(', '));
  };

  // Handle custom language input
  const handleCustomInput = (customLanguage: string) => {
    if (customLanguage.trim()) {
      addLanguage(customLanguage.trim());
      setShowCustomInput(false);
    }
  };

  const currentLanguages = getCurrentLanguages();

  return (
    <div className={`language-selector ${className}`}>
      
      {/* Current Languages Display */}
      {currentLanguages.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {currentLanguages.map((language, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
              >
                {language}
                <button
                  onClick={() => removeLanguage(language)}
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  title="Remove language"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preset Language Buttons */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t.profile.languages.presets}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {languagePresets.map((preset) => {
            const isSelected = currentLanguages.some(lang => 
              lang.toLowerCase() === preset.label.toLowerCase()
            );
            
            return (
              <button
                key={preset.key}
                onClick={() => addLanguage(preset.label)}
                disabled={isSelected}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  isSelected
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                {preset.label}
                {isSelected && (
                  <svg className="inline w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t.profile.languages.custom}
        </label>
        
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full px-3 py-2 text-left text-gray-500 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t.profile.languages.addLanguage}
          </button>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder={placeholder || "Enter language name"}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCustomInput(e.currentTarget.value);
                  e.currentTarget.value = '';
                } else if (e.key === 'Escape') {
                  setShowCustomInput(false);
                }
              }}
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  handleCustomInput(e.target.value);
                  e.target.value = '';
                }
                setShowCustomInput(false);
              }}
              autoFocus
            />
            <button
              onClick={() => setShowCustomInput(false)}
              className="px-3 py-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Hidden input for form compatibility */}
      <input
        type="hidden"
        value={value}
        onChange={() => {}} // Controlled by component logic
      />
    </div>
  );
}
