'use client';

import { useState, useEffect } from 'react';
import { getTranslations, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

interface PhotoLightboxProps {
  isOpen: boolean;
  photos: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title?: string;
}

/**
 * Photo lightbox modal optimized for 月嫂 platform
 * Features: large touch targets, simple navigation, mobile-friendly
 */
export default function PhotoLightbox({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onNavigate,
  title = 'Photo Gallery'
}: PhotoLightboxProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset image loading state when image changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentIndex]);

  const handlePrevious = () => {
    if (photos.length <= 1) return;
    const newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    if (photos.length <= 1) return;
    const newIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !photos.length) return null;

  const currentPhoto = photos[currentIndex];
  const hasMultiplePhotos = photos.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-90 transition-opacity"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-full flex flex-col">
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 bg-black bg-opacity-50">
          <div className="flex items-center space-x-4">
            <h2 className="text-white text-lg font-medium">{title}</h2>
            {hasMultiplePhotos && (
              <span className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {photos.length}
              </span>
            )}
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-black hover:bg-opacity-30 transition-colors"
            title={t.profile.editing.close || 'Close'}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Image Container */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          
          {/* Previous Button */}
          {hasMultiplePhotos && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
              title="Previous photo"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="absolute inset-16 flex items-center justify-center">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
            
            {imageError ? (
              <div className="text-white text-center p-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Failed to load image</p>
              </div>
            ) : (
              <img
                src={currentPhoto}
                alt={`${title} ${currentIndex + 1}`}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="eager"
              />
            )}
          </div>

          {/* Next Button */}
          {hasMultiplePhotos && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
              title="Next photo"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {hasMultiplePhotos && photos.length <= 10 && (
          <div className="relative z-10 p-4 bg-black bg-opacity-50">
            <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-white shadow-lg transform scale-110' 
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Touch Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 md:hidden">
          <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            Swipe left or right to navigate
          </p>
        </div>
      </div>
    </div>
  );
}
