import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { apiService, CreateUserRequest, UserDto } from '@/lib/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [backendUser, setBackendUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Try to get user from backend
          const backendUserData = await apiService.getUserByFirebaseUid(user.uid);
          setBackendUser(backendUserData);
        } catch (error) {
          console.log('User not found in backend, will be created during signup flow');
          setBackendUser(null);
        }
      } else {
        setBackendUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user exists in backend
      try {
        const backendUserData = await apiService.getUserByFirebaseUid(result.user.uid);
        setBackendUser(backendUserData);
      } catch (error) {
        // User doesn't exist in backend, will need to complete profile
        console.log('Google user needs to complete profile');
      }
      
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setBackendUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user exists in backend
      try {
        const backendUserData = await apiService.getUserByFirebaseUid(result.user.uid);
        setBackendUser(backendUserData);
      } catch (error) {
        // User doesn't exist in backend, will need to complete profile
        console.log('Email user needs to complete profile');
      }
      
      return result;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const createBackendUser = async (userData: Omit<CreateUserRequest, 'firebaseUid'>) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      const createUserRequest: CreateUserRequest = {
        ...userData,
        firebaseUid: user.uid,
      };

      const backendUserData = await apiService.createUser(createUserRequest);
      setBackendUser(backendUserData);
      return backendUserData;
    } catch (error) {
      console.error('Error creating backend user:', error);
      throw error;
    }
  };

  return {
    user,
    backendUser,
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    createBackendUser,
    isAuthenticated: !!user,
    isProfileComplete: !!backendUser,
  };
};
