import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  style?: any;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true,
  style 
}) => {
  const sizeMap = {
    small: { icon: 40, text: 18 },
    medium: { icon: 80, text: 24 },
    large: { icon: 200, text: 60 },
  };

  const dimensions = sizeMap[size];

  // Try to load the logo image, fallback to a placeholder if not found
  let logoSource: ImageSourcePropType;
  try {
    logoSource = require('../../assets/logo.png');
  } catch {
    // Fallback - you can replace this with your actual logo path
    logoSource = require('../../assets/icon.png');
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={logoSource}
        style={[
          styles.logoImage,
          { width: dimensions.icon, height: dimensions.icon },
        ]}
        resizeMode="contain"
      />
      {showText && (
        <Text
          style={[
            styles.logoText,
            { fontSize: dimensions.text },
          ]}
        >
          CardScout
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    marginBottom: 8,
  },
  logoText: {
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
});

