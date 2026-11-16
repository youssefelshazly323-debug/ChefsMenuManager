import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/menu/app-button';
import { CourseChips } from '@/components/menu/course-chips';
import { EmptyState } from '@/components/menu/empty-state';
import { MenuCard } from '@/components/menu/menu-card';
import { colors, fonts } from '@/constants/app-theme';
import { COURSE_FILTERS, CourseFilter, MenuItem, filterMenuItems, loadMenuItems } from '@/lib/menu';

export default function HomeScreen() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<CourseFilter>('All');

  // Reload whenever the screen regains focus so add/edit/delete show immediately.
  useFocusEffect(
    useCallback(() => {
      void loadMenuItems().then(setItems);
    }, [])
  );

  const visibleItems = useMemo(
    () => filterMenuItems(items, searchText, activeFilter),
    [items, searchText, activeFilter]
  );
  const isFiltering = searchText.trim() !== '' || activeFilter !== 'All';

  const clearFilters = () => {
    setSearchText('');
    setActiveFilter('All');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <MenuCard
            item={item}
            onPress={() => router.push({ pathname: '/item-details', params: { id: item.id } })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>My Menu</Text>
            <Text style={styles.subText}>
              Showing {visibleItems.length} of {items.length} dishes
            </Text>

            <View style={styles.searchRow}>
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search dishes by name..."
                placeholderTextColor="#9b9b9b"
                style={styles.searchInput}
                returnKeyType="search"
                accessibilityLabel="Search menu items"
              />
              {searchText !== '' && (
                <Pressable onPress={() => setSearchText('')} style={styles.clearX} accessibilityLabel="Clear search">
                  <Text style={styles.clearXText}>✕</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.filterWrap}>
              <CourseChips options={COURSE_FILTERS} selected={activeFilter} onSelect={setActiveFilter} />
            </View>

            {isFiltering && (
              <Pressable onPress={clearFilters} style={styles.clearAll}>
                <Text style={styles.clearAllText}>Clear search & filter</Text>
              </Pressable>
            )}
          </View>
        }
        ListEmptyComponent={
          items.length === 0 ? (
            <EmptyState title="No dishes yet" message="Tap “Add New Item” to create your first dish." />
          ) : (
            <EmptyState
              title="No matching dishes"
              message="Nothing matches your search or filter. Try clearing it to see all dishes."
            />
          )
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <AppButton label="＋ Add New Item" onPress={() => router.push('/add-item')} />
            <AppButton label="View Menu Statistics" variant="outline" onPress={() => router.push('/statistics')} />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 32 },
  title: {
    textAlign: 'center',
    fontSize: 38,
    fontWeight: '700',
    color: colors.text,
    fontFamily: fonts.heading,
    marginBottom: 6,
  },
  subText: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginBottom: 16 },
  searchRow: { justifyContent: 'center', marginBottom: 12 },
  searchInput: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f3efe8',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    paddingRight: 44,
    fontSize: 17,
    color: colors.text,
  },
  clearX: { position: 'absolute', right: 8, padding: 10 },
  clearXText: { fontSize: 16, color: colors.textMuted },
  filterWrap: { marginBottom: 12 },
  clearAll: { alignSelf: 'flex-start', paddingVertical: 6, marginBottom: 10 },
  clearAllText: { color: colors.accentDark, fontSize: 15, fontWeight: '700', textDecorationLine: 'underline' },
  footer: { marginTop: 10, gap: 12 },
});
