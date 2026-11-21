/**
 * Cross-Platform Clinical Badge Component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'normal' | 'info' | 'warning' | 'high' | 'emergency';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'normal', style }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'emergency':
      case 'high':
        return { bg: colors.emergencyBg, text: colors.emergency, border: colors.emergencyBorder };
      case 'warning':
        return { bg: colors.warningBg, text: colors.warning, border: colors.warningBorder };
      case 'info':
        return { bg: colors.infoBg, text: colors.info, border: colors.infoBorder };
      default:
        return { bg: colors.primaryBg, text: colors.primaryDark, border: colors.primaryBorder };
    }
  };

  const current = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: current.bg, borderColor: current.border },
        style,
      ]}
    >
      <Text style={[styles.text, { color: current.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
