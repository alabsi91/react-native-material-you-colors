import { Platform } from 'react-native';
import Palette from './Mont/Palette';

import type { MaterialYouPalette, Styles } from './Types';

export default class MaterialYou {
  static isMaterialYouSupported: boolean = Platform.OS === 'android' && Platform.Version >= 31;

  /**
   * Generate a complete Material You palette from a single HEX color (seed color).
   *
   * Various styles are available to choose from, each of which dictates how the palette will be generated.
   *
   * **Note:** The input seed color should be in HEX format, #RRGGBB, without the alpha channel, for example, `#1b6ef3`.
   */
  static generatePaletteFromColor: (colorSeed: string, style?: Styles) => MaterialYouPalette = Palette.generate;

  /**
   * Get the Material You color palette from the Android system on the device.
   *
   * If Material You is not supported on the user's device, a color palette generated from a seed color will be returned.
   *
   * @param {string} [fallbackSeedColor='#1b6ef3'] - The seed color in HEX format, #RRGGBB, without the alpha channel (e.g., `#1b6ef3`).
   * @param {Styles} [style='TONAL_SPOT'] - Various styles are available to choose from, each of which dictates how the palette will be generated.
   */
  static getMaterialYouPalette(fallbackSeedColor = '#1b6ef3', style: Styles = 'TONAL_SPOT'): MaterialYouPalette {
    console.log(
      `"Material You" is not supported on this device, so as a fallback, a generated palette is returned from the color "${fallbackSeedColor}" .`
    );

    return MaterialYou.generatePaletteFromColor(fallbackSeedColor, style);
  }
}
