import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { colors, fonts } from '@/constants/app-theme';
import { MenuItem, formatPrice } from '@/lib/menu';

export function MenuCard({ item, onPress }: { item: MenuItem; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
      <View style={styles.textArea}>
        <Text style={styles.course}>{item.course.toUpperCase()}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    marginBottom: 14,
  },
  image: { width: 84, height: 84, borderRadius: 12, backgroundColor: '#d4c2af' },
  textArea: { flex: 1, paddingHorizontal: 12 },
  course: { color: '#b06d53', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  name: { color: colors.text, fontSize: 24, fontWeight: '700', fontFamily: fonts.heading },
  price: { color: colors.text, fontSize: 17, fontWeight: '600' },
  chevron: { fontSize: 30, color: '#7a716b', paddingHorizontal: 8 },
});
