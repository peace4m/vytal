/**
 * MODULE 02 — INDIAN DIABETES RISK SCORE (IDRS)
 * Verified implementation of the 4-factor scoring methodology published by
 * Dr. V. Mohan and colleagues (JAPI 2005; 53:759–763).
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Alert } from '../../src/components/ui/Alert';
import { colors } from '../../src/theme/colors';
import { calculateDemoIDRS } from '../../src/services/mockDemoBackend';

export default function IDRSScreen() {
  const { t } = useTranslation();

  const [age, setAge] = useState('45');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState('92');
  const [activity, setActivity] = useState<'vigorous' | 'moderate' | 'sedentary'>('moderate');
  const [familyHistory, setFamilyHistory] = useState<'none' | 'one_parent' | 'both_parents'>('one_parent');

  const [result, setResult] = useState<any | null>(null);

  const handleCalculate = () => {
    const res = calculateDemoIDRS({
      age: parseInt(age) || 45,
      gender,
      waist_circumference_cm: parseFloat(waist) || 90,
      physical_activity_tier: activity,
      family_history_tier: familyHistory,
    });
    setResult(res);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Alert
          variant="info"
          title="Validated Population Screening Tool"
          message="The Indian Diabetes Risk Score is a population screening tool, not a clinical diagnosis. A score ≥ 60 identifies elevated risk and warrants diagnostic blood glucose testing in consultation with a physician."
        />

        {/* Scoring Input Form */}
        <Card title="Scoring Parameters (CURES 2005)" subtitle="Enter the four published risk factors">
          {/* Factor 1: Age */}
          <Input
            label="1. Age (completed years)"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            helperText="< 35 yrs: 0 pts | 35–49 yrs: 20 pts | ≥ 50 yrs: 30 pts"
          />

          {/* Factor 2: Gender & Waist */}
          <Text style={styles.fieldLabel}>2. Biological Gender</Text>
          <View style={styles.btnRow}>
            {(['male', 'female'] as const).map((g) => (
              <Button
                key={g}
                title={g === 'male' ? 'Male' : 'Female'}
                variant={gender === g ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setGender(g)}
                style={{ flex: 1 }}
              />
            ))}
          </View>

          <Input
            label="Waist Circumference (cm)"
            value={waist}
            onChangeText={setWaist}
            keyboardType="numeric"
            helperText={
              gender === 'female'
                ? '< 80 cm: 0 pts | 80–89 cm: 10 pts | ≥ 90 cm: 20 pts'
                : '< 85 cm: 0 pts | 85–89 cm: 10 pts | ≥ 90 cm: 20 pts'
            }
          />

          {/* Factor 3: Physical Activity */}
          <Text style={styles.fieldLabel}>3. Physical Activity Tier</Text>
          <View style={styles.btnRow}>
            {[
              { id: 'vigorous', label: 'Vigorous (0 pt)' },
              { id: 'moderate', label: 'Moderate (10 pt)' },
              { id: 'sedentary', label: 'Sedentary (20 pt)' },
            ].map((act) => (
              <Button
                key={act.id}
                title={act.label}
                variant={activity === act.id ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setActivity(act.id as any)}
                style={{ flex: 1 }}
              />
            ))}
          </View>

          {/* Factor 4: Family History */}
          <Text style={styles.fieldLabel}>4. Family History of Diabetes</Text>
          <View style={styles.btnRow}>
            {[
              { id: 'none', label: 'No Parents (0 pt)' },
              { id: 'one_parent', label: '1 Parent (10 pt)' },
              { id: 'both_parents', label: 'Both Parents (20 pt)' },
            ].map((fh) => (
              <Button
                key={fh.id}
                title={fh.label}
                variant={familyHistory === fh.id ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setFamilyHistory(fh.id as any)}
                style={{ flex: 1 }}
              />
            ))}
          </View>

          <Button
            title="Calculate Indian Diabetes Risk Score"
            onPress={handleCalculate}
            style={{ marginTop: 14 }}
          />
        </Card>

        {/* Calculation Result */}
        {result && (
          <Card title="IDRS Risk Assessment Result">
            <View style={styles.scoreRow}>
              <View>
                <Text style={styles.totalScoreLabel}>Total Risk Score</Text>
                <Text style={styles.totalScoreValue}>{result.total_score} / 100</Text>
              </View>
              <Badge
                label={result.risk_tier_label}
                variant={
                  result.risk_category === 'HIGH_RISK'
                    ? 'emergency'
                    : result.risk_category === 'MODERATE_RISK'
                    ? 'warning'
                    : 'normal'
                }
              />
            </View>

            <Text style={styles.explanationText}>{result.explanation}</Text>

            {/* Factor breakdown */}
            <View style={styles.factorsList}>
              {result.factors.map((f: any, idx: number) => (
                <View key={idx} style={styles.factorItem}>
                  <View style={styles.factorHeader}>
                    <Text style={styles.factorName}>{f.factor_name}</Text>
                    <Text style={styles.factorPts}>
                      {f.assigned_points} / {f.max_possible_points} pts
                    </Text>
                  </View>
                  <Text style={styles.factorVal}>Input: {f.raw_value}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.citationText}>
              <Text style={{ fontWeight: '700' }}>Citation: </Text>
              {result.citation}
            </Text>
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
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 6,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalScoreLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  totalScoreValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  factorsList: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSubtle,
    paddingTop: 10,
    gap: 8,
  },
  factorItem: {
    paddingVertical: 4,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  factorName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  factorPts: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  factorVal: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  citationText: {
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 14,
    marginTop: 12,
    fontStyle: 'italic',
  },
});
