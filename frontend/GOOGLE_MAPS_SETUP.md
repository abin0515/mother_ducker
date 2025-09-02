# Google Maps Setup Guide 🗺️

## 🔑 API Key Setup

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Geocoding API**
   - **Places API** (optional, for future address autocomplete)

### 2. Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Copy the generated API key

### 3. Restrict API Key (Security)
1. Click on your API key to edit
2. Under **API restrictions**, select **Restrict key**
3. Choose the APIs you enabled above
4. Under **Application restrictions**, add your domain:
   - `localhost:3000` (for development)
   - `your-domain.com` (for production)

### 4. Add to Environment Variables
Create or update your `.env.local` file in the frontend directory:

```bash
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

⚠️ **Important**: The `NEXT_PUBLIC_` prefix makes this available to the browser.

## 🧪 Testing the Map Component

### 1. Start the Development Server
```bash
cd frontend
pnpm dev
```

### 2. Test Location Features
1. Navigate to `/profile` page
2. Click **Edit** button in the "当前位置" (Current Location) section
3. Try these features:
   - **📍 获取当前位置** - Browser geolocation
   - **🖱️ Click on map** - Set location by clicking
   - **🔄 Drag marker** - Adjust position by dragging

### 3. Expected Data Format
The location is stored as: `"address|latitude,longitude"`

Example: `"北京市朝阳区建国门外大街1号|39.9042,116.4074"`

## 🌍 Features Implemented

### 🎯 Core Features:
- ✅ **Interactive Google Maps** with draggable marker
- ✅ **Browser Geolocation** - "Get Current Location" button
- ✅ **Reverse Geocoding** - Converts coordinates to address
- ✅ **Read-only Display** - Shows location on profile page
- ✅ **Bilingual Support** - Chinese and English interface

### 🧓 Elderly-Friendly Design:
- ✅ **Large buttons** - Easy to tap on mobile
- ✅ **Clear instructions** - Step-by-step guidance
- ✅ **Visual feedback** - Loading states and confirmations
- ✅ **Error handling** - Graceful fallbacks

### 📱 Mobile Optimized:
- ✅ **Touch gestures** - Tap and drag on mobile
- ✅ **Responsive layout** - Works on all screen sizes
- ✅ **Permission handling** - Browser location permissions

## 🔧 Troubleshooting

### Map Not Loading?
1. Check if API key is set in `.env.local`
2. Verify APIs are enabled in Google Cloud Console
3. Check browser console for errors

### Geolocation Not Working?
1. Ensure HTTPS (required for geolocation)
2. Check browser permissions
3. Try on different browsers

### API Quota Exceeded?
1. Check usage in Google Cloud Console
2. Consider upgrading to paid plan
3. Implement usage limits in code

## 💰 Cost Estimation

### Google Maps Pricing (as of 2024):
- **Maps JavaScript API**: $7 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests
- **Free tier**: $200 credit per month

### Expected Usage:
- **Map loads**: ~1 per profile edit session
- **Geocoding**: ~1 per location update
- **Monthly estimate**: <$50 for 1,000 active users

## 🚀 Next Steps

1. **Distance Calculation**: Add function to calculate distance between 月嫂 and parents
2. **Location Search**: Implement address autocomplete
3. **Service Areas**: Add service radius around current location
4. **Privacy Settings**: Let users control location visibility
