'use client';

import { useState, useRef, useEffect } from 'react';
import { getTranslations, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

interface InlineEditFieldProps {
  value: string | number | null | undefined;
  fieldName: string;
  fieldType?: 'text' | 'number' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  onSave: (fieldName: string, value: string | number) => Promise<void>;
  onCancel?: () => void;
  className?: string;
  displayClassName?: string;
  inputClassName?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  validation?: (value: string) => string | null;
  formatDisplay?: (value: string | number | null | undefined) => string;
}

/**
 * Inline editing component for simple profile fields
 * Optimized for 月嫂 (elderly users) with large touch targets and clear feedback
 */
export default function InlineEditField({
  value,
  fieldName,
  fieldType = 'text',
  placeholder,
  onSave,
  onCancel,
  className = '',
  displayClassName = '',
  inputClassName = '',
  maxLength,
  min,
  max,
  validation,
  formatDisplay
}: InlineEditFieldProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize temp value when editing starts
  useEffect(() => {
    if (isEditing) {
      setTempValue(value?.toString() || '');
      setError('');
      setSaveSuccess(false);
      // Focus input after render
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isEditing, value]);

  // Handle click outside to cancel editing
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempValue('');
    setError('');
    setSaveSuccess(false);
    onCancel?.();
  };

  const handleSave = async () => {
    // Validate input
    if (validation) {
      const validationError = validation(tempValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Basic validation
    if (fieldType === 'email' && tempValue && !isValidEmail(tempValue)) {
      setError(t.profile.editing.invalidEmail);
      return;
    }

    if (fieldType === 'tel' && tempValue && !isValidPhone(tempValue)) {
      setError(t.profile.editing.invalidPhone);
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      
      // Convert value based on field type
      const finalValue = fieldType === 'number' ? parseFloat(tempValue) || 0 : tempValue;
      
      await onSave(fieldName, finalValue);
      
      // Show success feedback
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccess(false);
      }, 1000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : t.profile.editing.updateFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && fieldType !== 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const displayValue = formatDisplay ? formatDisplay(value) : (value?.toString() || t.profile.fields.notSet);

  if (isEditing) {
    return (
      <div ref={containerRef} className={`inline-edit-field ${className}`}>
        <div className="flex items-center space-x-2">
          {fieldType === 'textarea' ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${inputClassName}`}
              rows={3}
              disabled={isSaving}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={fieldType}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              min={min}
              max={max}
              className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputClassName}`}
              disabled={isSaving}
            />
          )}
          
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving || tempValue === value?.toString()}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-1 min-w-[60px] justify-center"
          >
            {isSaving ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : saveSuccess ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span>{t.profile.editing.save}</span>
            )}
          </button>
          
          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {t.profile.editing.cancel}
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-1 text-sm text-red-600 flex items-center space-x-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {/* Character Count */}
        {maxLength && fieldType === 'textarea' && (
          <div className="mt-1 text-xs text-gray-500 text-right">
            {tempValue.length}/{maxLength}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onClick={handleEdit}
      className={`inline-edit-display cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors group ${className}`}
      title={t.profile.editing.clickToEdit}
    >
      <div className={`flex items-center justify-between ${displayClassName}`}>
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue}
        </span>
        <svg 
          className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
    </div>
  );
}

// Utility functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Chinese phone number validation (simplified)
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}
