import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/app-theme';

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20 },
  title: { fontSize: 22, fontFamily: fonts.heading, color: colors.text, marginBottom: 6 },
  message: { fontSize: 16, color: colors.textMuted, textAlign: 'center' },
});
