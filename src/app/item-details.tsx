import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/menu/app-button';
import { EmptyState } from '@/components/menu/empty-state';
import { ScreenHeader } from '@/components/menu/screen-header';
import { colors, fonts } from '@/constants/app-theme';
import { MenuItem, formatPrice, loadMenuItems, persistMenuItems } from '@/lib/menu';

export default function ItemDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void loadMenuItems().then((items) => {
        setItem(items.find((menuItem) => menuItem.id === params.id) ?? null);
        setLoaded(true);
      });
    }, [params.id])
  );

  const confirmDelete = () => {
    if (!item) return;
    Alert.alert('Delete item', `Are you sure you want to delete ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const items = await loadMenuItems();
          await persistMenuItems(items.filter((menuItem) => menuItem.id !== item.id));
          Alert.alert('Menu item deleted', `${item.name} has been removed from your menu.`, [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
      },
    ]);
  };

  if (loaded && !item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ScreenHeader title="Dish Details" />
          <EmptyState title="Dish not found" message="This dish may have been deleted." />
        </View>
      </SafeAreaView>
    );
  }

  if (!item) return <SafeAreaView style={styles.safeArea} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Dish Details" />

        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
          <View style={styles.body}>
            <Text style={styles.course}>{item.course.toUpperCase()}</Text>
            <Text style={styles.name}>{item.name}</Text>

            <View style={styles.block}>
              <Text style={styles.blockLabel}>Chef&apos;s description</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.blockLabel}>Price on Public Menu</Text>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
            </View>

            <View style={styles.buttons}>
              <AppButton
                label="Edit"
                flex
                onPress={() => router.push({ pathname: '/add-item', params: { id: item.id } })}
              />
              <AppButton label="Delete" variant="danger" flex onPress={confirmDelete} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 26 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e3dacc',
    overflow: 'hidden',
  },
  image: { width: '100%', height: 220 },
  body: { padding: 16, gap: 12 },
  course: { color: '#b06d53', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  name: { fontSize: 32, fontWeight: '700', color: colors.text, fontFamily: fonts.heading },
  block: { backgroundColor: colors.card, borderRadius: 12, padding: 14, gap: 6 },
  blockLabel: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  description: { fontSize: 17, lineHeight: 24, color: colors.text },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 26, fontWeight: '700', color: colors.accent, fontFamily: fonts.heading },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 6 },
});
