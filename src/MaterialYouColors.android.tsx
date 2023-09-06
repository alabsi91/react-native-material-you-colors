import { NativeModules, Platform } from 'react-native';

import type { MaterialYouPalette } from './Types';

// @ts-expect-error any
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const MaterialYouColorsModule = isTurboModuleEnabled
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./NativeMaterialYouColors').default
  : NativeModules?.MaterialYouColors;

const MaterialYouColors = MaterialYouColorsModule || null;

if (!MaterialYouColors) {
  const LINKING_ERROR =
    "\n...\n\nThe package 'react-native-material-you-colors' doesn't seem to be linked. Make sure: \n" +
    '- You rebuilt the app after installing the package.\n' +
    '- You are not using Expo Go.\n\n' +
    'If you are using Expo, please note that the native side of the library (for obtaining the Android Material You color palette)\n' +
    'may not work in the Expo Go app. However, it should work as expected in the production build.\n\n...';
  console.error(LINKING_ERROR);
}

export const isMaterialYouSupported = Platform.OS === 'android' && Platform.Version >= 31 && MaterialYouColors;
export const getPalletteFromAndroid: null | (() => MaterialYouPalette) = MaterialYouColors?.getColors;
