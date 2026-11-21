/**
 * Healthcare Modules Directory Screen
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Alert } from '../../src/components/ui/Alert';
import { colors } from '../../src/theme/colors';

export default function ModulesDirectoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const moduleList = [
    {
      id: '01',
      title: '01 — LabLens',
      subtitle: 'Understand your reports.',
      purpose: 'Laboratory report interpretation.',
      route: '/modules/report-explainer',
      desc: 'Extract and review laboratory test values with laboratory reference intervals and plain-language explanation.',
      features: ['PDF Document Upload', 'Manual Observation Entry', 'Verified Reference Ranges', 'Multilingual Glossary'],
    },
    {
      id: '02',
      title: '02 — RiskPulse',
      subtitle: 'Know your health risk factors.',
      purpose: 'Indian Diabetes Risk Score (IDRS).',
      route: '/modules/risk-score',
      desc: 'Transparent 4-factor scoring model published by Dr. V. Mohan et al. (JAPI 2005) for South Asian adults.',
      features: ['Age Stratification', 'Waist Circumference Thresholds', 'Physical Activity Tiers', 'Family History Weighting'],
    },
    {
      id: '03',
      title: '03 — SymptomSense',
      subtitle: 'Understand symptoms and warning signs.',
      purpose: 'Explainable, rule-based symptom triage.',
      route: '/modules/symptom-triage',
      desc: 'Audited clinical protocols prioritizing emergency red flags (AHA/ACC, FAST stroke, DKA) before routine care.',
      features: ['Immediate Red-Flag Override', '108/112 Ambulance Alert', 'Source Rule Citations', 'Missing Data Non-Assumption'],
    },
    {
      id: '04',
      title: '04 — MedWise',
      subtitle: 'Explore medication interactions.',
      purpose: 'Evidence-based medication interaction information.',
      route: '/modules/medication-check',
      desc: 'RxNorm concept normalization and pairwise interaction safety reviews with mandatory negative finding disclaimers.',
      features: ['Generic & Brand Normalization', 'ACR & FDA Literature Evidence', 'Negative Finding Disclaimer', 'Non-Interference Invariant'],
    },
    {
      id: '05',
      title: '05 — Vytal360',
      subtitle: 'Your complete health overview.',
      purpose: 'Integrated health summary.',
      route: '/modules/health-summary',
      desc: 'Synthesizes findings across Modules 01 through 04 with cross-module observations and downloadable vector PDF.',
      features: ['Cross-Module Synthesis', 'Chronological Timestamping', 'Downloadable Vector PDF', 'Native Mobile Sharing'],
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Alert
          variant="info"
          title="Sequential Evaluation Architecture"
          message="VYTAL evaluates healthcare information across these five modules in strict sequence to ensure comprehensive, contextual decision support."
        />

        {moduleList.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => router.push(m.route as any)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{m.title}</Text>
                <Text style={styles.cardSubtitle}>{m.subtitle}</Text>
              </View>
              <Badge label={`Step ${m.id}`} variant="normal" />
            </View>
            <Text style={styles.desc}>{m.desc}</Text>
            <View style={styles.featureGrid}>
              {m.features.map((feat, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>
            <View style={styles.openBtnRow}>
              <Text style={styles.openBtnText}>Launch Module →</Text>
            </View>
          </Pressable>
        ))}
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
  card: {
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
  pressed: {
    backgroundColor: colors.surfaceSubtle,
    transform: [{ scale: 0.995 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  desc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSubtle,
    paddingTop: 10,
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    gap: 4,
  },
  bullet: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  openBtnRow: {
    alignItems: 'flex-end',
  },
  openBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
