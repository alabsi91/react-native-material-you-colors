/*
 * This code was originally written in Java and has been converted to JavaScript.
 *
 * Original Java code source: [https://android.googlesource.com/platform/frameworks/base/+/6844741fb8351f3aa82b96ce64a1bd83ea7989bd/packages/SystemUI/monet/src/com/android/systemui/monet?autodive=0%2F]
 *
 * Copyright (C) 2021 The Android Open Source Project.
 * The original code is licensed under the Apache License, Version 2.0.
 *
 * This JavaScript version is licensed under the MIT License.
 *
 * See the respective licenses for the specific terms, permissions, and limitations.
 */

import { Cam } from '../Cam/Cam';
import Color from '../Utils/Color';
import Shades from './Shades';

import type { Styles } from 'src/Types';

type StyleType = Record<Styles, Record<'a1' | 'a2' | 'a3' | 'n1' | 'n2', [number, number]>>;

export default class Palette {
  static ACCENT1_CHROMA = 48;
  static ACCENT2_CHROMA = 16;
  static ACCENT3_CHROMA = 32;
  static ACCENT3_HUE_SHIFT = 60;
  static NEUTRAL1_CHROMA = 4;
  static NEUTRAL2_CHROMA = 8;
  static GOOGLE_BLUE = 0xff1b6ef3;

  static getStyle(hue: number, chroma: number): StyleType {
    return {
      SPRITZ: {
        a1: [hue, 12],
        a2: [hue, 8],
        a3: [hue, 16],
        n1: [hue, 2],
        n2: [hue, 2],
      },
      TONAL_SPOT: {
        a1: [hue, 36],
        a2: [hue, 16],
        a3: [Palette.HueAdd(hue, 60), 24],
        n1: [hue, 4],
        n2: [hue, 8],
      },
      VIBRANT: {
        a1: [hue, 130],
        a2: [Palette.HueVibrantSecondary(hue), 24],
        a3: [Palette.HueVibrantTertiary(hue), 32],
        n1: [hue, 10],
        n2: [hue, 12],
      },
      EXPRESSIVE: {
        a1: [Palette.HueAdd(hue, 240), 40],
        a2: [Palette.HueExpressiveSecondary(hue), 24],
        a3: [Palette.HueExpressiveTertiary(hue), 32],
        n1: [Palette.HueAdd(hue, 15), 8],
        n2: [Palette.HueAdd(hue, 15), 12],
      },
      RAINBOW: {
        a1: [hue, 48],
        a2: [hue, 16],
        a3: [Palette.HueAdd(hue, 60), 24],
        n1: [hue, 0],
        n2: [hue, 0],
      },
      FRUIT_SALAD: {
        a1: [Palette.HueSubtract(hue, 50), 48],
        a2: [Palette.HueSubtract(hue, 50), 36],
        a3: [hue, 36],
        n1: [hue, 10],
        n2: [hue, 16],
      },
      CONTENT: {
        a1: [hue, chroma],
        a2: [hue, Palette.ChromaMultiple(chroma, 0.33)],
        a3: [hue, Palette.ChromaMultiple(chroma, 0.66)],
        n1: [hue, Palette.ChromaMultiple(chroma, 0.0833)],
        n2: [hue, Palette.ChromaMultiple(chroma, 0.1666)],
      },
      MONOCHROMATIC: {
        a1: [hue, 0],
        a2: [hue, 0],
        a3: [hue, 0],
        n1: [hue, 0],
        n2: [hue, 0],
      },
    };
  }

  static HueAdd(hue: number, amountDegrees: number): number {
    return Palette.wrapDegreesDouble(hue + amountDegrees);
  }

  static HueSubtract(hue: number, amountDegrees: number): number {
    return Palette.wrapDegreesDouble(hue - amountDegrees);
  }

  static ChromaMultiple(chroma: number, multiple: number): number {
    return chroma * multiple;
  }

