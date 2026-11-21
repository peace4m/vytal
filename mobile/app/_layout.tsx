/**
 * VYTAL Mobile & Web Root Layout
 * Instantiates cross-platform context providers and root navigation stack.
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

// Multilingual & Auth Contexts
import '../src/i18n/config';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { LanguageSelectorModal } from '../src/components/ui/LanguageSelectorModal';
import { colors } from '../src/theme/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const [langModalVisible, setLangModalVisible] = useState(false);
  const { i18n } = useTranslation();

  const currentLang = (i18n.language ? i18n.language.split('-')[0] : 'en').toUpperCase();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <StatusBar style="auto" />
            <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.surface,
              },
              headerShadowVisible: true,
              headerTintColor: colors.textPrimary,
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 16,
              },
              headerRight: () => (
                <Pressable
                  onPress={() => setLangModalVisible(true)}
                  style={styles.langBtn}
                  accessibilityLabel="Change Language"
                >
                  <Text style={styles.langIcon}>🌐</Text>
                  <Text style={styles.langCode}>{currentLang}</Text>
                </Pressable>
              ),
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="modules/report-explainer"
              options={{
                title: '01 — LabLens',
              }}
            />
            <Stack.Screen
              name="modules/risk-score"
              options={{
                title: '02 — RiskPulse',
              }}
            />
            <Stack.Screen
              name="modules/symptom-triage"
              options={{
                title: '03 — SymptomSense',
              }}
            />
            <Stack.Screen
              name="modules/medication-check"
              options={{
                title: '04 — MedWise',
              }}
            />
            <Stack.Screen
              name="modules/health-summary"
              options={{
                title: '05 — Vytal360',
              }}
            />
          </Stack>

          <LanguageSelectorModal
            visible={langModalVisible}
            onClose={() => setLangModalVisible(false)}
          />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: Platform.OS === 'web' ? 16 : 0,
  },
  langIcon: {
    fontSize: 13,
  },
  langCode: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
