import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  COURSE_OPTIONS,
  Course,
  MenuItem,
  getMenuItemImage,
  loadMenuItems,
  persistMenuItems,
} from '@/lib/menu';

export default function AddItemScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course>('Main');
  const [price, setPrice] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const modeLabel = useMemo(() => (editingItemId ? 'Edit Menu Item' : 'Add Menu Item'), [editingItemId]);

  useEffect(() => {
    const loadItemForEdit = async () => {
      if (!params.id || typeof params.id !== 'string') {
        return;
      }

      const items = await loadMenuItems();
      const item = items.find((menuItem) => menuItem.id === params.id);

      if (!item) {
        return;
      }

      setEditingItemId(item.id);
      setName(item.name);
      setDescription(item.description);
      setCourse(item.course);
      setPrice(String(item.price));
    };

    void loadItemForEdit();
  }, [params.id]);

  const validate = () => {
    if (!name.trim()) {
      Alert.alert('Missing dish name', 'Please add the dish name before saving.');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Missing description', 'Please share a short description of the dish.');
      return false;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid price greater than zero.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const items = await loadMenuItems();
    const cleanedPrice = Number(price);
    const menuItem: MenuItem = {
      id: editingItemId ?? `${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      course,
      price: cleanedPrice,
      image: getMenuItemImage(name.trim(), course),
    };

    const updatedItems = editingItemId
      ? items.map((item) => (item.id === editingItemId ? menuItem : item))
      : [menuItem, ...items];

    await persistMenuItems(updatedItems);
    Alert.alert(
      editingItemId ? 'Menu item updated' : 'Menu item added',
      `The dish ${menuItem.name} has been ${editingItemId ? 'updated' : 'saved'} successfully.`
    );
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.title}>{modeLabel}</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Ribeye Steak 300g"
            placeholderTextColor="#9b9b9b"
            style={styles.input}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your culinary masterpiece, flavours, cooking methods, or sides..."
            placeholderTextColor="#9b9b9b"
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Course</Text>
          <View style={styles.pickerWrap}>
            <TextInput
              value={course}
              editable={false}
              style={[styles.input, styles.pickerInput]}
            />
            <View style={styles.pickerOptions}>
              {COURSE_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setCourse(option)}
                  style={[styles.optionButton, course === option && styles.optionButtonSelected]}>
                  <Text style={[styles.optionText, course === option && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Text style={styles.label}>Price (R)</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="R 0.00"
            placeholderTextColor="#9b9b9b"
            style={styles.input}
            keyboardType="decimal-pad"
          />

          <Pressable onPress={() => void handleSave()} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>{editingItemId ? 'Update Menu Item' : 'Save Menu Item'}</Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>Form screen where the chef enters the dish name, description, course, and price.</Text>
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
    paddingBottom: 22,
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c2928',
    fontFamily: 'Georgia',
  },
  formSection: {
    backgroundColor: '#f7f3ee',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#e3dacc',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#302d2d',
    marginBottom: 4,
  },
  input: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f3efe8',
    borderWidth: 1,
    borderColor: '#d9d1c8',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: '#2b2a2a',
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  pickerWrap: {
    gap: 8,
  },
  pickerInput: {
    backgroundColor: '#f6f0e9',
    color: '#4a4542',
  },
  pickerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d8d0c7',
    backgroundColor: '#f5efe9',
  },
  optionButtonSelected: {
    backgroundColor: '#b7c4a6',
    borderColor: '#94a887',
  },
  optionText: {
    color: '#494240',
    fontSize: 16,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fdfcf9',
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: '#5c6f53',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  footerText: {
    marginTop: 16,
    color: '#706b68',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