  static getHueRotation(sourceHue: number, hueAndRotations: Array<[number, number]>): number {
    const sanitizedSourceHue = sourceHue < 0 || sourceHue >= 360 ? 0 : sourceHue;

    for (let i = 0; i < hueAndRotations.length - 1; i++) {
      const thisHue = hueAndRotations[i]![0];
      const nextHue = hueAndRotations[i + 1]![0];

      if (thisHue <= sanitizedSourceHue && sanitizedSourceHue < nextHue) {
        return Palette.wrapDegreesDouble(sanitizedSourceHue + hueAndRotations[i]![1]);
      }
    }

    // If this statement executes, something is wrong, there should have been a rotation
    // found using the arrays.
    return sourceHue;
  }

  static HueVibrantSecondary(hue: number) {
    const hueToRotations: Array<[number, number]> = [
      [0, 18],
      [41, 15],
      [61, 10],
      [101, 12],
      [131, 15],
      [181, 18],
      [251, 15],
      [301, 12],
      [360, 12],
    ];

    return Palette.getHueRotation(hue, hueToRotations);
  }

  static HueVibrantTertiary(hue: number) {
    const hueToRotations: Array<[number, number]> = [
      [0, 35],
      [41, 30],
      [61, 20],
      [101, 25],
      [131, 30],
      [181, 35],
      [251, 30],
      [301, 25],
      [360, 25],
    ];

    return Palette.getHueRotation(hue, hueToRotations);
  }

  static HueExpressiveSecondary(hue: number) {
    const hueToRotations: Array<[number, number]> = [
      [0, 45],
      [21, 95],
      [51, 45],
      [121, 20],
      [151, 45],
      [191, 90],
      [271, 45],
      [321, 45],
      [360, 45],
    ];

    return Palette.getHueRotation(hue, hueToRotations);
  }

  static HueExpressiveTertiary(hue: number) {
    const hueToRotations: Array<[number, number]> = [
      [0, 120],
      [21, 120],
      [51, 20],
      [121, 45],
      [151, 20],
      [191, 15],
      [271, 20],
      [321, 120],
      [360, 120],
    ];

    return Palette.getHueRotation(hue, hueToRotations);
  }

  static wrapDegreesDouble(degrees: number): number {
    if (degrees < 0) {
      return (degrees % 360) + 360;
    } else if (degrees >= 360) {
      return degrees % 360;
    } else {
      return degrees;
    }
  }

  static generate(seed: string, style: Styles = 'TONAL_SPOT') {
    // Parse the HEX seed color string into an integer
    seed = seed.toUpperCase().substring(1, 7);
    const colorInt = parseInt('0xff' + seed, 16);

    let seedArgb;
    if (colorInt === Color.TRANSPARENT) {
      seedArgb = Palette.GOOGLE_BLUE;
    } else {
      seedArgb = colorInt;
    }

    const camSeed = Cam.fromInt(seedArgb),
      hue = camSeed.getHue(),
      chroma = Math.max(camSeed.getChroma(), Palette.ACCENT1_CHROMA);

    const { a1, a2, a3, n1, n2 } = Palette.getStyle(hue, chroma)[style];

    const accent1 = Shades.of(a1[0], a1[1]),
      accent2 = Shades.of(a2[0], a2[1]),
      accent3 = Shades.of(a3[0], a3[1]),
      neutral1 = Shades.of(n1[0], n1[1]),
      neutral2 = Shades.of(n2[0], n2[1]);

    const numberToHexColor = (colorNumber: number) => {
      return '#' + (colorNumber & 0xffffff).toString(16).padStart(6, '0').toUpperCase();
    };

    const results = {
      system_accent1: accent1.map(numberToHexColor),
      system_accent2: accent2.map(numberToHexColor),
      system_accent3: accent3.map(numberToHexColor),
      system_neutral1: neutral1.map(numberToHexColor),
      system_neutral2: neutral2.map(numberToHexColor),
    };

    return results;
  }
}
