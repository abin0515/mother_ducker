# Firebase Setup for Gmail Authentication

## Prerequisites
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Google Authentication in your Firebase project

## Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name (e.g., "yuesaohub-platform")
4. Follow the setup wizard

### 2. Enable Authentication Methods
1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab

#### Enable Google Authentication:
4. Click on "Google" provider
5. Enable it and configure:
   - Project support email: your email
   - Project public-facing name: "月嫂Hub"
6. Save the configuration

#### Enable Email/Password Authentication:
7. Click on "Email/Password" provider
8. Enable it and configure:
   - Email link (passwordless sign-in): Optional (disabled for now)
   - Allow users to sign up: Enabled
9. Save the configuration

### 3. Get Firebase Configuration
1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web"
4. Register your app with a nickname (e.g., "yuesaohub-frontend")
5. Copy the configuration object

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZStLLXhlgu85Vf56EBxNErUs3x1UA5Cs",
  authDomain: "yuesaohub.firebaseapp.com",
  projectId: "yuesaohub",
  storageBucket: "yuesaohub.firebasestorage.app",
  messagingSenderId: "396664616947",
  appId: "1:396664616947:web:243922abf3b2983c694486",
  measurementId: "G-7E1K7MH2YH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

### 4. Create Environment File
Create a `.env.local` file in the frontend directory with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here
```

### 5. Test the Setup
1. Start your frontend development server: `npm run dev`
2. Navigate to `/signup` or `/login`

#### Test Google Authentication:
3. Click "Continue with Google"
4. You should see the Google sign-in popup

#### Test Email/Password Authentication:
5. Fill in the email and password fields
6. Click "Create Account" (signup) or "Sign In" (login)
7. You should be redirected to the dashboard on success

## Troubleshooting

### Common Issues:
1. **"Firebase: Error (auth/popup-closed-by-user)"** - User closed the popup
2. **"Firebase: Error (auth/popup-blocked)"** - Browser blocked the popup
3. **"Firebase: Error (auth/unauthorized-domain)"** - Domain not authorized

### Solutions:
1. Make sure your domain is added to authorized domains in Firebase Console
2. For local development, `localhost` should be automatically authorized
3. Check that all environment variables are correctly set
4. Ensure Google Authentication is enabled in Firebase Console

## Next Steps
After successful Gmail authentication:
1. The user will be redirected to `/dashboard`
2. You can access user data from the Firebase Auth result
3. Send user data to your backend API for user creation/verification
4. Implement protected routes and authentication state management
