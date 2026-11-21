/**
 * Password Reset & Resend Verification Screen
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
import { useAuth } from '../../src/context/AuthContext';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Alert } from '../../src/components/ui/Alert';
import { Card } from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { sendPasswordReset, resendVerificationEmail, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSendReset = async () => {
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
    if (!email) {
      setLocalError('Please enter your account email address.');
      return;
    }
    const { error: authErr } = await sendPasswordReset(email);
    if (!authErr) {
      setSuccessMessage(`Password recovery instructions dispatched to ${email}.`);
    }
  };

  const handleResendVerification = async () => {
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
    if (!email) {
      setLocalError('Please enter your account email address.');
      return;
    }
    const { error: authErr } = await resendVerificationEmail(email);
    if (!authErr) {
      setSuccessMessage(`A fresh verification link has been sent to ${email}.`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>Account Recovery</Text>
          <Text style={styles.brandSubtitle}>
            Enter your registered email address to receive password reset or email verification instructions.
          </Text>
        </View>

        {(error || localError) && (
          <Alert
            variant="warning"
            title="Notice"
            message={error || localError || ''}
          />
        )}

        {successMessage && (
          <Alert
            variant="info"
            title="Success"
            message={successMessage}
          />
        )}

        <Card style={styles.formCard}>
          <Input
            label="Email Address"
            placeholder="patient@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            title="Send Password Reset Link"
            onPress={handleSendReset}
            loading={isLoading}
            style={styles.actionBtn}
          />

          <Button
            title="Resend Verification Email"
            onPress={handleResendVerification}
            variant="outline"
            style={styles.actionBtn}
          />
        </Card>

        <View style={styles.footerRow}>
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.backLink}>← Return to Sign In</Text>
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
  actionBtn: {
    marginTop: 10,
  },
  footerRow: {
    alignItems: 'center',
    marginTop: 24,
  },
  backLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
