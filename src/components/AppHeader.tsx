import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Logo } from './Logo';
import { COLORS, FONTS } from '../utils/constants';
// @ts-ignore - @expo/vector-icons is available in Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AppHeaderProps {
  title?: string;
  onMenuPress?: () => void;
  showLogo?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onMenuPress,
  showLogo = true,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onMenuPress}
        style={styles.menuButton}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.centerContent}>
        {showLogo ? (
          <Logo size="small" showText={false} style={styles.logo} />
        ) : (
          title && <Text style={styles.title}>{title}</Text>
        )}
      </View>
      
      <View style={styles.menuButtonPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    padding: 2,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 8,
    marginLeft: 4,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  menuButtonPlaceholder: {
    width: 50,
  },
});

