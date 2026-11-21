/**
 * Registration Screen
 * Allows users to register with Email & Password, select preferred initial language,
 * and displays email verification guidance.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/context/AuthContext';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Alert } from '../../src/components/ui/Alert';
import { Card } from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';
import { INITIAL_LANGUAGES } from '../../src/i18n/config';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signUpWithEmail, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLang, setPreferredLang] = useState('en');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = async () => {
    setLocalError(null);
    clearError();

    if (!email || !password || !confirmPassword) {
      setLocalError('Please complete all required fields.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const { error: authErr, user } = await signUpWithEmail(email, password, preferredLang);
    if (!authErr) {
      setIsSuccess(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>Create Your Account</Text>
          <Text style={styles.brandSubtitle}>
            Save your laboratory report history, screening scores, and clinical summaries securely.
          </Text>
        </View>

        {(error || localError) && (
          <Alert
            variant="warning"
            title="Registration Notice"
            message={error || localError || ''}
          />
        )}

        {isSuccess ? (
          <Card>
            <Alert
              variant="info"
              title="Verification Email Dispatched"
              message={`We have dispatched a verification link to ${email}. Please check your inbox and verify your email address before signing in.`}
            />
            <Button
              title="Return to Sign In"
              onPress={() => router.replace('/(auth)/login')}
              style={{ marginTop: 16 }}
            />
          </Card>
        ) : (
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
              label="Password (min 8 characters)"
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
              isPassword
            />
            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
            />

            {/* Language Preference on Signup */}
            <View style={styles.langSection}>
              <Text style={styles.langLabel}>Initial Interface Language</Text>
              <View style={styles.langRow}>
                {INITIAL_LANGUAGES.map((lang) => {
                  const isSelected = preferredLang === lang.code;
                  return (
                    <Pressable
                      key={lang.code}
                      onPress={() => setPreferredLang(lang.code)}
                      style={[
                        styles.langChip,
                        isSelected && styles.langChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.langChipText,
                          isSelected && styles.langChipTextSelected,
                        ]}
                      >
                        {lang.nativeLabel}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={isLoading}
              style={styles.submitBtn}
            />
          </Card>
        )}

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </Pressable>
        </View>
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
    marginBottom: 20,
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
  langSection: {
    marginVertical: 12,
  },
  langLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
  },
  langChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  langChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  langChipTextSelected: {
    color: colors.primaryDark,
  },
  submitBtn: {
    marginTop: 10,
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
  signInLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
