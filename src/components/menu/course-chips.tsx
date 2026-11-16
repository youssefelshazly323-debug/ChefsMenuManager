import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/app-theme';

interface CourseChipsProps<T extends string> {
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
}

/** Reusable row of selectable chips (used for the course filter and the course picker). */
export function CourseChips<T extends string>({ options, selected, onSelect }: CourseChipsProps<T>) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d8d0c7',
    backgroundColor: '#f5efe9',
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accentDark },
  text: { color: '#4b433f', fontSize: 15, fontWeight: '600' },
  textActive: { color: colors.white },
});
