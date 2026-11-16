import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/app-theme';

type Variant = 'primary' | 'success' | 'outline' | 'danger';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  flex?: boolean;
  disabled?: boolean;
}

export function AppButton({ label, onPress, variant = 'primary', flex, disabled }: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        flex && { flex: 1 },
        (pressed || disabled) && { opacity: 0.7 },
      ]}>
      <Text style={[styles.text, variant === 'outline' && styles.outlineText, variant === 'danger' && styles.dangerText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 14, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.accent },
  success: { backgroundColor: colors.success },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.accent },
  danger: { backgroundColor: colors.dangerSoft, borderWidth: 1.5, borderColor: colors.danger },
  text: { color: colors.white, fontSize: 18, fontWeight: '700' },
  outlineText: { color: colors.accent },
  dangerText: { color: colors.danger },
});
