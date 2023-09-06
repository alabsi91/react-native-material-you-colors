import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { Appearance } from 'react-native';
import type {
  ColorScheme,
  GenerationStyle,
  MapPaletteToThemeType,
  MaterialYouPalette,
  MaterialYouThemeContext,
  ThemeProviderProps,
} from './Types';

import { getPalletteFromAndroid, isMaterialYouSupported } from './MaterialYouColors';
import Palette from './Monet/Palette';

import type { NativeEventSubscription } from 'react-native';

export * from './Types';

export default class MaterialYou {
  static isSupported = isMaterialYouSupported;

  /**
   * Generate a complete Material You palette from a single HEX color (seed color).
   *
   * Various styles are available to choose from, each of which dictates how the palette will be generated.
   *
   * **Note:** The input seed color should be in HEX format, #RRGGBB, without the alpha channel, for example, `#1b6ef3`.
   */
  static generatePaletteFromColor: (colorSeed: string, style?: GenerationStyle) => MaterialYouPalette = Palette.generate;

  static createThemeContext<T extends MapPaletteToThemeType>(mapPaletteToTheme: T) {
    // This is solely for testing the `mapPaletteToTheme` callback function before initialization.
    let tmp = mapPaletteToTheme({
      system_accent1: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
      system_accent2: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
      system_accent3: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
      system_neutral1: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
      system_neutral2: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
    });

    if (!('light' in tmp) || !('dark' in tmp)) {
      throw "[createThemeContext] The `mapPaletteToTheme` function should return an object with the 'light' and 'dark' keys.";
    }

    if (typeof tmp.dark !== 'object' || typeof tmp.light !== 'object') {
      throw "[createThemeContext] the 'light' and 'dark' properties should hold an object as their values.";
    }

    if (
      !Object.keys(tmp.dark).every(e => Object.keys(tmp.light).includes(e)) ||
      !Object.keys(tmp.light).every(e => Object.keys(tmp.dark).includes(e))
    ) {
      throw "[createThemeContext] the 'light' and 'dark' Objects do not have the same keys.";
    }

    // empty the variable
    tmp = undefined as never;

    type UserThemeType = ReturnType<T>['light'];
    type ThemeContextType = UserThemeType & MaterialYouThemeContext;

    const ThemeContext = createContext<ThemeContextType>(null!);

    const ThemeProvider = ({
      colorScheme = 'auto',
      fallbackColor = '#1b6ef3',
      generationStyle = 'TONAL_SPOT',
      seedColor = 'auto',
      children,
    }: ThemeProviderProps) => {
      // While it may not be ideal and may appear ugly,
      // it is necessary to prevent calling `mapPaletteToTheme` on every `setState` operation.
      const theme = useRef(
        useMemo(() => {
          return mapPaletteToTheme(
            seedColor === 'auto'
              ? MaterialYou.getMaterialYouPalette(fallbackColor, generationStyle)
              : MaterialYou.generatePaletteFromColor(seedColor, generationStyle)
          );
        }, [])
      ).current;

      const [currentTheme, setCurrentTheme] = useState<UserThemeType>(
        colorScheme === 'auto' ? theme[Appearance.getColorScheme() ?? 'light'] : theme[colorScheme]
      );

      // to keep track
      const themeSettings = useRef({
        colorScheme,
        seedColor,
        generationStyle,
      }).current;

      // The listener if the color scheme is set to "auto".
      const colorSchemeListener = useRef<NativeEventSubscription>(null!);

      const setColorScheme = (value: ColorScheme) => {
        themeSettings.colorScheme = value;

        // "auto" means following the system color scheme.
        // To achieve this, we should add an event listener to change the theme accordingly.
        if (value === 'auto') {
          setCurrentTheme(theme[Appearance.getColorScheme() ?? 'light']);

          // add color scheme listener
          if (colorSchemeListener.current) colorSchemeListener.current.remove();
          colorSchemeListener.current = Appearance.addChangeListener(({ colorScheme: scheme }) => {
            setCurrentTheme(theme[scheme ?? 'light']);
          });

          return;
        }

        setCurrentTheme(theme[value]);

        // remove color scheme listener
        colorSchemeListener.current?.remove();
      };

      const setMaterialYouColor = (
        seed: 'auto' | (string & NonNullable<unknown>),
        style: GenerationStyle = themeSettings.generationStyle
      ) => {
        const generatedPalette =
          seed === 'auto'
            ? MaterialYou.getMaterialYouPalette(fallbackColor, style)
            : MaterialYou.generatePaletteFromColor(seed, style);

        themeSettings.seedColor = seed;
        // If the seed is set to "auto", use the Android system's default 'TONAL_SPOT' style.
        themeSettings.generationStyle = seed === 'auto' ? 'TONAL_SPOT' : style;

        const newTheme = mapPaletteToTheme(generatedPalette);
        theme.light = newTheme.light;
        theme.dark = newTheme.dark;

        if (themeSettings.colorScheme === 'auto') {
          setCurrentTheme(theme[Appearance.getColorScheme() ?? 'light']);
          return;
        }

        setCurrentTheme(theme[themeSettings.colorScheme]);
      };

      const setPaletteStyle = (style: GenerationStyle) => {
        const generatedPalette = MaterialYou.generatePaletteFromColor(
          themeSettings.seedColor === 'auto' ? (seedColor !== 'auto' ? seedColor : fallbackColor) : themeSettings.seedColor,
          style
        );

        themeSettings.generationStyle = style;
        // After changing the generation style, the palette is generated and no longer derived from the system.
        if (themeSettings.seedColor === 'auto') themeSettings.seedColor = seedColor !== 'auto' ? seedColor : fallbackColor;

        const newTheme = mapPaletteToTheme(generatedPalette);
        theme.light = newTheme.light;
        theme.dark = newTheme.dark;

        if (themeSettings.colorScheme === 'auto') {
          setCurrentTheme(theme[Appearance.getColorScheme() ?? 'light']);
          return;
        }

        setCurrentTheme(theme[themeSettings.colorScheme]);
      };

      return (
        <ThemeContext.Provider
          value={{
            ...currentTheme,
            ...{ seedColor: themeSettings.seedColor, style: themeSettings.generationStyle },
            setColorScheme,
            setMaterialYouColor,
            setPaletteStyle,
          }}
        >
          {children}
        </ThemeContext.Provider>
      );
    };

    const useMaterialYouTheme = () => {
      const context = useContext(ThemeContext);
      if (context) return context;
      throw new Error('[useMaterialYouTheme] must be used within a [ThemeProvider]. Make sure to wrap your app with it.');
    };

    return { useMaterialYouTheme, ThemeProvider };
  }

  /**
   * Get the Material You color palette from the Android system on the device.
   *
   * If Material You is not supported on the user's device, a color palette generated from a seed color will be returned.
   *
   * @param {string} [fallbackSeedColor='#1b6ef3'] - The seed color in HEX format, #RRGGBB, without the alpha channel (e.g., `#1b6ef3`).
   * @param {GenerationStyle} [style='TONAL_SPOT'] - Various styles are available to choose from, each of which dictates how the palette will be generated.
   */
  static getMaterialYouPalette(fallbackSeedColor = '#1b6ef3', style: GenerationStyle = 'TONAL_SPOT'): MaterialYouPalette {
    if (MaterialYou.isSupported && getPalletteFromAndroid) return getPalletteFromAndroid?.();

    if (__DEV__)
      console.log(
        `"Material You" is not supported on this device, A fallback palette has been generated using the seed color "${fallbackSeedColor}" .`
      );

    return MaterialYou.generatePaletteFromColor(fallbackSeedColor, style);
  }
}
