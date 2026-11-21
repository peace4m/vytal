/**
 * MODULE 03 — SYMPTOM TRIAGE & RED FLAGS
 * Deterministic clinical rules with immediate emergency red-flag override.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Alert } from '../../src/components/ui/Alert';
import { colors } from '../../src/theme/colors';
import { evaluateDemoTriage } from '../../src/services/mockDemoBackend';

export default function SymptomTriageScreen() {
  const { t } = useTranslation();

  const symptomOptions = [
    { key: 'chest_pain', label: 'Acute Crushing Chest Pain' },
    { key: 'sudden_weakness', label: 'Sudden Weakness / Facial Droop' },
    { key: 'slurred_speech', label: 'Slurred Speech / Confusion' },
    { key: 'polyuria', label: 'Frequent Urination (Polyuria)' },
    { key: 'polydipsia', label: 'Excessive Thirst (Polydipsia)' },
    { key: 'fatigue', label: 'Generalized Fatigue' },
    { key: 'mild_headache', label: 'Mild Headache' },
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [triageResult, setTriageResult] = useState<any | null>(null);

  const toggleSymptom = (key: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleEvaluate = () => {
    const res = evaluateDemoTriage(selectedSymptoms);
    setTriageResult(res);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Alert
          variant="emergency"
          title="Emergency Protocol"
          message="If you or someone around you is experiencing sudden chest pain, breathing difficulty, or signs of stroke, call 108, 112, or local emergency services immediately."
        />

        {/* Symptoms Selection */}
        <Card title="Select Current Symptoms" subtitle="Choose all symptoms currently being experienced">
          <View style={styles.symptomsGrid}>
            {symptomOptions.map((item) => {
              const isSelected = selectedSymptoms.includes(item.key);
              return (
                <Button
                  key={item.key}
                  title={item.label}
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => toggleSymptom(item.key)}
                  style={{ marginBottom: 6 }}
                />
              );
            })}
          </View>

          <Button
            title="Evaluate Symptom Rules"
            onPress={handleEvaluate}
            style={{ marginTop: 12 }}
          />
        </Card>

        {/* Triage Result */}
        {triageResult && (
          <Card title="Clinical Triage Assessment">
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.acuityLabel}>Acuity Level</Text>
                <Text style={styles.acuityTitle}>{triageResult.triage_level}</Text>
              </View>
              <Badge
                label={triageResult.acuity}
                variant={triageResult.emergency_red_flag_triggered ? 'emergency' : 'normal'}
              />
            </View>

            {triageResult.emergency_callout && (
              <Alert
                variant="emergency"
                title="IMMEDIATE EMERGENCY ACTION REQUIRED"
                message={triageResult.emergency_callout}
              />
            )}

            {/* Triggered Rules Breakdown */}
            <View style={styles.rulesSection}>
              <Text style={styles.rulesTitle}>Triggered Clinical Protocols:</Text>
              {triageResult.triggered_rules.map((rule: any, idx: number) => (
                <View key={idx} style={styles.ruleCard}>
                  <View style={styles.ruleHeader}>
                    <Text style={styles.ruleName}>{rule.rule_name}</Text>
                    <Badge label={rule.severity} variant={rule.severity === 'EMERGENCY' ? 'emergency' : 'normal'} />
                  </View>
                  <Text style={styles.ruleRationale}>{rule.clinical_rationale}</Text>
                  <Text style={styles.ruleAction}>
                    <Text style={{ fontWeight: '700' }}>Action: </Text>
                    {rule.recommended_action}
                  </Text>
                  <Text style={styles.ruleSource}>
                    <Text style={{ fontWeight: '700' }}>Source: </Text>
                    {rule.evidence_source}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.nextStepsBox}>
              <Text style={styles.nextStepsLabel}>Next Steps:</Text>
              <Text style={styles.nextStepsText}>{triageResult.next_steps}</Text>
            </View>
          </Card>
        )}
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
  symptomsGrid: {
    gap: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  acuityLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  acuityTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  rulesSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSubtle,
    paddingTop: 10,
    gap: 8,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ruleCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ruleName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ruleRationale: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ruleAction: {
    fontSize: 11,
    color: colors.primaryDark,
    marginBottom: 2,
  },
  ruleSource: {
    fontSize: 10,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  nextStepsBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.primaryBg,
  },
  nextStepsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  nextStepsText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
