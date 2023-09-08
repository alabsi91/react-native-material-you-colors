type ShadesArr = [string, string, string, string, string, string, string, string, string, string, string, string, string];

export type MaterialYouPalette = {
  /** An array with `13` shades. */
  system_accent1: ShadesArr;
  /** An array with `13` shades. */
  system_accent2: ShadesArr;
  /** An array with `13` shades. */
  system_accent3: ShadesArr;
  /** An array with `13` shades. */
  system_neutral1: ShadesArr;
  /** An array with `13` shades. */
  system_neutral2: ShadesArr;
};

export type GenerationStyle =
  | 'SPRITZ'
  | 'TONAL_SPOT'
  | 'VIBRANT'
  | 'EXPRESSIVE'
  | 'RAINBOW'
  | 'FRUIT_SALAD'
  | 'CONTENT'
  | 'MONOCHROMATIC';

export type ColorScheme = 'light' | 'dark' | 'auto';

export type MapPaletteToThemeType = (palette: MaterialYouPalette) => {
  light: Record<string, unknown>;
  dark: Record<string, unknown>;
};

export type ThemeProviderProps = {
  /**
   * Specifies the initial color scheme for your app.
   *
   * `"auto" | "dark" | "light"`
   */
  colorScheme?: ColorScheme;
  /**
   * This is used to generate a fallback palette in case the platform does not support Material You colors.
   *
   * **Note:** provide a color only in HEX format
   */
  fallbackColor?: string;
  /**
   * If set to "auto", it tries to get the palette from the device,
   * falling back to the provided color if unsupported.
   * If set to a color (HEX only), it generates a new palette without device retrieval.
   */
  seedColor?: 'auto' | (string & NonNullable<unknown>);
  /**
   * Palette generation style.
   * The style that dictates how the palette will be generated.
   *
   * `"SPRITZ"| "TONAL_SPOT"| "VIBRANT"| "EXPRESSIVE"| "RAINBOW"| "FRUIT_SALAD"| "CONTENT"| "MONOCHROMATIC"`
   */
  generationStyle?: GenerationStyle;
  children?: React.ReactNode;
};

export type MaterialYouThemeContext = {
  /** Switch between themes (`dark` or `light`) or set to `auto` to follow system color scheme preference.*/
  setColorScheme: (value: ColorScheme) => void;
  /**
   * Generate a new Material You palette and set it as the current theme.
   * @param {string} seed
   * - The seed color. It can be `"auto"` to follow the system theme if supported;
   * otherwise, it will generate a palette using the `fallbackColor` prop.
   * If a HEX color is provided, it will generate a new palette using that seed color.
   * @param {string} style - The style that dictates how the palette will be generated.
   */
  setMaterialYouColor: (seed: 'auto' | (string & NonNullable<unknown>), style?: GenerationStyle) => void;
  /**
   * Change the palette generation style and set it as the current theme.
   *
   * **Disclaimer**: If the current Material You palette is set to `"auto"` (following the system theme), a new palette will be generated using the `fallbackColor` prop.
   * @param {string} style - The style that dictates how the palette will be generated.
   */
  setPaletteStyle: (style: GenerationStyle) => void;
  /**
   * The current seed color used to generate the palette.
   * If the palette follows the system theme, it will be `"auto"`.
   */
  seedColor: 'auto' | (string & NonNullable<unknown>);
  /** The current generation style used to generate the palette */
  style: GenerationStyle;
  /** The current palette. */
  palette: MaterialYouPalette;
};
