export const MIN_MONTHLY_SPENDING = 50;
export const MIN_DISCOUNT_THRESHOLD = 5;
export const TOP_RECOMMENDATIONS_COUNT = 10;

// API Configuration
import { Platform } from 'react-native';

// Determine the correct backend URL based on platform and environment
const getBackendUrl = (): string => {
  // Check for production API URL from environment variable first
  const productionUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (!__DEV__) {
    // Production builds - use environment variable or fallback
    if (productionUrl && productionUrl !== '' && !productionUrl.includes('your-backend')) {
      return productionUrl;
    }
    // Return empty string if not configured - app should handle gracefully
    console.warn('⚠️ Production API URL not configured. Set EXPO_PUBLIC_API_URL environment variable.');
    return '';
  }

  // Development - use different URLs for different platforms
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:3000/api';
  } else if (Platform.OS === 'ios') {
    // iOS Simulator can use localhost
    return 'http://localhost:3000/api';
  } else {
    // Web or other platforms
    return 'http://localhost:3000/api';
  }
};

// Use the function to get the correct URL
export const API_BASE_URL = getBackendUrl();

// Check if API is configured
export const isApiConfigured = API_BASE_URL !== '' && !API_BASE_URL.includes('your-backend');

// Log the API URL being used (for debugging)
if (__DEV__) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('📱 Platform:', Platform.OS);
  console.log('💡 If you see network errors, check:');
  console.log('   1. Backend server is running on port 3000');
  console.log('   2. Using correct URL for your platform');
  console.log('   3. Device/emulator and computer are on same network');
}

// export const COLORS = {
//   primary: '#B4654A',
//   secondary: '#F4FAF2',
//   background: '#F5F5F5',
//   surface: '#ffffff',
//   error: '#b00020',
//   text: '#000000',
//   textSecondary: '#757575',
//   success: '#648767',
//   warning: '#ff9800',
// };

export const COLORS = {
  primary: '#648767',
  secondary: '#F5F5F5',
  background: '#d1ddd3',
  surface: '#F5F5F5',
  error: '#b00020',
  text: '#000000',
  textSecondary: '#626262',
  success: '#648767',
  warning: '#648767',
};

// Modern, sleek, and highly readable font
// Poppins is a geometric sans-serif typeface that's clean, modern, and easy to read
export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

// Helper function to get font family based on weight
export const getFontFamily = (weight: '400' | '500' | '600' | '700' | 'normal' | 'bold' = '400') => {
  switch (weight) {
    case '400':
    case 'normal':
      return FONTS.regular;
    case '500':
      return FONTS.medium;
    case '600':
      return FONTS.semiBold;
    case '700':
    case 'bold':
      return FONTS.bold;
    default:
      return FONTS.regular;
  }
};

