/*
 * This code was originally written in Java and has been converted to JavaScript.
 *
 * Original Java code source: [https://android.googlesource.com/platform/frameworks/base/+/6844741fb8351f3aa82b96ce64a1bd83ea7989bd/packages/SystemUI/monet/src/com/android/systemui/monet?autodive=0%2F]
 *
 * Copyright (C) 2021 The Android Open Source Project.
 * The original code is licensed under the Apache License, Version 2.0 (the "License").
 *
 * This JavaScript version is licensed under the MIT License.
 *
 * See the respective licenses for the specific terms, permissions, and limitations.
 */

import ColorUtils from '../Utils/ColorUtils';

export default class Shades {
  /**
   * Combining the ability to convert between relative luminance and perceptual luminance with
   * contrast leads to a design system that can be based on a linear value to determine contrast,
   * rather than a ratio.
   *
   * This codebase implements a design system that has that property, and as a result, we can
   * guarantee that any shades 5 steps from each other have a contrast ratio of at least 4.5.
   * 4.5 is the requirement for smaller text contrast in WCAG 2.1 and earlier.
   *
   * However, lstar 50 does _not_ have a contrast ratio >= 4.5 with lstar 100.
   * lstar 49.6 is the smallest lstar that will lead to a contrast ratio >= 4.5 with lstar 100,
   * and it also contrasts >= 4.5 with lstar 100.
   */
  static MIDDLE_LSTAR = 49.6;

  /**
   * Generate shades of a color. Ordered in lightness _descending_.
   * The first shade will be at 95% lightness, the next at 90, 80, etc. through 0.
   *
   * @param hue    hue in CAM16 color space
   * @param chroma chroma in CAM16 color space
   * @return shades of a color, as argb integers. Ordered by lightness descending.
   */
  static of(hue: number, chroma: number) {
    const shades: number[] = [];

    // At tone 90 and above, blue and yellow hues can reach a much higher chroma.
    // To preserve a consistent appearance across all hues, use a maximum chroma of 40.
    shades[0] = ColorUtils.CAMToColor(hue, Math.min(40, chroma), 99);
    shades[1] = ColorUtils.CAMToColor(hue, Math.min(40, chroma), 95);

    for (let i = 2; i < 12; i++) {
      const lStar = i === 6 ? Shades.MIDDLE_LSTAR : 100 - 10 * (i - 1);
      if (lStar >= 90) {
        chroma = Math.min(40, chroma);
      }
      shades[i] = ColorUtils.CAMToColor(hue, chroma, lStar);
    }

    shades.unshift(16777215); // first color is always pure white

    return shades;
  }
}
