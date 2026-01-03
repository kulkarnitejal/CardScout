import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../utils/constants';
// @ts-ignore - @expo/vector-icons is available in Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Tab {
  name: string;
  label: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface BottomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

        const tabs: Tab[] = [
          { name: 'Benefits', label: 'Deals', iconName: 'gift-outline' },
          { name: 'ConnectBank', label: 'Transactions', iconName: 'wallet-outline' },
        ];

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const tab = tabs.find((t) => t.name === route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <MaterialCommunityIcons
              name={tab?.iconName || 'circle'}
              size={24}
              color={isFocused ? COLORS.primary : COLORS.textSecondary}
              style={styles.icon}
            />
            <Text
              style={[
                styles.label,
                isFocused && styles.labelFocused,
              ]}
            >
              {tab?.label || label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  labelFocused: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

