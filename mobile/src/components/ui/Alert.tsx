/**
 * Cross-Platform Clinical Alert & Safety Banner Component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface AlertProps {
  title?: string;
  message: string;
  variant?: 'info' | 'warning' | 'emergency';
  style?: ViewStyle;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  style,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'emergency':
        return {
          bg: colors.emergencyBg,
          border: colors.emergencyBorder,
          titleText: colors.emergency,
          bodyText: '#7f1d1d',
        };
      case 'warning':
        return {
          bg: colors.warningBg,
          border: colors.warningBorder,
          titleText: colors.warning,
          bodyText: '#78350f',
        };
      default:
        return {
          bg: colors.infoBg,
          border: colors.infoBorder,
          titleText: colors.info,
          bodyText: '#075985',
        };
    }
  };

  const current = getStyles();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: current.bg, borderColor: current.border },
        style,
      ]}
    >
      {title && (
        <Text style={[styles.title, { color: current.titleText }]}>{title}</Text>
      )}
      <Text style={[styles.message, { color: current.bodyText }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginVertical: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
  },
});
