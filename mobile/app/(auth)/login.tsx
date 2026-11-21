/**
 * Sign In Screen
 * Supports Email/Password, Google OAuth, Sign in with Apple, and Anonymous Guest exploration.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/context/AuthContext';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Alert } from '../../src/components/ui/Alert';
import { Card } from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    isLoading,
    error,
    isConfigured,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailSignIn = async () => {
    setLocalError(null);
    clearError();
    if (!email || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }
    const { error: authErr } = await signInWithEmail(email, password);
    if (!authErr) {
      router.replace('/(tabs)');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Header Branding */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>V</Text>
          </View>
          <Text style={styles.brandTitle}>Welcome to VYTAL</Text>
          <Text style={styles.brandSubtitle}>
            Your Health, Decoded. Clinical decisions supported by evidence.
          </Text>
        </View>

        {!isConfigured && (
          <Alert
            variant="info"
            title="Local Security Mode"
            message="Supabase cloud URL is not configured. Accounts and sessions are secured locally on your device via hardware-backed SecureStore. Set EXPO_PUBLIC_SUPABASE_URL to link cloud authentication."
          />
        )}

        {(error || localError) && (
          <Alert
            variant="warning"
            title="Authentication Notice"
            message={error || localError || ''}
          />
        )}

        {/* Credentials Form */}
        <Card style={styles.formCard}>
          <Input
            label="Email Address"
            placeholder="patient@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <View style={styles.forgotWrapper}>
            <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          <Button
            title="Sign In with Email"
            onPress={handleEmailSignIn}
            loading={isLoading}
            style={styles.signInBtn}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social OAuth Providers */}
          <Button
            title="Continue with Google"
            onPress={signInWithGoogle}
            variant="outline"
            style={styles.socialBtn}
          />

          {(Platform.OS === 'ios' || Platform.OS === 'web') && (
            <Button
              title="Sign in with Apple"
              onPress={signInWithApple}
              variant="secondary"
              style={styles.socialBtn}
            />
          )}
        </Card>

        {/* Footer: Register Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </Pressable>
        </View>

        {/* Safety Disclaimer */}
        <Text style={styles.safetyFooter}>
          {t('safety.banner')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  formCard: {
    marginTop: 8,
  },
  forgotWrapper: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  forgotText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  signInBtn: {
    marginTop: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: colors.textMuted,
    marginHorizontal: 10,
    textTransform: 'uppercase',
  },
  socialBtn: {
    marginBottom: 10,
  },
  guestBtn: {
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  safetyFooter: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 14,
  },
});
