'use client';

import { useState } from 'react';
import PhotoLightbox from './PhotoLightbox';

export interface PhotoGalleryProps {
  photos: string[];
  title?: string;
  className?: string;
  gridCols?: 'auto' | 2 | 3 | 4;
  aspectRatio?: 'square' | 'video' | 'auto';
  showCount?: boolean;
  maxDisplay?: number;
}

/**
 * Photo gallery component with lightbox functionality
 * Optimized for 月嫂 platform with large touch targets
 */
export default function PhotoGallery({
  photos,
  title = 'Photo Gallery',
  className = '',
  gridCols = 'auto',
  aspectRatio = 'square',
  showCount = true,
  maxDisplay
}: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className={`photo-gallery-empty ${className}`}>
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No photos to display</p>
        </div>
      </div>
    );
  }

  const displayPhotos = maxDisplay ? photos.slice(0, maxDisplay) : photos;
  const remainingCount = maxDisplay && photos.length > maxDisplay ? photos.length - maxDisplay : 0;

  const getGridClasses = () => {
    if (gridCols === 'auto') {
      // Responsive auto grid based on photo count
      if (displayPhotos.length === 1) return 'grid-cols-1';
      if (displayPhotos.length === 2) return 'grid-cols-2';
      if (displayPhotos.length <= 4) return 'grid-cols-2 md:grid-cols-2';
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
    
    switch (gridCols) {
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-2 md:grid-cols-3';
      case 4: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default: return 'grid-cols-2 md:grid-cols-3';
    }
  };

  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'video': return 'aspect-video';
      case 'auto': return 'aspect-auto';
      default: return 'aspect-square';
    }
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateToPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <div className={`photo-gallery ${className}`}>
      {/* Gallery Header */}
      {showCount && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>
      )}

      {/* Photo Grid */}
      <div className={`grid gap-3 md:gap-4 ${getGridClasses()}`}>
        {displayPhotos.map((photo, index) => (
          <div
            key={index}
            className={`relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-200 ${getAspectRatioClasses()}`}
            onClick={() => openLightbox(index)}
          >
            <img
              src={photo}
              alt={`${title} ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>

            {/* Photo Number Badge */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Show More Overlay */}
        {remainingCount > 0 && (
          <div
            className={`relative bg-gray-200 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-200 ${getAspectRatioClasses()} flex items-center justify-center`}
            onClick={() => openLightbox(maxDisplay!)}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">+{remainingCount}</div>
              <div className="text-sm text-gray-500">more photos</div>
            </div>
            
            {/* Background preview */}
            <div className="absolute inset-0 opacity-20">
              <img
                src={photos[maxDisplay!]}
                alt="More photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <PhotoLightbox
        isOpen={lightboxOpen}
        photos={photos}
        currentIndex={currentPhotoIndex}
        onClose={closeLightbox}
        onNavigate={navigateToPhoto}
        title={title}
      />
    </div>
  );
}
