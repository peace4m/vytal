/**
 * Main Tabs Layout
 * Provides bottom tabs on mobile devices and responsive navigation on desktop web.
 */

import React from 'react';
import { Text, StyleSheet, Platform, View, ActivityIndicator } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { useAuth } from '../../src/context/AuthContext';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerShadowVisible: true,
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 62,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="modules"
        options={{
          title: 'Healthcare Modules',
          tabBarLabel: 'Modules',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🩺</Text>,
        }}
      />
      <Tabs.Screen
        name="research"
        options={{
          title: 'ML Research Lab',
          tabBarLabel: 'Research',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🔬</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile & Settings',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
