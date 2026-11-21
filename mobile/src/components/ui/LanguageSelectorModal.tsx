/**
 * Cross-Platform Language Selector Modal
 * Prominently presents initial languages (English, Hindi, Odia) and extended regional languages.
 * Synchronizes with user profile when authenticated and persists across mobile and web.
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import {
  INITIAL_LANGUAGES,
  ALL_SUPPORTED_LANGUAGES,
  savePersistedLanguage,
  LanguageOption,
} from '../../i18n/config';
import { useAuth } from '../../context/AuthContext';

interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const { i18n, t } = useTranslation();
  const { updateUserLanguagePreference, isAuthenticated } = useAuth();
  const [showAll, setShowAll] = useState(false);

  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'en';

  const handleSelectLanguage = async (lang: LanguageOption) => {
    await i18n.changeLanguage(lang.code);
    await savePersistedLanguage(lang.code);
    if (isAuthenticated) {
      await updateUserLanguagePreference(lang.code);
    }
    onClose();
  };

  const languagesToDisplay = showAll ? ALL_SUPPORTED_LANGUAGES : INITIAL_LANGUAGES;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Language / भाषा चुनें</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Changing language updates interface text only. Clinical rules, calculations, and inputs remain preserved.
          </Text>

          <ScrollView style={styles.listContainer}>
            {languagesToDisplay.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => handleSelectLanguage(lang)}
                  style={[
                    styles.langItem,
                    isSelected && styles.langItemSelected,
                  ]}
                >
                  <View>
                    <Text style={[styles.nativeText, isSelected && styles.selectedText]}>
                      {lang.nativeLabel}
                    </Text>
                    <Text style={styles.englishText}>
                      {lang.englishLabel} ({lang.code.toUpperCase()})
                    </Text>
                  </View>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={() => setShowAll((prev) => !prev)}
              style={styles.toggleBtn}
            >
              <Text style={styles.toggleText}>
                {showAll ? 'Show Initial 3 Languages' : 'Show All 19 Languages'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: 12,
  },
  listContainer: {
    maxHeight: 300,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  langItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  nativeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  selectedText: {
    color: colors.primaryDark,
  },
  englishText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  checkMark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  footer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    alignItems: 'center',
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  toggleText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});
