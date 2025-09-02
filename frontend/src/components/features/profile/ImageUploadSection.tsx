'use client';

import { useState, useRef } from 'react';
import { getTranslations, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';
import { ImageService, ImageUploadResult } from '@/lib/imageService';
import { useAuth } from '@/hooks/useAuth';

interface ImageUploadSectionProps {
  title: string;
  images: string[];
  category: 'profile' | 'gallery' | 'certificates';
  maxImages?: number;
  onImagesUpdate: (urls: string[]) => Promise<void>;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  showThumbnails?: boolean;
}

/**
 * Image upload component optimized for 月嫂 (elderly users)
 * Features: drag & drop, large buttons, clear progress feedback
 */
export default function ImageUploadSection({
  title,
  images,
  category,
  maxImages = category === 'profile' ? 1 : 20,
  onImagesUpdate,
  className = '',
  aspectRatio = 'square',
  showThumbnails = true
}: ImageUploadSectionProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatWithParams = (template: string, params: Record<string, any>) => {
    return template.replace(/{(\w+)}/g, (match, key) => params[key] || match);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!user) {
      setError(t.profile.editing.loginRequired);
      return;
    }

    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (images.length + fileArray.length > maxImages) {
      setError(`最多只能上传 ${maxImages} 张图片`);
      return;
    }

    uploadImages(fileArray);
  };

  const uploadImages = async (files: File[]) => {
    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const uploadResults: ImageUploadResult[] = [];
      
      // Upload files one by one to show progress
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(((i) / files.length) * 100);
        
        const result = await ImageService.uploadImage(
          file,
          user!.uid,
          category,
          {
            maxSizeMB: category === 'certificates' ? 10 : 5,
            maxWidth: category === 'profile' ? 800 : 1200,
            maxHeight: category === 'profile' ? 800 : 1200,
            quality: 0.85
          }
        );
        
        uploadResults.push(result);
      }
      
      setUploadProgress(100);
      
      // Update images array
      const newImageUrls = [...images, ...uploadResults.map(r => r.url)];
      await onImagesUpdate(newImageUrls);
      
      // Clear progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : t.profile.editing.uploadFailed);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      // Extract the storage path from the URL (if it's a Firebase URL)
      if (imageUrl.includes('firebase')) {
        // This is a simplified extraction - in production you might want to store the path separately
        const pathMatch = imageUrl.match(/\/o\/(.+?)\?/);
        if (pathMatch) {
          const decodedPath = decodeURIComponent(pathMatch[1]);
          await ImageService.deleteImage(decodedPath);
        }
      }
      
      // Update the images array
      const newImages = images.filter(img => img !== imageUrl);
      await onImagesUpdate(newImages);
      
    } catch (error) {
      console.error('Remove image failed:', error);
      setError(t.profile.editing.deleteFailed);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'video': return 'aspect-video';
      default: return 'aspect-auto';
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={`image-upload-section ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages}
        </span>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {images.map((imageUrl, index) => (
            <div key={index} className={`relative bg-gray-100 rounded-lg overflow-hidden group ${getAspectRatioClass()}`}>
              <img
                src={imageUrl}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Remove Button */}
              <button
                onClick={() => handleRemoveImage(imageUrl)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title={t.profile.imageUpload.removeImage}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* View Full Size Button */}
              <button
                onClick={() => window.open(imageUrl, '_blank')}
                className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                title={t.profile.imageUpload.viewFullSize}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-4">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <div className="text-gray-600">
                <div>{t.profile.imageUpload.uploading}</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm mt-1">{Math.round(uploadProgress)}%</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              
              <div className="text-gray-600">
                <div className="text-lg font-medium mb-2">
                  {dragActive ? t.profile.imageUpload.dropToUpload : '上传图片'}
                </div>
                <div className="text-sm">
                  {t.profile.imageUpload.dragHere}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                  >
                    {t.profile.imageUpload.selectFiles}
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div>{t.profile.imageUpload.supportedFormats}</div>
                <div>{formatWithParams(t.profile.imageUpload.maxSize, { size: category === 'certificates' ? '10' : '5' })}</div>
                {maxImages > 1 && <div>{formatWithParams(t.profile.imageUpload.maxCount, { count: maxImages - images.length })}</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={maxImages > 1}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2 text-red-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Upload Tips */}
      {!isUploading && images.length === 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-blue-700 text-sm space-y-1">
            <div className="font-medium">{t.profile.imageUpload.uploadTips}</div>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{t.profile.imageUpload.tip1}</li>
              <li>{t.profile.imageUpload.tip2}</li>
              {category === 'certificates' && <li>{t.profile.imageUpload.tip3Certificates}</li>}
              {category === 'gallery' && <li>{t.profile.imageUpload.tip3Gallery}</li>}
              {category === 'profile' && <li>{t.profile.imageUpload.tip3Profile}</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
