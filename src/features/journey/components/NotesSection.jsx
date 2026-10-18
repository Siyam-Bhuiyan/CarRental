import React from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { AppText, SectionHeader } from '@/components/ui';

export default function NotesSection({ notes }) {
  return (
    <>
      <SectionHeader title="ADDITIONAL NOTES (OPTIONAL)" />
      <AppText variant="body" color={colors.textSecondary} style={styles.notes}>
        {notes}
      </AppText>
    </>
  );
}

const styles = StyleSheet.create({
  notes: { marginTop: 7 },
});
