import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { colors, fonts } from '@/constants/app-theme';

export function ScreenHeader({ title }: { title: string }) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.back()}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <Text style={styles.backText}>←</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#efe9e0',
    borderWidth: 1,
    borderColor: '#d8d1c8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  backText: { fontSize: 24, color: colors.text, lineHeight: 28 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, fontFamily: fonts.heading },
});
