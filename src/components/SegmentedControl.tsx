import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onSegmentChange: (index: number) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedIndex,
  onSegmentChange,
}) => {
  return (
    <View style={styles.container}>
      {segments.map((segment, index) => {
        const isSelected = index === selectedIndex;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.segment,
              isSelected && styles.segmentSelected,
              index === 0 && styles.segmentFirst,
              index === segments.length - 1 && styles.segmentLast,
            ]}
            onPress={() => onSegmentChange(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                isSelected && styles.segmentTextSelected,
              ]}
            >
              {segment}
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
    backgroundColor: COLORS.surface, // Use surface color for better contrast
    borderRadius: 8,
    padding: 4,
    marginVertical: 0, // Remove vertical margin since parent handles spacing
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  segmentFirst: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  segmentLast: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  segmentSelected: {
    backgroundColor: COLORS.primary, // Terracotta
  },
  segmentText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    color: COLORS.text, // Use primary text color for better visibility
  },
  segmentTextSelected: {
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: '#fff',
  },
});

