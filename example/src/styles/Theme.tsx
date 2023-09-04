import MaterialYou from 'react-native-material-you-colors';

import type { MaterialYouPalette } from 'react-native-material-you-colors';

/**
 * The function generates a light theme and a dark theme using a given MaterialYouPalette.
 * @param {MaterialYouPalette} palette - The `palette` parameter is of type `MaterialYouPalette`. It is
 * an object that contains various color shades used in the Material You color system.
 * @returns an object that contains two properties: `light` and `dark`.
 */
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
