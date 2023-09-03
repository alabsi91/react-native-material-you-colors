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

export type Styles = 'SPRITZ' | 'TONAL_SPOT' | 'VIBRANT' | 'EXPRESSIVE' | 'RAINBOW' | 'FRUIT_SALAD' | 'CONTENT' | 'MONOCHROMATIC';
