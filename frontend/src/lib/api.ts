import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface CreateUserRequest {
  firebaseUid: string;
  email: string;
  phone: string;
  userType: 'CAREGIVER' | 'PARENT' | 'ADMIN';
}

export interface UserDto {
  id: number;
  firebaseUid: string;
  email: string;
  phone: string;
  userType: 'CAREGIVER' | 'PARENT' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
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
}

export const apiService = new ApiService();
