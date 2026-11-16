# Chef's Menu Manager

A React Native (Expo) **mobile app** that lets a chef capture, manage, search and analyse the dishes on their menu.
This is a **native mobile app (Android/iOS) only – there is no web version**. Run it in Expo Go on a phone, on an Android emulator, or install the APK built with EAS (`eas build -p android --profile preview`).

## Run the app
```bash
npm install
npx expo start      # press 'a' for Android emulator, or scan the QR code with Expo Go
```

**Video demonstration:** https://youtu.be/gWuV6LId2PU
**Video demonstration Part 3:** https://youtube.com/shorts/qbwTm-umNMc
                     
## Features
- Add, edit and delete menu items (changes show immediately, saved with AsyncStorage)
- Search dishes by name (case-insensitive) and filter by course (Starter / Main / Dessert)
- Clear search & filter to show all dishes again
- Menu statistics: total items, average price, number of items per course
- Inline form validation, success/error messages and empty-state messages

---

# Change Log (Part 2 → Part 3 / Final PoE)

## New functionality
| Area | Change |
|---|---|
| Manage items | Edit and delete flows kept and improved: delete now shows a confirmation **and** a success message; the list refreshes instantly when returning to Home (`useFocusEffect`). |
| Search | Added a search box on the Home screen that filters by dish name as the chef types, with a ✕ button to clear the text. |
| Filter | Course filter (All / Starter / Main / Dessert) now works together with the search. |
| Clear | Added a "Clear search & filter" link that resets everything and shows all items. |
| Statistics | New `statistics.tsx` screen (opened from Home) showing total items, average price and items per course. |
| Empty states | Friendly messages for "no dishes yet", "no matching dishes" and "no statistics yet". |
| Validation | Field-level error messages under each input (red border). New rules: name min 2 chars, **duplicate names rejected**, description min 10 chars, price must be a number > 0 and ≤ R10 000, comma decimals accepted. |

## Mobile-only
- Removed the web target (`web` config in `app.json`, `react-dom`, `react-native-web`, web-only hooks); `platforms` is now `android` and `ios`.

## Refactoring
- **Reusable components** created in `src/components/menu/`: `MenuCard`, `CourseChips`, `AppButton`, `ScreenHeader`, `EmptyState`. The same chips component is used for the Home filter and the course picker on the form.
- **Reusable functions** added to `src/lib/menu.ts`: `filterMenuItems`, `calculateStatistics`, `validateMenuForm` (UI-free logic, separated from screens).
- **Central theme** `src/constants/app-theme.ts` (colours, fonts, spacing) replaces repeated hard-coded colour values.
- **Removed repeated code**: the back-button header and the button styles were copy-pasted on every screen; now single components.
- **Removed template leftovers** (unused Expo starter components, `explore` redirect screen, unused images) and the placeholder captions ("Home screen showing the list...") that were left on screens from Part 1.
- **Renamed / simplified**: `syncItems`/`fetchItem` loaders replaced with a single `loadMenuItems().then(...)` pattern; `modeLabel` memo replaced by an `isEditing` flag.
- **Fixed**: the course field was a disabled `TextInput` pretending to be a dropdown; replaced with selectable chips only. Details screen now uses `expo-image` like the list.

## UX improvements
- Consistent header, spacing, buttons and colours on all four screens.
- Clear navigation: back button on every screen, "View Menu Statistics" and "Add New Item" on Home, Cancel on the form.
- Keyboard handling on the form (`KeyboardAvoidingView`, `keyboardShouldPersistTaps`).
- Accessibility labels on search, back and clear buttons.

## References
- React Native docs: https://reactnative.dev/docs
- Expo Router docs: https://docs.expo.dev/router/introduction
- AsyncStorage: https://react-native-async-storage.github.io/async-storage/
