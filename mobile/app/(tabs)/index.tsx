/**
 * Cross-Platform Main Dashboard
 */

import React from 'react';
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
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Alert } from '../../src/components/ui/Alert';
import { Button } from '../../src/components/ui/Button';
import { colors } from '../../src/theme/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const modules = [
    {
      id: '01',
      title: t('modules.reportExplainer.title'),
      desc: t('modules.reportExplainer.description'),
      route: '/modules/report-explainer',
      badge: 'PyMuPDF Parser',
      icon: '📄',
    },
    {
      id: '02',
      title: t('modules.idrs.title'),
      desc: t('modules.idrs.description'),
      route: '/modules/risk-score',
      badge: 'CURES 2005 Math',
      icon: '📊',
    },
    {
      id: '03',
      title: t('modules.triage.title'),
      desc: t('modules.triage.description'),
      route: '/modules/symptom-triage',
      badge: 'Emergency Red-Flag Override',
      icon: '🚨',
    },
    {
      id: '04',
      title: t('modules.medications.title'),
      desc: t('modules.medications.description'),
      route: '/modules/medication-check',
      badge: 'RxNorm & ACR Evidence',
      icon: '💊',
    },
    {
      id: '05',
      title: t('modules.summary.title'),
      desc: t('modules.summary.description'),
      route: '/modules/health-summary',
      badge: 'PDF Export & Share',
      icon: '📋',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Welcome & Session Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeText}>
              {isAuthenticated ? `Welcome, ${user?.email?.split('@')[0]}` : 'Welcome, Guest Patient'}
            </Text>
            <Text style={styles.tagline}>{t('brand.tagline')}</Text>
          </View>
          <Badge
            label={isAuthenticated ? 'Cloud Authenticated' : 'Anonymous Mode'}
            variant={isAuthenticated ? 'info' : 'normal'}
          />
        </View>

        {/* Mandatory Clinical Safety Invariant Banner */}
        <Alert
          variant="warning"
          title="Educational Prototype — NOT A MEDICAL DEVICE"
          message={t('safety.banner')}
        />

        <Alert
          variant="emergency"
          title="Emergency Protocol (108 / 112)"
          message={t('safety.emergencyCall')}
        />

        {/* Modules Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>The Five Healthcare Modules</Text>
          <Text style={styles.sectionSubtitle}>
            Evaluated in strict sequential order from lab review to consolidated brief.
          </Text>
        </View>

        {/* 5 Module Cards */}
        {modules.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => router.push(m.route as any)}
            style={({ pressed }) => [styles.moduleCard, pressed && styles.cardPressed]}
          >
            <View style={styles.moduleHeader}>
              <View style={styles.iconCircle}>
                <Text style={styles.moduleIcon}>{m.icon}</Text>
              </View>
              <View style={styles.moduleMeta}>
                <View style={styles.titleRow}>
                  <Text style={styles.moduleIndex}>MODULE {m.id}</Text>
                  <Badge label={m.badge} variant="normal" />
                </View>
                <Text style={styles.moduleName}>{m.title}</Text>
              </View>
            </View>
            <Text style={styles.moduleDesc}>{m.desc}</Text>
            <View style={styles.actionRow}>
              <Text style={styles.actionLink}>Open Module →</Text>
            </View>
          </Pressable>
        ))}

        {/* ML Research Subsystem Callout */}
        <Card style={styles.researchCard}>
          <View style={styles.researchHeader}>
            <Text style={styles.researchIcon}>🔬</Text>
            <View style={{ flex: 1 }}>
              <Badge label="Independent ML Research" variant="info" />
              <Text style={styles.researchTitle}>Early-Stage Diabetes Prediction Benchmarks</Text>
              <Text style={styles.researchDesc}>
                Explore 4 machine learning models (GBDT, Random Forest, SVC, Logistic Regression) evaluated on the Sylhet South Asian diabetes cohort with Stratified 5-Fold Cross-Validation.
              </Text>
            </View>
          </View>
          <Button
            title="Open ML Research Lab"
            onPress={() => router.push('/(tabs)/research')}
            variant="outline"
            style={{ marginTop: 12 }}
          />
        </Card>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tagline: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  moduleCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardPressed: {
    backgroundColor: colors.surfaceSubtle,
    transform: [{ scale: 0.995 }],
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleIcon: {
    fontSize: 22,
  },
  moduleMeta: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  moduleIndex: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  moduleName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  moduleDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionRow: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  actionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  researchCard: {
    backgroundColor: colors.accentBg,
    borderColor: '#a7f3d0',
    marginTop: 8,
  },
  researchHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  researchIcon: {
    fontSize: 26,
  },
  researchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065f46',
    marginTop: 4,
  },
  researchDesc: {
    fontSize: 11,
    color: '#047857',
    lineHeight: 16,
    marginTop: 2,
  },
});
