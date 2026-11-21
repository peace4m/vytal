/**
 * Machine Learning Research Lab Screen
 * Independent research subsystem displaying Stratified 5-Fold Cross-Validation benchmarks,
 * XAI feature attributions, and Mitchell et al. Model Card evaluation.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Alert } from '../../src/components/ui/Alert';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { colors } from '../../src/theme/colors';
import { getDemoResearchOverview, getDemoFeatureImportance, predictDemoResearch } from '../../src/services/mockDemoBackend';

export default function ResearchLabScreen() {
  const overview = getDemoResearchOverview();
  const importance = getDemoFeatureImportance();

  // Inference state
  const [age, setAge] = useState('45');
  const [polyuria, setPolyuria] = useState<'Yes' | 'No'>('No');
  const [polydipsia, setPolydipsia] = useState<'Yes' | 'No'>('No');
  const [weightLoss, setWeightLoss] = useState<'Yes' | 'No'>('No');
  const [prediction, setPrediction] = useState<any | null>(null);

  const handlePredict = () => {
    const res = predictDemoResearch({
      Age: parseInt(age) || 45,
      Gender: 'Male',
      Polyuria: polyuria,
      Polydipsia: polydipsia,
      sudden_weight_loss: weightLoss,
    });
    setPrediction(res);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Research Segregation Alert */}
        <Alert
          variant="warning"
          title="Independent ML Research Invariant"
          message={overview.safety_notice}
        />

        {/* Dataset Meta */}
        <Card title="Sylhet Cohort Benchmark (UCI 529)">
          <Text style={styles.metaText}>
            <Text style={styles.bold}>Cohort Size: </Text>{overview.primary_cohort_size} patient records
          </Text>
          <Text style={styles.metaText}>
            <Text style={styles.bold}>Population: </Text>{overview.population}
          </Text>
          <Text style={styles.metaText}>
            <Text style={styles.bold}>Methodology: </Text>Stratified 5-Fold Cross-Validation
          </Text>
        </Card>

        {/* 4 Models Benchmark Table */}
        <Card title="Algorithm Performance Comparison" subtitle="5-Fold Cross-Validation Metrics">
          {overview.models.map((m, idx) => (
            <View key={idx} style={styles.modelRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modelName}>{m.algorithm}</Text>
                <Text style={styles.modelMetrics}>
                  Sens: {(m.sensitivity * 100).toFixed(1)}% | Spec: {(m.specificity * 100).toFixed(1)}% | F1: {(m.f1_score * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreText}>{(m.auc_roc * 100).toFixed(1)}%</Text>
                <Text style={styles.scoreLabel}>AUC-ROC</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* XAI Feature Importance Ranking */}
        <Card title="Explainable AI (XAI) Feature Rankings" subtitle={importance.methodology}>
          {importance.rankings.slice(0, 5).map((f) => (
            <View key={f.rank} style={styles.rankRow}>
              <Text style={styles.rankNumber}>#{f.rank}</Text>
              <View style={{ flex: 1, marginHorizontal: 8 }}>
                <Text style={styles.featureName}>{f.feature_name}</Text>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: `${f.importance_score * 300}%` }]} />
                </View>
              </View>
              <Text style={styles.importanceScore}>{(f.importance_score * 100).toFixed(1)}%</Text>
            </View>
          ))}
        </Card>

        {/* Interactive Model Inference */}
        <Card title="Interactive ML Inference Experiment" subtitle="Exploratory research probability estimate">
          <Input
            label="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />

          <Text style={styles.fieldLabel}>Polyuria (Excessive Urination)</Text>
          <View style={styles.chipRow}>
            {(['No', 'Yes'] as const).map((opt) => (
              <Button
                key={opt}
                title={opt}
                variant={polyuria === opt ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setPolyuria(opt)}
                style={{ flex: 1 }}
              />
            ))}
          </View>

          <Text style={styles.fieldLabel}>Polydipsia (Excessive Thirst)</Text>
          <View style={styles.chipRow}>
            {(['No', 'Yes'] as const).map((opt) => (
              <Button
                key={opt}
                title={opt}
                variant={polydipsia === opt ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setPolydipsia(opt)}
                style={{ flex: 1 }}
              />
            ))}
          </View>

          <Text style={styles.fieldLabel}>Sudden Weight Loss</Text>
          <View style={styles.chipRow}>
            {(['No', 'Yes'] as const).map((opt) => (
              <Button
                key={opt}
                title={opt}
                variant={weightLoss === opt ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setWeightLoss(opt)}
                style={{ flex: 1 }}
              />
            ))}
          </View>

          <Button
            title="Run Experimental Inference"
            onPress={handlePredict}
            style={{ marginTop: 12 }}
          />

          {prediction && (
            <View style={styles.resultBox}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Predicted Research Probability</Text>
                <Badge
                  label={prediction.predicted_risk_tier.replace(/_/g, ' ')}
                  variant={prediction.predicted_probability >= 0.7 ? 'emergency' : 'warning'}
                />
              </View>
              <Text style={styles.probText}>
                {(prediction.predicted_probability * 100).toFixed(1)}%
              </Text>
              <Text style={styles.disclaimerText}>{prediction.experimental_disclaimer}</Text>
            </View>
          )}
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
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSubtle,
  },
  modelName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modelMetrics: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  scoreBox: {
    backgroundColor: colors.primaryBg,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    minWidth: 64,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
    width: 24,
  },
  featureName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  barBackground: {
    height: 6,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  importanceScore: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 44,
    textAlign: 'right',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  resultBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  probText: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  disclaimerText: {
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 14,
    marginTop: 4,
  },
});
