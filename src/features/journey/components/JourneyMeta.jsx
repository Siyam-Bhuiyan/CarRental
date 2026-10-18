import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, PressableScale } from '@/components/ui';

// "Point to Point / Journey Type" on the left, "#ID (copy) / Journey ID" on the right.
export default function JourneyMeta({ type, code }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    await Clipboard.setStringAsync(`#${code}`);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1400);
  };

  return (
    <View style={styles.row}>
      <View style={styles.group}>
        <Icon name="route" />
        <View>
          <AppText variant="subtitle">{type}</AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.caption}>
            Journey Type
          </AppText>
        </View>
      </View>
      <View style={styles.group}>
        <Icon name="tag" />
        <View>
          <View style={styles.idRow}>
            <AppText variant="subtitleSm">#{code}</AppText>
            <PressableScale
              onPress={copy}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Copy journey ID"
              style={styles.copy}
            >
              <Icon name="copy" color={copied ? colors.success : colors.textMuted} />
            </PressableScale>
          </View>
          <AppText variant="caption" color={colors.textMuted} style={styles.caption}>
            {copied ? 'Copied' : 'Journey ID'}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  group: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  caption: { marginTop: 2 },
  idRow: { flexDirection: 'row', alignItems: 'center' },
  // glyph is 10pt wide inside a 16pt box; pull it in so it ends on the right gutter
  copy: { marginLeft: 2, marginRight: -2 },
});
