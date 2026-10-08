import { useCallback, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MenuItem, formatPrice, loadMenuItems, persistMenuItems } from '@/lib/menu';

export default function ItemDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);

  const fetchItem = useCallback(async () => {
    const items = await loadMenuItems();
    const foundItem = items.find((menuItem) => menuItem.id === params.id);
    setItem(foundItem ?? null);
  }, [params.id]);

  useFocusEffect(
    useCallback(() => {
      void fetchItem();
    }, [fetchItem])
  );

  const handleDelete = async () => {
    if (!item) {
      return;
    }

    Alert.alert('Delete item', `Are you sure you want to delete ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const items = await loadMenuItems();
          const updatedItems = items.filter((menuItem) => menuItem.id !== item.id);
          await persistMenuItems(updatedItems);
          router.back();
        },
      },
    ]);
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Dish not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Dish Details</Text>
        </View>

        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.contentArea}>
            <Text style={styles.courseTag}>{item.course.toUpperCase()}</Text>
            <Text style={styles.name}>{item.name}</Text>

            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Chef's description</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price on Public Menu</Text>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.actionButton, styles.editButton]}
                onPress={() => router.push({ pathname: '/add-item', params: { id: item.id } })}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2ede6',
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 26,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#efe9e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#d8d1c8',
  },
  backText: {
    fontSize: 24,
    color: '#2d2d2d',
    lineHeight: 28,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2b2928',
    fontFamily: 'Georgia',
  },
  card: {
    backgroundColor: '#f7f3ee',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e4d9d0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#d4c5b7',
  },
  contentArea: {
    padding: 18,
  },
  courseTag: {
    fontSize: 14,
    lineHeight: 18,
    color: '#b8644c',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  name: {
    fontSize: 40,
    lineHeight: 46,
    color: '#2d2a29',
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
  metaCard: {
    marginTop: 18,
    backgroundColor: '#f1e8df',
    borderRadius: 12,
    padding: 14,
  },
  metaLabel: {
    color: '#b9644e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: '#403b39',
    fontSize: 18,
    lineHeight: 26,
  },
  priceRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#544d49',
    fontSize: 16,
    fontWeight: '500',
  },
  price: {
    color: '#2d2c2a',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26,
    gap: 14,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: '#71806f',
    borderColor: '#688162',
  },
  deleteButton: {
    backgroundColor: '#f7f1ee',
    borderColor: '#d8b2a4',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  deleteButtonText: {
    color: '#b76153',
    fontWeight: '700',
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2ede6',
  },
  emptyText: {
    fontSize: 20,
    color: '#404040',
  },
});
