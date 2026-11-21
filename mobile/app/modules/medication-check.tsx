/**
 * MODULE 04 — MEDICATION INTERACTION CHECKER
 * Evaluates pairwise drug interactions against RxNorm and FDA/ACR evidence,
 * featuring explicit negative finding disclaimers and prescription non-interference notices.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Alert } from '../../src/components/ui/Alert';
import { colors } from '../../src/theme/colors';
import { searchDemoMedications, checkDemoInteractions } from '../../src/services/mockDemoBackend';

export default function MedicationCheckScreen() {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<string[]>(['Metformin', 'Iodinated Radiocontrast']);
  const [checkResult, setCheckResult] = useState<any | null>(null);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length >= 2) {
      const results = searchDemoMedications(text);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addMedication = (name: string) => {
    if (!selectedMeds.includes(name)) {
      setSelectedMeds((prev) => [...prev, name]);
    }
    setQuery('');
    setSearchResults([]);
  };

  const removeMedication = (name: string) => {
    setSelectedMeds((prev) => prev.filter((m) => m !== name));
  };

  const handleCheck = () => {
    const res = checkDemoInteractions(selectedMeds);
    setCheckResult(res);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Alert
          variant="warning"
          title="Prescription Non-Interference Invariant"
          message="VYTAL provides drug interaction information for educational awareness. NEVER stop, start, or alter prescribed medication dosages without direct consultation with your prescribing physician."
        />

        {/* Search & Selection */}
        <Card title="Add Medications to Compare" subtitle="Search generic or common brand names">
          <Input
            label="Medication Search"
            placeholder="e.g. Metformin, Lisinopril, Warfarin, Aspirin..."
            value={query}
            onChangeText={handleSearch}
          />

          {searchResults.length > 0 && (
            <View style={styles.suggestList}>
              {searchResults.map((item, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => addMedication(item.name)}
                  style={styles.suggestItem}
                >
                  <Text style={styles.suggestName}>{item.name}</Text>
                  <Text style={styles.suggestBrands}>Brands: {item.brand_examples.join(', ')}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Selected Medication Chips */}
          <View style={styles.chipsRow}>
            {selectedMeds.map((med) => (
              <View key={med} style={styles.chip}>
                <Text style={styles.chipText}>{med}</Text>
                <Pressable onPress={() => removeMedication(med)} style={styles.chipClose}>
                  <Text style={styles.chipCloseText}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>

          <Button
            title={`Check Interactions (${selectedMeds.length} Selected)`}
            onPress={handleCheck}
            disabled={selectedMeds.length < 2}
            style={{ marginTop: 8 }}
          />
        </Card>

        {/* Interaction Results */}
        {checkResult && (
          <Card title="Interaction Safety Review">
            {checkResult.interactions.length === 0 ? (
              <Alert
                variant="info"
                title="No Documented Interaction Found in Dataset"
                message={checkResult.disclaimer}
              />
            ) : (
              <View style={styles.interactionsList}>
                {checkResult.interactions.map((intItem: any, idx: number) => (
                  <View key={idx} style={styles.intCard}>
                    <View style={styles.intHeader}>
                      <Text style={styles.pairTitle}>
                        {intItem.drug_a} + {intItem.drug_b}
                      </Text>
                      <Badge label={intItem.severity} variant="emergency" />
                    </View>
                    <Text style={styles.mechanismText}>
                      <Text style={{ fontWeight: '700' }}>Mechanism: </Text>
                      {intItem.mechanism}
                    </Text>
                    <Text style={styles.recText}>
                      <Text style={{ fontWeight: '700' }}>Management: </Text>
                      {intItem.management_recommendation}
                    </Text>
                    <Text style={styles.sourceText}>
                      <Text style={{ fontWeight: '700' }}>Evidence Source: </Text>
                      {intItem.evidence_source}
                    </Text>
                  </View>
                ))}
                <Text style={styles.disclaimerNote}>{checkResult.disclaimer}</Text>
              </View>
            )}
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
  suggestList: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    overflow: 'hidden',
  },
  suggestItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  suggestBrands: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  chipClose: {
    padding: 2,
  },
  chipCloseText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  interactionsList: {
    gap: 12,
  },
  intCard: {
    backgroundColor: colors.emergencyBg,
    borderColor: colors.emergencyBorder,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  intHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pairTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.emergency,
  },
  mechanismText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
    marginBottom: 4,
  },
  recText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
    marginBottom: 4,
  },
  sourceText: {
    fontSize: 10,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  disclaimerNote: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
    marginTop: 6,
  },
});
