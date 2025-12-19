export const MIN_MONTHLY_SPENDING = 50;
export const MIN_DISCOUNT_THRESHOLD = 5;
export const TOP_RECOMMENDATIONS_COUNT = 10;

export const COLORS = {
  primary: '#172A3A',
  secondary: '#FFD700',
  background: '#f5f5f5',
  surface: '#ffffff',
  error: '#b00020',
  text: '#000000',
  textSecondary: '#757575',
  success: '#307351',
  warning: '#ff9800',
};

// Font family similar to Clash Grotesk (geometric sans-serif)
// Using Inter as it's similar in style - geometric, modern, clean
// For custom Clash Grotesk, you would need to add the font files to assets/fonts
export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
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

