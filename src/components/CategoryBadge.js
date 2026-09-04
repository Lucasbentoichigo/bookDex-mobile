import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../constants/colors';
import { getCategoryById, getStatusByValue } from '../services/categoryService';

export default function CategoryBadge({ category, status, size = 'medium' }) {
  const categoryData = getCategoryById(category);
  const statusData = getStatusByValue(status);
  
  const data = status ? statusData : categoryData;
  const label = status ? statusData?.label : category;
  const backgroundColor = data?.color || colors.textLight;

  const sizes = {
    small: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 10 },
    medium: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 },
    large: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
  };

  const currentSize = sizes[size];

  return (
    <View 
      style={[
        styles.badge, 
        { backgroundColor, ...currentSize }
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});