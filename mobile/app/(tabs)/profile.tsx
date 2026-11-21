/**
 * User Profile & Settings Screen
 * Manages authentication status, cross-platform language preference synchronization,
 * session termination, and GDPR/data privacy account deletion.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert as RNAlert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/context/AuthContext';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Alert } from '../../src/components/ui/Alert';
import { LanguageSelectorModal } from '../../src/components/ui/LanguageSelectorModal';
import { colors } from '../../src/theme/colors';
import { useAppTheme } from '../../src/context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, userProfile, isAuthenticated, signOut, deleteAccount } = useAuth();
  const { theme, setTheme } = useAppTheme();
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(tabs)');
  };

  const handleDeleteAccount = () => {
    RNAlert.alert(
      'Delete Account & Healthcare Data',
      'Are you sure you want to permanently delete your account and all associated report records? This action cannot be reversed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            await deleteAccount();
            setIsDeleting(false);
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* User Card */}
        <Card>
          <View style={styles.userRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {isAuthenticated ? (user?.email?.[0] || 'U').toUpperCase() : 'G'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <Text style={styles.userName}>
                  {isAuthenticated ? user?.email : 'Anonymous Guest'}
                </Text>
                <Badge
                  label={isAuthenticated ? 'Verified User' : 'Guest Mode'}
                  variant={isAuthenticated ? 'info' : 'normal'}
                />
              </View>
              <Text style={styles.userSub}>
                {isAuthenticated
                  ? `ID: ${user?.id?.slice(0, 8)}...`
                  : 'Data stored locally in temporary anonymous session'}
              </Text>
            </View>
          </View>

          {!isAuthenticated && (
            <View style={styles.authPromptBox}>
              <Text style={styles.authPromptText}>
                Create an account or sign in to sync your report history and risk scores securely across devices.
              </Text>
              <Button
                title="Sign In or Register"
                onPress={() => router.push('/(auth)/login')}
                style={{ marginTop: 10 }}
              />
            </View>
          )}
        </Card>

        {/* Language Preference Section */}
        <Card title="Language & Regional Settings" subtitle="Changes interface language without altering medical calculations">
          <View style={styles.prefRow}>
            <View>
              <Text style={styles.prefLabel}>Active Interface Language</Text>
              <Text style={styles.prefValue}>
                {i18n.language ? i18n.language.toUpperCase() : 'EN'} (English, हिन्दी, ଓଡ଼ିଆ)
              </Text>
            </View>
            <Button
              title="Change Language"
              onPress={() => setLangModalOpen(true)}
              variant="outline"
              size="sm"
            />
          </View>
        </Card>

        {/* Theme & Appearance Section */}
        <Card title="Theme & Appearance" subtitle="Switch between Light, Dark, or System mode">
          <View style={styles.themeSelectorRow}>
            {(
              [
                { id: 'light', label: '☀️ Light' },
                { id: 'dark', label: '🌙 Dark' },
                { id: 'system', label: '📱 System' },
              ] as const
            ).map((item) => (
              <Button
                key={item.id}
                title={item.label}
                variant={theme === item.id ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setTheme(item.id)}
                style={{ flex: 1, marginHorizontal: 3 }}
              />
            ))}
          </View>
        </Card>

        {/* Safety & Compliance Information */}
        <Card title="Regulatory & Safety Framework">
          <Text style={styles.policyText}>
            • <Text style={styles.bold}>Non-Diagnostic Boundary: </Text>
            VYTAL provides educational decision support. It does not provide diagnoses or prescribe medications.
          </Text>
          <Text style={styles.policyText}>
            • <Text style={styles.bold}>Evidence Verification: </Text>
            Every rule, scoring threshold, and drug check links directly to published peer-reviewed clinical literature.
          </Text>
          <Text style={styles.policyText}>
            • <Text style={styles.bold}>Zero Silent Inference: </Text>
            Experimental machine learning algorithms are completely segregated from clinical emergency red flags.
          </Text>
        </Card>

        {/* Account Actions */}
        {isAuthenticated && (
          <Card title="Account Actions">
            <Button
              title="Sign Out"
              onPress={handleSignOut}
              variant="secondary"
              style={{ marginBottom: 8 }}
            />
            <Button
              title="Delete Account & Clear All Data"
              onPress={handleDeleteAccount}
              variant="danger"
              loading={isDeleting}
            />
          </Card>
        )}

        <LanguageSelectorModal
          visible={langModalOpen}
          onClose={() => setLangModalOpen(false)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    backgroundColor: colors.background,
  },
  container: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    gap: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  authPromptBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSubtle,
  },
  authPromptText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  prefLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  prefValue: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  policyText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  bold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
