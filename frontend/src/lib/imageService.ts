import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface ImageUploadOptions {
  maxSizeMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface ImageUploadResult {
  url: string;
  path: string;
  fileName: string;
}

/**
 * Image service for uploading and managing profile images
 * Optimized for 月嫂 (elderly users) with simple, reliable uploads
 */
export class ImageService {
  
  /**
   * Upload image to Firebase Storage
   * @param file - Image file to upload
   * @param userId - User's Firebase UID
   * @param category - Image category: 'profile', 'gallery', 'certificates'
   * @param options - Upload options for optimization
   */
  static async uploadImage(
    file: File, 
    userId: string, 
    category: 'profile' | 'gallery' | 'certificates',
    options: ImageUploadOptions = {}
  ): Promise<ImageUploadResult> {
    
    // Default options optimized for 月嫂 profiles
    const defaultOptions: ImageUploadOptions = {
      maxSizeMB: 5,
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.8
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
      // Validate file
      this.validateImageFile(file, finalOptions);
      
      // Optimize image before upload
      const optimizedFile = await this.optimizeImage(file, finalOptions);
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const filePath = `users/${userId}/${category}/${fileName}`;
      
      // Create storage reference
      const storageRef = ref(storage, filePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, optimizedFile);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: filePath,
        fileName: fileName
      };
      
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }
  
  /**
   * Delete image from Firebase Storage
   */
  static async deleteImage(imagePath: string): Promise<void> {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Image deletion failed:', error);
      throw new Error('Failed to delete image, please try again'); // Will be handled by component
    }
  }
  
  /**
   * Upload multiple images (for gallery)
   */
  static async uploadMultipleImages(
    files: File[],
    userId: string,
    category: 'gallery' | 'certificates',
    options?: ImageUploadOptions
  ): Promise<ImageUploadResult[]> {
    
    const uploadPromises = files.map(file => 
      this.uploadImage(file, userId, category, options)
    );
    
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple image upload failed:', error);
      throw new Error('Batch upload failed, please try again'); // Will be handled by component
    }
  }
  
  /**
   * Validate image file
   */
  private static validateImageFile(file: File, options: ImageUploadOptions): void {
    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file'); // Will be handled by component
    }
    
    // Check file size
    const maxSizeBytes = (options.maxSizeMB || 5) * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`File size cannot exceed ${options.maxSizeMB}MB`); // Will be handled by component
    }
    
    // Check file format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Supported formats: JPG, PNG, WebP'); // Will be handled by component
    }
  }
  
  /**
   * Optimize image before upload
   */
  private static async optimizeImage(file: File, options: ImageUploadOptions): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const maxWidth = options.maxWidth || 1200;
        const maxHeight = options.maxHeight || 1200;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              resolve(file); // Fallback to original
            }
          },
          file.type,
          options.quality || 0.8
        );
      };
      
      img.onerror = () => resolve(file); // Fallback to original
      img.src = URL.createObjectURL(file);
    });
  }
  
  /**
   * Get user-friendly error message
   */
  private static getErrorMessage(error: any): string {
    if (error.code === 'storage/unauthorized') {
      return 'No upload permission, please login again'; // Will be handled by component
    }
    if (error.code === 'storage/canceled') {
      return 'Upload canceled'; // Will be handled by component
    }
    if (error.code === 'storage/quota-exceeded') {
      return 'Storage quota exceeded'; // Will be handled by component
    }
    if (error.code === 'storage/invalid-format') {
      return 'Unsupported image format'; // Will be handled by component
    }
    if (error.message) {
      return error.message;
    }
    return 'Upload failed, please check your connection and try again'; // Will be handled by component
  }
  
  /**
   * Generate thumbnail URL from full image URL
   * (Firebase Storage doesn't have built-in thumbnails, but we can resize on frontend)
   */
  static getThumbnailUrl(originalUrl: string, size: number = 200): string {
    // For now, return original URL
    // In production, you might want to use Firebase Extensions or Cloud Functions
    // to generate thumbnails automatically
    return originalUrl;
  }
  
  /**
   * Check if image URL is valid
   */
  static async validateImageUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return response.ok && (contentType?.startsWith('image/') ?? false);
    } catch {
      return false;
    }
  }
}

export default ImageService;
