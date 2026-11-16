import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/menu/empty-state';
import { ScreenHeader } from '@/components/menu/screen-header';
import { colors, fonts } from '@/constants/app-theme';
import { COURSE_OPTIONS, MenuItem, calculateStatistics, formatPrice, loadMenuItems } from '@/lib/menu';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function StatisticsScreen() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      void loadMenuItems().then(setItems);
    }, [])
  );

  const stats = calculateStatistics(items);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Menu Statistics" />

        {items.length === 0 ? (
          <EmptyState title="No statistics yet" message="Add some dishes to see an overview of your menu." />
        ) : (
          <>
            <View style={styles.row}>
              <StatCard label="Total menu items" value={String(stats.totalItems)} />
              <StatCard label="Average price" value={formatPrice(stats.averagePrice)} />
            </View>

            <Text style={styles.sectionTitle}>Items per course</Text>
            <View style={styles.listCard}>
              {COURSE_OPTIONS.map((course, index) => (
                <View key={course} style={[styles.courseRow, index > 0 && styles.courseRowBorder]}>
                  <Text style={styles.courseName}>{course}</Text>
                  <Text style={styles.courseCount}>{stats.perCourse[course]}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 26 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    alignItems: 'center',
  },
  statValue: { fontSize: 32, fontWeight: '700', color: colors.accent, fontFamily: fonts.heading },
  statLabel: { fontSize: 15, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 22, fontFamily: fonts.heading, color: colors.text, marginBottom: 10 },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
  },
  courseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16 },
  courseRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  courseName: { fontSize: 18, color: colors.text },
  courseCount: { fontSize: 18, fontWeight: '700', color: colors.text },
});
