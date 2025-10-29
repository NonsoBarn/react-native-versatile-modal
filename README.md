# React Native Versatile Modal
[![npm version](https://badge.fury.io/js/@nonsobarn%2Freact-native-versatile-modal.svg)](https://www.npmjs.com/package/@nonsobarn/react-native-versatile-modal)
[![npm downloads](https://img.shields.io/npm/dm/@nonsobarn/react-native-versatile-modal.svg)](https://www.npmjs.com/package/@nonsobarn/react-native-versatile-modal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/nonsobarn/react-native-versatile-modal.svg?style=social&label=Star)](https://github.com/nonsobarn/react-native-versatile-modal)

A flexible, highly customizable modal component for React Native with built-in support for bottom sheets, drawers, center modals, and full-screen modals. Features smooth animations, gesture support, and TypeScript definitions.

## Features

✨ **4 Modal Types**: Bottom Sheet, Drawer, Center Modal, Full-Screen  
🎨 **Fully Customizable**: Theme colors, animations, dimensions  
📱 **Gesture Support**: Swipe-to-dismiss for bottom sheets  
⚡ **Smooth Animations**: Native driver for 60fps performance  
🎯 **TypeScript**: Full type definitions included  
♿ **Accessible**: Built with accessibility in mind  
🪶 **Lightweight**: Zero dependencies (except React Native peer deps)

## Installation

```bash
npm install @nonsobarn/react-native-versatile-modal
# or
yarn add @nonsobarn/react-native-versatile-modal
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import ModalWrapper from '@nonsobarn/react-native-versatile-modal';

function App() {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Button title="Open Modal" onPress={() => setVisible(true)} />

      <ModalWrapper visible={visible} onClose={() => setVisible(false)} type="bottom-sheet">
        <View style={{ padding: 20 }}>
          <Text>Hello from Modal!</Text>
        </View>
      </ModalWrapper>
    </View>
  );
}
```

## Modal Types

### Bottom Sheet

Perfect for mobile-first UIs and quick actions.

```tsx
<ModalWrapper
  visible={visible}
  onClose={() => setVisible(false)}
  type="bottom-sheet"
  bottomSheetHeight="60%"
  enableSwipeDown={true}
>
  <YourContent />
</ModalWrapper>
```

### Center Modal

Traditional dialog/alert style modals.

```tsx
<ModalWrapper
  visible={visible}
  onClose={() => setVisible(false)}
  type="center"
  centerModalWidth="90%"
  centerModalMaxHeight="80%"
>
  <YourContent />
</ModalWrapper>
```

### Drawer

Side navigation or menu panels.

```tsx
<ModalWrapper
  visible={visible}
  onClose={() => setVisible(false)}
  type="drawer"
  drawerPosition="left"
  drawerWidth="80%"
>
  <YourNavigationMenu />
</ModalWrapper>
```

### Full Screen

Immersive full-screen experiences.

```tsx
<ModalWrapper visible={visible} onClose={() => setVisible(false)} type="full-screen">
  <YourFullScreenContent />
</ModalWrapper>
```

## API Reference

### Props

| Prop       | Type                                                      | Default          | Description                |
| ---------- | --------------------------------------------------------- | ---------------- | -------------------------- |
| `visible`  | `boolean`                                                 | **required**     | Controls modal visibility  |
| `onClose`  | `() => void`                                              | **required**     | Callback when modal closes |
| `type`     | `'bottom-sheet' \| 'drawer' \| 'center' \| 'full-screen'` | `'bottom-sheet'` | Modal type                 |
| `children` | `React.ReactNode`                                         | **required**     | Modal content              |

#### Animation Props

| Prop                | Type     | Default | Description              |
| ------------------- | -------- | ------- | ------------------------ |
| `animationDuration` | `number` | `300`   | Animation duration in ms |
| `backdropOpacity`   | `number` | `0.5`   | Backdrop opacity (0-1)   |

#### Type-Specific Props

| Prop                   | Type                | Default  | Description                 |
| ---------------------- | ------------------- | -------- | --------------------------- |
| `bottomSheetHeight`    | `number \| string`  | `'50%'`  | Height for bottom sheet     |
| `drawerPosition`       | `'left' \| 'right'` | `'left'` | Drawer slide direction      |
| `drawerWidth`          | `number \| string`  | `'80%'`  | Width for drawer            |
| `centerModalWidth`     | `number \| string`  | `'90%'`  | Width for center modal      |
| `centerModalMaxHeight` | `number \| string`  | `'80%'`  | Max height for center modal |

#### Interaction Props

| Prop                     | Type      | Default | Description                            |
| ------------------------ | --------- | ------- | -------------------------------------- |
| `enableSwipeDown`        | `boolean` | `true`  | Enable swipe-to-dismiss (bottom sheet) |
| `enableBackdropDismiss`  | `boolean` | `true`  | Close on backdrop press                |
| `swipeThreshold`         | `number`  | `100`   | Distance to trigger dismiss (px)       |
| `swipeVelocityThreshold` | `number`  | `0.5`   | Velocity to trigger dismiss            |

#### Styling Props

| Prop             | Type               | Default | Description                    |
| ---------------- | ------------------ | ------- | ------------------------------ |
| `containerStyle` | `ViewStyle`        | `{}`    | Style for modal container      |
| `contentStyle`   | `ViewStyle`        | `{}`    | Style for content wrapper      |
| `theme`          | `ThemeConfig`      | `{}`    | Theme colors (see below)       |
| `responsive`     | `ResponsiveConfig` | `{}`    | Responsive helpers (see below) |

#### Callbacks

| Prop             | Type         | Description                      |
| ---------------- | ------------ | -------------------------------- |
| `onOpen`         | `() => void` | Called when modal starts opening |
| `onAnimationEnd` | `() => void` | Called when animation completes  |

#### Accessibility

| Prop                 | Type     | Description         |
| -------------------- | -------- | ------------------- |
| `accessibilityLabel` | `string` | Accessibility label |
| `testID`             | `string` | Test identifier     |

### Theme Configuration

```tsx
interface ThemeConfig {
  backgroundColor?: string; // Modal background
  backdropColor?: string; // Backdrop color
  handleColor?: string; // Bottom sheet handle color
}

// Usage
<ModalWrapper
  theme={{
    backgroundColor: '#FFFFFF',
    backdropColor: '#000000',
    handleColor: '#CCCCCC',
  }}
  // ...
/>;
```

### Responsive Configuration

Integrate with your responsive design system:

```tsx
interface ResponsiveConfig {
  normalize?: (value: number) => number;
  normalizeWidth?: (value: number) => number;
  normalizeHeight?: (value: number) => number;
}

// Example with custom responsive utility
import { normalize } from './utils/responsive';

<ModalWrapper
  responsive={{
    normalize: normalize,
    // or separately:
    // normalizeWidth: normalizeWidth,
    // normalizeHeight: normalizeHeight,
  }}
  // ...
/>;
```

## Advanced Examples

### Custom Styled Bottom Sheet

```tsx
<ModalWrapper
  visible={visible}
  onClose={() => setVisible(false)}
  type="bottom-sheet"
  bottomSheetHeight="70%"
  animationDuration={400}
  backdropOpacity={0.7}
  theme={{
    backgroundColor: '#1a1a1a',
    backdropColor: '#000000',
    handleColor: '#666666',
  }}
  containerStyle={{
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  }}
>
  <View style={styles.content}>
    <Text style={styles.title}>Settings</Text>
    {/* Your content */}
  </View>
</ModalWrapper>
```

### Drawer with Custom Width

```tsx
<ModalWrapper
  visible={visible}
  onClose={() => setVisible(false)}
  type="drawer"
  drawerPosition="right"
  drawerWidth={300}
  enableBackdropDismiss={true}
>
  <NavigationMenu />
</ModalWrapper>
```

### Non-Dismissible Modal

```tsx
<ModalWrapper
  visible={visible}
  onClose={() => setVisible(false)}
  type="center"
  enableBackdropDismiss={false}
  enableSwipeDown={false}
>
  <View style={styles.alertBox}>
    <Text>This action cannot be undone</Text>
    <Button title="Confirm" onPress={handleConfirm} />
  </View>
</ModalWrapper>
```

## TypeScript Support

Full TypeScript definitions are included:

```tsx
import ModalWrapper, {
  ModalType,
  ModalWrapperProps,
  ThemeConfig,
  ResponsiveConfig,
} from 'react-native-versatile-modal';
```

## Performance Tips

1. **Use `useCallback` for handlers**:

```tsx
const handleClose = useCallback(() => {
  setVisible(false);
}, []);
```

2. **Memoize heavy content**:

```tsx
const content = useMemo(() => <HeavyComponent />, []);
```

3. **Avoid inline styles**: Define styles outside render

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Your Name]

## Support

- 🐛 [Report bugs](https://github.com/yourusername/react-native-versatile-modal/issues)
- 💬 [Discussions](https://github.com/yourusername/react-native-versatile-modal/discussions)
- ⭐ Star this repo if you find it useful!

---

Made with ❤️ for the React Native community
