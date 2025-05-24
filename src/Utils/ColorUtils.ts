import { Cam } from '../Cam/Cam';
import Color from './Color';

export default class ColorUtils {
  static XYZ_WHITE_REFERENCE_X = 95.047;
  static XYZ_WHITE_REFERENCE_Y = 100;
  static XYZ_WHITE_REFERENCE_Z = 108.883;

  static constrain(amount: number, low: number, high: number) {
    return amount < low ? low : amount > high ? high : amount;
  }

  /**
   * Converts a color from CIE XYZ to its RGB representation.
   *
   * This method expects the XYZ representation to use the D65 illuminant and the CIE 2° Standard Observer (1931).
   *
   * @param x X component value [0...95.047)
   * @param y Y component value [0...100)
   * @param z Z component value [0...108.883)
   * @returns Int containing the RGB representation
   */
  static XYZToColor(x: number, y: number, z: number) {
    x = Color.clamp(x, 0, ColorUtils.XYZ_WHITE_REFERENCE_X);
    y = Color.clamp(y, 0, ColorUtils.XYZ_WHITE_REFERENCE_Y);
    z = Color.clamp(z, 0, ColorUtils.XYZ_WHITE_REFERENCE_Z);

    let r = (x * 3.2406 + y * -1.5372 + z * -0.4986) / 100;
    let g = (x * -0.9689 + y * 1.8758 + z * 0.0415) / 100;
    let b = (x * 0.0557 + y * -0.204 + z * 1.057) / 100;

    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

    return Color.rgb(
      ColorUtils.constrain(Math.round(r * 255), 0, 255),
      ColorUtils.constrain(Math.round(g * 255), 0, 255),
      ColorUtils.constrain(Math.round(b * 255), 0, 255),
    );
  }

  /**
   * Convert a color appearance model representation to an ARGB color.
   *
   * Note: the returned color may have a lower chroma than requested. Whether a chroma is available depends on luminance. For
   * example, there's no such thing as a high chroma light red, due to the limitations of our eyes and/or physics. If the
   * requested chroma is unavailable, the highest possible chroma at the requested luminance is returned.
   *
   * @param hue Hue, in degrees, in CAM coordinates
   * @param chroma Chroma in CAM coordinates.
   * @param lstar Perceptual luminance, L* in L_a_b*
   */
  static CAMToColor(hue: number, chroma: number, lstar: number) {
    return Cam.getInt(hue, chroma, lstar);
  }
}
