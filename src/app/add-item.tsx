import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/menu/app-button';
import { CourseChips } from '@/components/menu/course-chips';
import { ScreenHeader } from '@/components/menu/screen-header';
import { colors } from '@/constants/app-theme';
import {
  COURSE_OPTIONS,
  Course,
  MenuFormErrors,
  MenuItem,
  getMenuItemImage,
  loadMenuItems,
  persistMenuItems,
  validateMenuForm,
} from '@/lib/menu';

export default function AddItemScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course>('Main');
  const [price, setPrice] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [errors, setErrors] = useState<MenuFormErrors>({});

  const isEditing = editingItemId !== null;

  // When opened from the details screen, pre-fill the form with the item being edited.
  useEffect(() => {
    if (typeof params.id !== 'string') return;
    void loadMenuItems().then((items) => {
      const item = items.find((menuItem) => menuItem.id === params.id);
      if (!item) return;
      setEditingItemId(item.id);
      setName(item.name);
      setDescription(item.description);
      setCourse(item.course);
      setPrice(String(item.price));
    });
  }, [params.id]);

  const handleSave = async () => {
    const items = await loadMenuItems();
    const validationErrors = validateMenuForm({ name, description, price }, items, editingItemId);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const existingItem = items.find(
  (item) => item.id === editingItemId
);

const menuItem: MenuItem = {
  id: editingItemId ?? `${Date.now()}`,
  name: name.trim(),
  description: description.trim(),
  course,
  price: Number(price.replace(',', '.')),
  image: isEditing
    ? existingItem?.image ?? getMenuItemImage(name.trim(), course)
    : getMenuItemImage(name.trim(), course),
};

    const updatedItems = isEditing
      ? items.map((item) => (item.id === editingItemId ? menuItem : item))
      : [menuItem, ...items];

    await persistMenuItems(updatedItems);
    Alert.alert(
      isEditing ? 'Menu item updated' : 'Menu item added',
      `${menuItem.name} has been ${isEditing ? 'updated' : 'saved'} successfully.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ScreenHeader title={isEditing ? 'Edit Menu Item' : 'Add Menu Item'} />

          <View style={styles.form}>
            <Text style={styles.label}>Dish Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Ribeye Steak 300g"
              placeholderTextColor="#9b9b9b"
              style={[styles.input, errors.name && styles.inputError]}
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Flavours, cooking methods, sides..."
              placeholderTextColor="#9b9b9b"
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              multiline
            />
            {errors.description && <Text style={styles.error}>{errors.description}</Text>}

            <Text style={styles.label}>Course</Text>
            <CourseChips options={COURSE_OPTIONS} selected={course} onSelect={setCourse} />

            <Text style={styles.label}>Price (R)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor="#9b9b9b"
              style={[styles.input, errors.price && styles.inputError]}
              keyboardType="decimal-pad"
            />
            {errors.price && <Text style={styles.error}>{errors.price}</Text>}

            <View style={styles.buttons}>
              <AppButton
                label={isEditing ? 'Update Menu Item' : 'Save Menu Item'}
                variant="success"
                onPress={() => void handleSave()}
              />
              <AppButton label="Cancel" variant="outline" onPress={() => router.back()} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 26 },
  form: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e3dacc',
  },
  label: { fontSize: 18, fontWeight: '600', color: '#302d2d', marginTop: 4 },
  input: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f3efe8',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    fontSize: 18,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  textArea: { minHeight: 110, paddingTop: 12, textAlignVertical: 'top' },
  error: { color: colors.danger, fontSize: 14 },
  buttons: { marginTop: 10, gap: 12 },
});
