![npm](https://img.shields.io/npm/v/react-native-material-you-colors?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/alabsi91/react-native-material-you-colors?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/alabsi91/react-native-material-you-colors?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-IOS%20%7C%20Android%20%7C%20Expo%20%7C%20Web-informational?style=for-the-badge)

![banner](https://lh3.googleusercontent.com/552oGSlinN0Gd7T8EjNkYGCBzHt0UmoG_pWtHSUY6FwaGT4q4-zJlGHD9rWO7MT5Oe_rtQZmyVnGRxVXch7Q1CTSQMs_1TcwbIMX9xZYDjEK2_R7PA=w1400-v0)


https://github.com/alabsi91/react-native-material-you-colors/assets/58077449/5d70f2a6-ae2a-42c3-be02-0446e9f69f42


# React Native Material You Colors

React Native Material You Colors is a powerful library that simplifies the retrieval of Material You color palettes while ensuring compatibility across multiple platforms. With just a single seed color, you can generate palettes inspired by Material You's dynamic theming.

> Please check out my other library, [`Reanimated Color Picker`](https://github.com/alabsi91/reanimated-color-picker)

# Key Features

### Multi-Platform Support

This library seamlessly extends its support beyond `Android` to include `IOS` and `WEB` platforms. This cross-platform compatibility enables you to maintain consistent visuals and user experiences across various devices.

### Algorithm Conversion

We've diligently converted Android's Material You color generation algorithm from Java to JavaScript, ensuring its accessibility across all platforms. This conversion guarantees that you can harness the same robust color palette generation capabilities, regardless of your target platform.

### Theme Management

React Native Material You Colors offers a comprehensive theme management solution to maintain a cohesive and user-friendly experience across your application.

## Installation

```sh
npm install react-native-material-you-colors
```

> **Warning**
> For `Expo` users, please note that the native side of this library will not function in `Expo Go` during app development. The native side is solely used to retrieve Material You colors from the `Android` system, but you can still generate palettes. The native side will work as expected after building the app in production mode.

## Usage

### Without using the Theme Provider

```ts
import MaterialYou from 'react-native-material-you-colors';

const palette = MaterialYou.getMaterialYouPalette();

/**
 * The output object
 * {
 *  system_accent1: string[]; An array containing `13` color shades.
 *  system_accent2: string[];
 *  system_accent3: string[];
 *  system_neutral1: string[];
 *  system_neutral2: string[];
 * }
 */
```

### Methods

- #### isSupported

  ```ts
  MaterialYou.isSupported : boolean
  ```

  To verify the current platform/device support for Material You dynamic colors.

- #### getMaterialYouPalette

  ```ts
  MaterialYou.getMaterialYouPalette(fallbackSeedColor?: string, style?: GenerationStyle): MaterialYouPalette
  ```

  Get the Material You color palette from the Android system on the device.

  If Material You is not supported on the user's device, a color palette generated from a fallback seed color will be returned.

- #### generatePaletteFromColor

  ```ts
  MaterialYou.generatePaletteFromColor(colorSeed: string, style?: GenerationStyle): MaterialYouPalette
  ```

  Generate a complete Material You palette from a single HEX color (seed color).

  Various styles are available to choose from, each of which dictates how the palette will be generated.

  **Note:** The input seed color should be in HEX format (#RRGGBB), without the alpha channel. For example, `#1b6ef3`.

- #### The shape of the output palette data

  ```ts
  type MaterialYouPalette = {
    system_accent1: string[]; // An array containing `13` color shades.
    system_accent2: string[];
    system_accent3: string[];
    system_neutral1: string[];
    system_neutral2: string[];
  };
  ```

### Using the Theme Provider

We recommend using the Theme Provider for a straightforward and hassle-free way to manage your app's theme. This approach ensures a consistent and visually appealing experience for your users. To get started, follow these steps:

1. Create a new theme context and provide a function to determine which colors you want to use.

   > **Warning**
   > The function should return an object with the keys `light` and `dark`, where both keys contain objects with the same set of keys representing the colors you want to use for the light and dark themes.

```ts
// theme.ts

import MaterialYou from 'react-native-material-you-colors';
import type { MaterialYouPalette } from 'react-native-material-you-colors';

function generateTheme(palette: MaterialYouPalette) {
  const light = {
    isDark: false,
    primary: palette.system_accent1[7], // shade 500
    text: palette.system_accent1[9], // shade 700
    textColored: palette.system_accent1[2], // shade 50
    background: palette.system_neutral1[1], // shade 10
    card: palette.system_accent2[2], // shade 50
    icon: palette.system_accent1[10], // shade 800
  };
  const dark: typeof light = {
    isDark: true,
    primary: palette.system_accent1[4], // shade 200
    text: palette.system_accent1[3], // shade 100
    textColored: palette.system_accent1[9], // shade 700
    background: palette.system_neutral1[11], // shade 900
    card: palette.system_accent2[10], // shade 800
    icon: palette.system_accent1[3], // shade 100
  };
  return { light, dark };
}

export const { ThemeProvider, useMaterialYouTheme } = MaterialYou.createThemeContext(generateTheme);
```

</br>

2. Wrap your app with the Theme Provider, providing the initial props:

</br>

```ts
// App.tsx

import React from 'react';
import Home from './screens/Home';

import { ThemeProvider } from './Theme'; // 👈

export default function App() {
  return (
    <ThemeProvider seedColor='auto' colorScheme='auto' fallbackColor='#1b6ef3' generationStyle='TONAL_SPOT'>
      <Home />
    </ThemeProvider>
  );
}
```

### `ThemeProvider` props:

| Prop              | Type                                                                                                           | Description                                                                                                                                                                                            | Default        |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `colorScheme`     | `"auto" \| "dark" \| "light"`                                                                                  | Specifies the initial color scheme for your app.                                                                                                                                                       | `"auto"`       |
| `fallbackColor`   | `string` (HEX Color)                                                                                           | This is used to generate a fallback palette in case the platform does not support Material You colors.                                                                                                 | `'#1b6ef3'`    |
| `generationStyle` | `"SPRITZ"\| "TONAL_SPOT"\| "VIBRANT"\| "EXPRESSIVE"\| "RAINBOW"\| "FRUIT_SALAD"\| "CONTENT"\| "MONOCHROMATIC"` | Palette generation style.                                                                                                                                                                              | `"TONAL_SPOT"` |
| `seedColor`       | `"auto" \| string` (HEX Color)                                                                                 | If set to `"auto"`, it tries to get the palette from the device, falling back to the provided color if unsupported. If set to a color (HEX only), it generates a new palette without device retrieval. | `"auto"`       |

</br>

3. Use the `useMaterialYouTheme` hook to access the current theme in your components:

</br>

```jsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useMaterialYouTheme } from './Theme'; // 👈

export default function MyComponent() {
  const theme = useMaterialYouTheme();

  return <View style={[styles.container, { backgroundColor: theme.background }]}>

  // ...
}
```

</br>

### `useMaterialYouTheme` provide other utilities you can use throw your app:

- #### Changing Color Scheme

  ```ts
  setColorScheme: (value: "auto" | "dark" | "light") => void
  ```

  **Description**</br>
  Switch between themes (`dark` or `light`) or set it to `auto` to follow system color scheme preference.

- #### Generate new palette

  ```ts
  setMaterialYouColor: (seedColor: "auto" | string), style?: GenerationStyle) => void
  ```

  **Description**</br>
  Generate a new Material You palette and set it as the current theme.</br>
  `The seed color:` It can be `"auto"` to follow the system theme if supported;
  otherwise, it will generate a palette using the `fallbackColor` prop.
  If a HEX color is provided, it will generate a new palette using that seed color.</br>
  `style:` - The style that dictates how the palette will be generated.

- #### Change palette generation style

  ```ts
  setPaletteStyle: (style: generationStyle) => void;

  type generationStyle = "SPRITZ" | "TONAL_SPOT" | "VIBRANT" | "EXPRESSIVE" | "RAINBOW" | "FRUIT_SALAD" | "CONTENT" | "MONOCHROMATIC"
  ```

  **Description**</br>
  Change the palette generation style and set it as the current theme.</br>
  **Disclaimer**: If the current Material You palette is set to `"auto"` (following the system theme), a new palette will be generated using the `fallbackColor` prop.</br>

- ### Other

  ```ts
  seedColor: 'auto' | string;
  ```

  **Description**</br>
  Returns the current seed color used to generate the palette.  
   If the palette follows the system theme, it will be `"auto"`.</br>

  ```ts
  style: GenerationStyle;
  ```

  **Description**</br>
  Returns the current generation style used to generate the palette.

## Examples

Explore how to use React Native Material You Colors with these practical examples:

1. [Example: React Native App](https://github.com/alabsi91/react-native-material-you-colors/tree/main/example)

</br>

2. [Example: Expo Snack](https://snack.expo.dev/@alabsi91/react-native-material-you-colors)
   > **Warning** Please be aware that retrieving the Material You color palette from Android system on `Expo` only functions in the production build.

## License

React Native Material You Colors library is licensed under [**The MIT License.**](https://github.com/alabsi91/react-native-material-you-colors/blob/main/LICENSE)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
