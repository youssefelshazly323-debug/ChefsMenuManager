import AsyncStorage from '@react-native-async-storage/async-storage';

export type Course = 'Main' | 'Starter' | 'Dessert';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: number;
  image: string;
}

export const STORAGE_KEY = 'chef-menu-items';

export const COURSE_OPTIONS: Course[] = ['Main', 'Starter', 'Dessert'];

const COURSE_IMAGES: Record<Course, string> = {
  Main: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  Starter: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80',
  Dessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
};

const DISH_IMAGES: Record<string, string> = {
  'beef stroganoff':
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
  'fruit tart':
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
};

export function getMenuItemImage(name: string, course: Course): string {
  return DISH_IMAGES[name.trim().toLowerCase()] ?? COURSE_IMAGES[course];
}

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'grilled-salmon',
    name: 'Grilled Salmon',
    description: 'Fresh salmon fillet grilled with lemon butter sauce, served with seasonal veg.',
    course: 'Main',
    price: 185,
    image: getMenuItemImage('Grilled Salmon', 'Main'),
  },

  {
    id: 'beef-stroganoff',
    name: 'Beef Stroganoff',
    description: 'Tender strips of beef in a creamy mushroom sauce, served over egg noodles.',
    course: 'Main',
    price: 195,
    image: getMenuItemImage('Beef Stroganoff', 'Main'),
  },
  
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan, croutons, and a creamy dressing.',
    course: 'Starter',
    price: 95,
    image: getMenuItemImage('Caesar Salad', 'Starter'),
  },

  {
    id: 'choc-lava-cake',
    name: 'Choc Lava Cake',
    description: 'Warm chocolate cake with a molten centre and vanilla bean cream.',
    course: 'Dessert',
    price: 75,
    image: getMenuItemImage('Choc Lava Cake', 'Dessert'),
  },

  {
    id: 'fruit-tart',
    name: 'Fruit Tart',   
  description: 'A buttery tart filled with custard and topped with fresh seasonal fruits.',
    course: 'Dessert',
    price: 85,
    image: getMenuItemImage('Fruit Tart', 'Dessert'),
  },  

];

export function getCourseImage(course: Course): string {
  return COURSE_IMAGES[course];
}

export function formatPrice(value: number): string {
  return `R${value.toFixed(2)}`;
}

export async function loadMenuItems(): Promise<MenuItem[]> {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
      return DEFAULT_MENU_ITEMS;
    }

    const parsed = JSON.parse(rawValue) as MenuItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_MENU_ITEMS;
    }
const items = parsed.map((item) => ({
  ...item,
  image:
    item.id === 'choc-lava-cake'
      ? COURSE_IMAGES.Dessert
      : item.image || getMenuItemImage(item.name, item.course),
}));

await persistMenuItems(items);

return items;
  } catch (error) {
    console.warn('Failed to load menu items', error);
    return DEFAULT_MENU_ITEMS;
  }
}

export async function persistMenuItems(items: MenuItem[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ---------------------------------------------------------------------------
// Reusable helpers (added in Part 3)
// ---------------------------------------------------------------------------

export type CourseFilter = 'All' | Course;
export const COURSE_FILTERS: CourseFilter[] = ['All', ...COURSE_OPTIONS];

/** Filters by course and by a case-insensitive name search. Both are optional. */
export function filterMenuItems(
  items: MenuItem[],
  searchText: string,
  course: CourseFilter
): MenuItem[] {
  const query = searchText.trim().toLowerCase();
  return items.filter((item) => {
    const matchesCourse = course === 'All' || item.course === course;
    const matchesName = query === '' || item.name.toLowerCase().includes(query);
    return matchesCourse && matchesName;
  });
}

export interface MenuStatistics {
  totalItems: number;
  averagePrice: number;
  perCourse: Record<Course, number>;
}

export function calculateStatistics(items: MenuItem[]): MenuStatistics {
  const perCourse: Record<Course, number> = { Starter: 0, Main: 0, Dessert: 0 };
  items.forEach((item) => {
    perCourse[item.course] += 1;
  });
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return {
    totalItems: items.length,
    averagePrice: items.length === 0 ? 0 : total / items.length,
    perCourse,
  };
}

export interface MenuFormErrors {
  name?: string;
  description?: string;
  price?: string;
}

/** Validates the add/edit form. Returns an object of field errors (empty = valid). */
export function validateMenuForm(
  values: { name: string; description: string; price: string },
  existingItems: MenuItem[],
  editingId: string | null
): MenuFormErrors {
  const errors: MenuFormErrors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = 'Please enter the dish name.';
  } else if (name.length < 2) {
    errors.name = 'The dish name must be at least 2 characters.';
  } else if (
    existingItems.some(
      (item) => item.id !== editingId && item.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    errors.name = 'A dish with this name already exists.';
  }

  if (!values.description.trim()) {
    errors.description = 'Please add a short description.';
  } else if (values.description.trim().length < 10) {
    errors.description = 'The description must be at least 10 characters.';
  }

  const price = Number(values.price.replace(',', '.'));
  if (!values.price.trim()) {
    errors.price = 'Please enter a price.';
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.price = 'Enter a valid price greater than zero.';
  } else if (price > 10000) {
    errors.price = 'Price looks too high (max R10 000).';
  }

  return errors;
}
