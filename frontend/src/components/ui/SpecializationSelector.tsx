'use client';

import { useState } from 'react';
import { getTranslations, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

export interface SpecializationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Specialization selector with preset options and manual input
 * Optimized for 月嫂 with common specialization buttons + custom input
 */
export default function SpecializationSelector({
  value,
  onChange,
  placeholder,
  className = ''
}: SpecializationSelectorProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Core 8 specializations for 月嫂 platform
  const specializationPresets = [
    { key: 'newbornCare', label: t.profile.specializations.newbornCare },
    { key: 'breastfeedingSupport', label: t.profile.specializations.breastfeedingSupport },
    { key: 'confinementMeals', label: t.profile.specializations.confinementMeals },
    { key: 'postpartumRecovery', label: t.profile.specializations.postpartumRecovery },
    { key: 'lactationConsultant', label: t.profile.specializations.lactationConsultant },
    { key: 'infantCareSpecialist', label: t.profile.specializations.infantCareSpecialist },
    { key: 'infantMassage', label: t.profile.specializations.infantMassage },
    { key: 'nutritionalPlanning', label: t.profile.specializations.nutritionalPlanning }
  ];

  // Parse current specializations into array
  const getCurrentSpecializations = (): string[] => {
    if (!value || value.trim() === '') return [];
    return value.split(',').map(spec => spec.trim()).filter(spec => spec.length > 0);
  };

  // Add specialization to the list
  const addSpecialization = (specialization: string) => {
    const currentSpecializations = getCurrentSpecializations();
    
    // Check if specialization already exists (case insensitive)
    const exists = currentSpecializations.some(spec => 
      spec.toLowerCase() === specialization.toLowerCase()
    );
    
    if (!exists) {
      const newSpecializations = [...currentSpecializations, specialization];
      onChange(newSpecializations.join(', '));
    }
  };

  // Remove specialization from the list
  const removeSpecialization = (specializationToRemove: string) => {
    const currentSpecializations = getCurrentSpecializations();
    const filteredSpecializations = currentSpecializations.filter(spec => 
      spec.toLowerCase() !== specializationToRemove.toLowerCase()
    );
    onChange(filteredSpecializations.join(', '));
  };

  // Handle custom specialization input
  const handleCustomInput = (customSpecialization: string) => {
    if (customSpecialization.trim()) {
      addSpecialization(customSpecialization.trim());
      setShowCustomInput(false);
    }
  };

  const currentSpecializations = getCurrentSpecializations();

  return (
    <div className={`specialization-selector ${className}`}>
      
      {/* Current Specializations Display */}
      {currentSpecializations.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {currentSpecializations.map((specialization, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
              >
                {specialization}
                <button
                  onClick={() => removeSpecialization(specialization)}
                  className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                  title="Remove specialization"
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

      {/* Preset Specialization Buttons */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t.profile.specializations.presets}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {specializationPresets.map((preset) => {
            const isSelected = currentSpecializations.some(spec => 
              spec.toLowerCase() === preset.label.toLowerCase()
            );
            
            return (
              <button
                key={preset.key}
                onClick={() => addSpecialization(preset.label)}
                disabled={isSelected}
                className={`px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                  isSelected
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{preset.label}</span>
                  {isSelected && (
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t.profile.specializations.custom}
        </label>
        
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full px-3 py-2 text-left text-gray-500 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t.profile.specializations.addSpecialization}
          </button>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder={placeholder || "Enter specialization"}
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
