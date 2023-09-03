import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Appearance, StatusBar } from 'react-native';
import MaterialYou from 'react-native-material-you-colors';

import type { NativeEventSubscription } from 'react-native';
import type { MaterialYouPalette, Styles } from 'react-native-material-you-colors';

// If Material You is not supported, a palette will be generated using this color.
const FALLBACK_COLOR = '#1b6ef3';

/**
 * The function generates a light theme and a dark theme using a given MaterialYouPalette.
 * @param {MaterialYouPalette} palette - The `palette` parameter is of type `MaterialYouPalette`. It is
 * an object that contains various color shades used in the Material You color system.
 * @returns an object that contains two properties: `lightTheme` and `darkTheme`.
 */
function generateTheme(palette: MaterialYouPalette) {
  const lightTheme = {
    isDark: false,
    primary: palette.system_accent1[7], // shade 500
    text: palette.system_accent1[9], // shade 700
    textColored: palette.system_accent1[2], // shade 50
    background: palette.system_neutral1[1], // shade 10
    card: palette.system_accent2[2], // shade 50
    icon: palette.system_accent1[10], // shade 800
  };
  const darkTheme: typeof lightTheme = {
    isDark: true,
    primary: palette.system_accent1[4], // shade 200
    text: palette.system_accent1[3], // shade 100
    textColored: palette.system_accent1[9], // shade 700
    background: palette.system_neutral1[11], // shade 900
    card: palette.system_accent2[10], // shade 800
    icon: palette.system_accent1[3], // shade 100
  };
  return { lightTheme, darkTheme };
}

// initial light and dark theme colors
let { lightTheme, darkTheme } = generateTheme(MaterialYou.getMaterialYouPalette(FALLBACK_COLOR));

// Select a theme based on the scheme color during the initial start.
export const theme = Appearance.getColorScheme() === 'light' ? lightTheme : darkTheme;

type ColorScheme = 'light' | 'dark' | 'auto';

type ThemeContextType = typeof theme & { seed: string | null } & { style: Styles } & {
  setMaterialYouColor: (color?: string) => void;
} & { setMaterialYouPaletteStyle: (style: Styles) => void } & {
  setColorScheme: (value: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextType>(null!);

export function useTheme() {
  return useContext(ThemeContext);
}

type ThemeProviderProps = {
  defaultTheme?: ColorScheme;
  children: React.ReactNode;
};
export function ThemeProvider({ defaultTheme = 'auto', children }: ThemeProviderProps) {
  const [initialTheme, setInitialTheme] = useState(theme);

  // The color that was used to generate the current palette.
  // If null, it means the palette is not generated, and it's derived from the device.
  const colorSeed = useRef<string | null>(MaterialYou.isMaterialYouSupported ? null : FALLBACK_COLOR);

  // 'SPRITZ' | 'TONAL_SPOT' | 'VIBRANT' | 'EXPRESSIVE' | 'RAINBOW' | 'FRUIT_SALAD' | 'CONTENT' | 'MONOCHROMATIC'
  const palateStyle = useRef<Styles>('TONAL_SPOT');

  // 'light' | 'dark' | 'auto'
  const currentColorScheme = useRef(defaultTheme);

  // The listener if the color scheme is set to "auto".
  const colorSchemeListener = useRef<NativeEventSubscription>(null!);

  const setColorScheme = (value: ColorScheme) => {
    currentColorScheme.current = value;

    if (value === 'auto') {
      const scheme = Appearance.getColorScheme() ?? 'dark';
      setInitialTheme(scheme === 'light' ? lightTheme : darkTheme);

      // add color scheme listener
      if (colorSchemeListener.current) colorSchemeListener.current.remove();
      colorSchemeListener.current = Appearance.addChangeListener(({ colorScheme }) => {
        setInitialTheme(colorScheme === 'light' ? lightTheme : darkTheme);
      });

      return;
    }

    setInitialTheme(value === 'light' ? lightTheme : darkTheme);
    // remove color scheme listener
    if (colorSchemeListener.current) colorSchemeListener.current.remove();
  };

  /**
   * generates a color palette based on a given seed or the default Material You palette.
   * @param {string} [seed] - used as a starting point to generate a color palette using the Material You API.
   */
  const setMaterialYouColor = (seed?: string) => {
    const generatedPalette = seed
      ? MaterialYou.generatePaletteFromColor(seed, palateStyle.current)
      : MaterialYou.getMaterialYouPalette(FALLBACK_COLOR, palateStyle.current);

    colorSeed.current = seed || null;

    const newTheme = generateTheme(generatedPalette);
    lightTheme = newTheme.lightTheme;
    darkTheme = newTheme.darkTheme;

    if (currentColorScheme.current === 'auto') {
      const scheme = Appearance.getColorScheme() ?? 'dark';
      setInitialTheme(scheme === 'light' ? lightTheme : darkTheme);
      return;
    }
    setInitialTheme(currentColorScheme.current === 'light' ? lightTheme : darkTheme);
  };

  const setMaterialYouPaletteStyle = (generateStyle: Styles) => {
    const generatedPalette = MaterialYou.generatePaletteFromColor(colorSeed.current ?? FALLBACK_COLOR, generateStyle);

    palateStyle.current = generateStyle;

    const newTheme = generateTheme(generatedPalette);
    lightTheme = newTheme.lightTheme;
    darkTheme = newTheme.darkTheme;

    if (currentColorScheme.current === 'auto') {
      const scheme = Appearance.getColorScheme() ?? 'dark';
      setInitialTheme(scheme === 'light' ? lightTheme : darkTheme);
      return;
    }

    setInitialTheme(currentColorScheme.current === 'light' ? lightTheme : darkTheme);
  };

  useEffect(() => {
    setColorScheme(defaultTheme);
  }, []);

  return (
    <>
      <StatusBar backgroundColor='transparent' barStyle={initialTheme.isDark ? 'light-content' : 'dark-content'} translucent />
      <ThemeContext.Provider
        value={{
          ...initialTheme,
          ...{ seed: colorSeed.current },
          ...{ style: palateStyle.current },
          setColorScheme,
          setMaterialYouColor,
          setMaterialYouPaletteStyle,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </>
  );
}
