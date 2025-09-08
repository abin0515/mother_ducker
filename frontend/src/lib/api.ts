import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface CreateUserRequest {
  firebaseUid: string;
  email: string;
  phone: string;
  userType: 'CAREGIVER' | 'PARENT' | 'ADMIN';
}

export interface UserDto {
  // Core Identity
  id: number;
  createdAt: string;
  updatedAt: string;
  firebaseUid: string;
  email: string;
  userType: 'CAREGIVER' | 'PARENT' | 'ADMIN';

  // Basic Information
  fullName?: string;
  displayName?: string;
  age?: number;
  profilePhotoUrl?: string;

  // Contact Information
  primaryPhone?: string;
  wechatId?: string;
  wechatQrCodeUrl?: string;
  xiaohongshuHandle?: string;

  // Location & Service
  city?: string;
  province?: string;
  country?: string;
  serviceAreas?: string;
  currentLocation?: string;
  willingToRelocate?: boolean;

  // Professional Information
  yearsOfExperience?: number;
  languages?: string;
  specializations?: string;
  certifications?: string;
  servicesOffered?: string;
  hourlyRate?: number;

  // Rich Content
  aboutMe?: string;
  professionalExperience?: string;
  educationBackground?: string;
  specialSkills?: string;

  // Media
  galleryPhotos?: string;
  certificatesPhotos?: string;

  // Social Proof
  totalRating?: number;
  totalReviews?: number;

  // Platform Management
  profileCompletionPercentage?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  lastActiveAt?: string;
  profileViews?: number;
  verificationStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

class ApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const token = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }


  async createUser(userData: CreateUserRequest): Promise<UserDto> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<UserDto> = await response.json();
    return result.data;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<UserDto> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/users/firebase/${firebaseUid}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<UserDto> = await response.json();
    return result.data;
  }

  async getUserById(id: number): Promise<UserDto> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/users/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<UserDto> = await response.json();
    return result.data;
  }

  async updateProfile(firebaseUid: string, updates: Partial<UserDto>): Promise<UserDto> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/users/firebase/${firebaseUid}/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<UserDto> = await response.json();
    return result.data;
  }

  async updateProfileField(firebaseUid: string, fieldName: string, value: any): Promise<UserDto> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/users/firebase/${firebaseUid}/profile/${fieldName}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ value }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<UserDto> = await response.json();
    return result.data;
  }

  async getProfileCompletion(firebaseUid: string): Promise<{ percentage: number; missingFields: string[] }> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/users/firebase/${firebaseUid}/profile/completion`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<{ percentage: number; missingFields: string[] }> = await response.json();
    return result.data;
  }

  // Generic GET method for any endpoint
  async get<T>(path: string, opts?: { requireAuth?: boolean; throwOnError?: boolean }): Promise<T> {
    const requireAuth = opts?.requireAuth !== undefined ? opts.requireAuth : true;
    const throwOnError = opts?.throwOnError !== undefined ? opts.throwOnError : true;

    let headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (requireAuth) {
      headers = await this.getAuthHeaders();
    }

    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (throwOnError) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      // return undefined as any to satisfy generic without throwing; caller should handle
      return undefined as any as T;
    }

    const result: ApiResponse<T> = await response.json();
    return result.data;
  }
}

export const apiService = new ApiService();
