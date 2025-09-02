'use client';

import { useState, useRef } from 'react';
import { getTranslations, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';
import { ImageService } from '@/lib/imageService';
import { useAuth } from '@/hooks/useAuth';

interface ProfileAvatarProps {
  profilePhotoUrl?: string;
  fullName?: string;
  displayName?: string;
  isEditable?: boolean;
  size?: 'small' | 'medium' | 'large';
  onAvatarUpdate?: (newAvatarUrl: string) => Promise<void>;
  className?: string;
}

/**
 * Professional avatar component for 月嫂 profiles
 * Features: large display, easy upload, beautiful defaults
 */
export default function ProfileAvatar({
  profilePhotoUrl,
  fullName,
  displayName,
  isEditable = false,
  size = 'large',
  onAvatarUpdate,
  className = ''
}: ProfileAvatarProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);
  const { user } = useAuth();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get size classes based on size prop
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-16 h-16';
      case 'medium': return 'w-24 h-24';
      case 'large': return 'w-32 h-32 md:w-40 md:h-40';
      default: return 'w-32 h-32 md:w-40 md:h-40';
    }
  };

  // Generate default avatar with user initials
  const getDefaultAvatar = () => {
    const initials = getInitials();
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    
    // Use name to consistently pick a color
    const colorIndex = (fullName || displayName || 'User').length % colors.length;
    const bgColor = colors[colorIndex];
    
    return (
      <div className={`${getSizeClasses()} ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl`}>
        {initials}
      </div>
    );
  };

  // Get user initials for default avatar
  const getInitials = () => {
    const name = displayName || fullName || '';
    if (!name) return 'U';
    
    // Handle Chinese names (usually 2-3 characters)
    if (/[\u4e00-\u9fff]/.test(name)) {
      return name.slice(-2); // Last 2 characters for Chinese names
    }
    
    // Handle English names
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    if (!user) {
      setError(t.profile.editing.loginRequired);
      return;
    }

    if (!onAvatarUpdate) {
      setError(t.profile.editing.cannotUpdateAvatar);
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      setUploadProgress(0);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setUploadProgress(25);

      // Upload to Firebase Storage
      const result = await ImageService.uploadImage(
        file,
        user.uid,
        'profile',
        {
          maxSizeMB: 3,
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.9
        }
      );
      
      setUploadProgress(75);

      // Update profile in backend
      await onAvatarUpdate(result.url);
      setUploadProgress(100);

      // Clean up preview URL
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl('');

      // Clear progress after success
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Avatar upload failed:', error);
      setError(error instanceof Error ? error.message : t.profile.editing.uploadFailed);
      
      // Clean up preview URL on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Handle click to upload
  const handleUploadClick = () => {
    if (isEditable && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  // Current avatar to display
  const currentAvatarUrl = previewUrl || profilePhotoUrl;

  return (
    <div className={`profile-avatar ${className}`}>
      {/* Avatar Display */}
      <div className="relative inline-block">
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt={`${fullName || displayName || 'User'} 的头像`}
            className={`${getSizeClasses()} rounded-full object-cover border-4 border-white shadow-lg ${
              isEditable ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
            }`}
            onClick={handleUploadClick}
            loading="lazy"
          />
        ) : (
          <div 
            className={`${isEditable ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} border-4 border-white shadow-lg`}
            onClick={handleUploadClick}
          >
            {getDefaultAvatar()}
          </div>
        )}

        {/* Upload Overlay */}
        {isEditable && (
          <div 
            className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center cursor-pointer"
            onClick={handleUploadClick}
          >
            <div className="opacity-0 hover:opacity-100 transition-opacity text-white text-center">
              <svg className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs">{t.profile.editing.changeAvatar}</span>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-xs">{uploadProgress}%</div>
            </div>
          </div>
        )}

        {/* Edit Icon (for small avatars) */}
        {isEditable && size === 'small' && !isUploading && (
          <button
            onClick={handleUploadClick}
            className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 transition-colors shadow-lg"
            title={t.profile.editing.changeAvatar}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Upload Instructions (for large avatars) */}
      {isEditable && size === 'large' && !currentAvatarUrl && !isUploading && (
        <div className="mt-3 text-center">
          <button
            onClick={handleUploadClick}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {t.profile.editing.uploadAvatar}
          </button>
          <p className="text-xs text-gray-500 mt-1">
            {t.profile.editing.avatarFormats}
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-50 text-red-700">
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
