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

    let imagesUpdated = false;
    const items = parsed.map((item) => {
      const image = getMenuItemImage(item.name, item.course);
      if (item.image === image) {
        return item;
      }

      imagesUpdated = true;
      return { ...item, image };
    });

    if (imagesUpdated) {
      await persistMenuItems(items);
    }

    return items;
  } catch (error) {
    console.warn('Failed to load menu items', error);
    return DEFAULT_MENU_ITEMS;
  }
}

export async function persistMenuItems(items: MenuItem[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
