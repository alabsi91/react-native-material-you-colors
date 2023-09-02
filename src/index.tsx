import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-material-you-colors' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const MaterialYouColorsModule = isTurboModuleEnabled
  ? require('./NativeMaterialYouColors').default
  : NativeModules.MaterialYouColors;

const MaterialYouColors = MaterialYouColorsModule
  ? MaterialYouColorsModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return MaterialYouColors.multiply(a, b);
}
