import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COURSE_OPTIONS, MenuItem, formatPrice, loadMenuItems } from '@/lib/menu';

const FILTERS = ['All', ...COURSE_OPTIONS] as const;
type FilterType = (typeof FILTERS)[number];

export default function HomeScreen() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const syncItems = useCallback(async () => {
    const storedItems = await loadMenuItems();
    setItems(storedItems);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void syncItems();
    }, [syncItems])
  );

  const filteredItems =
    activeFilter === 'All' ? items : items.filter((item) => item.course === activeFilter);

  const renderItem = ({ item }: { item: MenuItem }) => (
    <Pressable style={styles.card} onPress={() => router.push({ pathname: '/item-details', params: { id: item.id } })}>
      <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" />
      <View style={styles.cardTextArea}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardCourse}>{item.course.toUpperCase()}</Text>
        <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>My Menu</Text>

            <Text style={styles.welcome}>Welcome back, Chef</Text>
            <Text style={styles.subText}>
              You currently have {items.length} active dishes on your public menu.
            </Text>

            <View style={styles.filterRow}>
              {FILTERS.map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}>
                  <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerWrap}>
            <Pressable onPress={() => router.push('/add-item')} style={styles.addButton}>
              <Text style={styles.addButtonText}>＋ Add New Item</Text>
            </Pressable>
            <View style={styles.footerLine} />
            <Text style={styles.footerNote}>Home screen showing the list of saved menu items and an Add New Item button.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2ede6',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
  },
  title: {
    textAlign: 'center',
    fontSize: 38,
    fontWeight: '700',
    color: '#2c2928',
    fontFamily: 'Georgia',
    marginBottom: 18,
  },
  welcome: {
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '400',
    color: '#292624',
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  subText: {
    fontSize: 17,
    color: '#4f4a46',
    marginBottom: 18,
    textAlign: 'left',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d8d0c7',
    backgroundColor: '#f5efe9',
  },
  filterButtonActive: {
    backgroundColor: '#c5714b',
    borderColor: '#b56544',
  },
  filterText: {
    color: '#4b433f',
    fontSize: 15,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5efe8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2d7ce',
    padding: 10,
    marginBottom: 14,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#d4c2af',
  },
  cardTextArea: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  cardCourse: {
    color: '#b06d53',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardName: {
    color: '#2d2a29',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
    fontFamily: 'Georgia',
  },
  cardPrice: {
    color: '#2d2b2a',
    fontSize: 18,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 30,
    color: '#7a716b',
    paddingHorizontal: 8,
  },
  footerWrap: {
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#c86e4c',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
  footerLine: {
    height: 3,
    width: 120,
    borderRadius: 10,
    backgroundColor: '#d9d3cd',
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 14,
  },
  footerNote: {
    fontSize: 13,
    color: '#5b5754',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
