'use client';

import { useState } from 'react';
import { getTranslations, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

interface ServiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Service selector with preset options and manual input
 * Optimized for 月嫂 with common service type buttons + custom input
 */
export default function ServiceSelector({
  value,
  onChange,
  placeholder,
  className = ''
}: ServiceSelectorProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Core 4 service types for 月嫂 platform
  const servicePresets = [
    { key: 'yuesao', label: t.profile.services.yuesao },
    { key: 'lactationSpecialist', label: t.profile.services.lactationSpecialist },
    { key: 'liveinNanny', label: t.profile.services.liveinNanny },
    { key: 'commutingCook', label: t.profile.services.commutingCook }
  ];

  // Parse current services into array
  const getCurrentServices = (): string[] => {
    if (!value || value.trim() === '') return [];
    return value.split(',').map(service => service.trim()).filter(service => service.length > 0);
  };

  // Add service to the list
  const addService = (service: string) => {
    const currentServices = getCurrentServices();
    
    // Check if service already exists (case insensitive)
    const exists = currentServices.some(serv => 
      serv.toLowerCase() === service.toLowerCase()
    );
    
    if (!exists) {
      const newServices = [...currentServices, service];
      onChange(newServices.join(', '));
    }
  };

  // Remove service from the list
  const removeService = (serviceToRemove: string) => {
    const currentServices = getCurrentServices();
    const filteredServices = currentServices.filter(serv => 
      serv.toLowerCase() !== serviceToRemove.toLowerCase()
    );
    onChange(filteredServices.join(', '));
  };

  // Handle custom service input
  const handleCustomInput = (customService: string) => {
    if (customService.trim()) {
      addService(customService.trim());
      setShowCustomInput(false);
    }
  };

  const currentServices = getCurrentServices();

  return (
    <div className={`service-selector ${className}`}>
      
      {/* Current Services Display */}
      {currentServices.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {currentServices.map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 border border-purple-200"
              >
                {service}
                <button
                  onClick={() => removeService(service)}
                  className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
                  title="Remove service"
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

      {/* Preset Service Buttons */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t.profile.services.presets}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {servicePresets.map((preset) => {
            const isSelected = currentServices.some(serv => 
              serv.toLowerCase() === preset.label.toLowerCase()
            );
            
            return (
              <button
                key={preset.key}
                onClick={() => addService(preset.label)}
                disabled={isSelected}
                className={`px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                  isSelected
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
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
          {t.profile.services.custom}
        </label>
        
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full px-3 py-2 text-left text-gray-500 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t.profile.services.addService}
          </button>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder={placeholder || "Enter service type"}
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
