/*
 * This code was originally written in Java and has been converted to JavaScript.
 *
 * Original Java code source: [https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/com/android/internal/graphics/cam]
 *
 * Copyright (C) 2021 The Android Open Source Project.
 * The original code is licensed under the Apache License, Version 2.0.
 *
 * This JavaScript version is licensed under the MIT License.
 *
 * See the respective licenses for the specific terms, permissions, and limitations.
 */

import MathUtils from '../Utils/MathUtils';
import Color from '../Utils/Color';
import ColorUtils from '../Utils/ColorUtils';
import HctSolver from './HctSolver';

/**
 * A color appearance model, based on CAM16, extended to use L* as the lightness dimension, and
 * coupled to a gamut mapping algorithm. Creates a color system, enables a digital design system.
 */
export class Cam {
  // When the delta between the floor & ceiling of a binary search for chroma is less than this,
  // the binary search terminates.
  static CHROMA_SEARCH_ENDPOINT = 0.4;

  // When the delta between the floor & ceiling of a binary search for J, lightness in CAM16,
  // is less than this, the binary search terminates.
  static LIGHTNESS_SEARCH_ENDPOINT = 0.01;

  // The maximum difference between the requested L* and the L* returned.
  static DL_MAX = 0.2;

  // The maximum color distance, in CAM16-UCS, between a requested color and the color returned.
  static DE_MAX = 1;

  /** The maximum difference between the requested L* and the L* returned. */
  DL_MAX = 0.2;
  /**
   *  When the delta between the floor & ceiling of a binary search for chroma is less than this,
   * the binary search terminates.
   */
  CHROMA_SEARCH_ENDPOINT = 0.4;
  /**
   * When the delta between the floor & ceiling of a binary search for J, lightness in CAM16,
   * is less than this, the binary search terminates.
   */
  LIGHTNESS_SEARCH_ENDPOINT = 0.01;
  /**
   * sRGB specification has D65 whitepoint - Stokes, Anderson, Chandrasekar, Motta - A Standard
   * Default Color Space for the Internet: sRGB, 1996
   */
  WHITE_POINT_D65: [number, number, number] = [95.047, 100, 108.883];

  // CAM16 color dimensions, see getters for documentation.
  mHue: number;
  mChroma: number;
  mJ: number;
  mQ: number;
  mM: number;
  mS: number;

  // Coordinates in UCS space. Used to determine color distance, like delta E equations in L*a*b*.
  mJstar: number;
  mAstar: number;
  mBstar: number;

  constructor(
    hue: number,
    chroma: number,
    j: number,
    q: number,
    m: number,
    s: number,
    jstar: number,
    astar: number,
    bstar: number
  ) {
    this.mHue = hue;
    this.mChroma = chroma;
    this.mJ = j;
    this.mQ = q;
    this.mM = m;
    this.mS = s;
    this.mJstar = jstar;
    this.mAstar = astar;
    this.mBstar = bstar;
  }

  /** Hue in CAM16 */
  getHue() {
    return this.mHue;
  }

  /** Chroma in CAM16 */
  getChroma() {
    return this.mChroma;
  }

  /** Lightness in CAM16 */
  getJ() {
    return this.mJ;
  }

  /** a* coordinate in CAM16-UCS */
  getAstar() {
    return this.mAstar;
  }

  /** Lightness coordinate in CAM16-UCS */
  getJstar() {
    return this.mJstar;
  }

  /** b* coordinate in CAM16-UCS */
  getBstar() {
    return this.mBstar;
  }

  /**
   * Create a CAM from lightness, chroma, and hue coordinates. It is assumed those coordinates
   * were measured in the sRGB standard frame.
   */
  static fromJch(j: number, c: number, h: number) {
    return Cam.fromJchInFrame(j, c, h);
  }

  /**
   * Create a CAM from lightness, chroma, and hue coordinates, and also specify the frame in which
   * the color is being viewed.
   */
  static fromJchInFrame(j: number, c: number, h: number) {
    const q = (4 / Frame.DEFAULT.getC()) * Math.sqrt(j / 100) * (Frame.DEFAULT.getAw() + 4) * Frame.DEFAULT.getFlRoot();
    const m = c * Frame.DEFAULT.getFlRoot();
    const alpha = c / Math.sqrt(j / 100);
    const s = 50 * Math.sqrt((alpha * Frame.DEFAULT.getC()) / (Frame.DEFAULT.getAw() + 4));

    const hueRadians = (h * Math.PI) / 180;
    const jstar = ((1 + 100 * 0.007) * j) / (1 + 0.007 * j);
    const mstar = (1 / 0.0228) * Math.log(1 + 0.0228 * m);
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);
    return new Cam(h, c, j, q, m, s, jstar, astar, bstar);
  }

  /** Returns perceived color as an ARGB integer, as viewed in standard sRGB frame. */
  viewedInSrgb() {
    return this.viewed(Frame.DEFAULT);
  }

  /** Returns color perceived in a frame as an ARGB integer. */
  viewed(frame: Frame) {
    const alpha = this.getChroma() === 0 || this.getJ() === 0 ? 0 : this.getChroma() / Math.sqrt(this.getJ() / 100);

    const t = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, frame.getN()), 0.73), 1 / 0.9),
      hRad = (this.getHue() * Math.PI) / 180;

    const eHue = 0.25 * (Math.cos(hRad + 2) + 3.8),
      ac = frame.getAw() * Math.pow(this.getJ() / 100, 1 / frame.getC() / frame.getZ()),
      p1 = eHue * (50000 / 13) * frame.getNc() * frame.getNcb(),
      p2 = ac / frame.getNbb();

    const hSin = Math.sin(hRad),
      hCos = Math.cos(hRad);

    const gamma = (23 * (p2 + 0.305) * t) / (23 * p1 + 11 * t * hCos + 108 * t * hSin),
      a = gamma * hCos,
      b = gamma * hSin,
      rA = (460 * p2 + 451 * a + 288 * b) / 1403,
      gA = (460 * p2 - 891 * a - 261 * b) / 1403,
      bA = (460 * p2 - 220 * a - 6300 * b) / 1403;

    const rCBase = Math.max(0, (27.13 * Math.abs(rA)) / (400 - Math.abs(rA))),
      rC = Math.sign(rA) * (100 / frame.getFl()) * Math.pow(rCBase, 1 / 0.42),
      gCBase = Math.max(0, (27.13 * Math.abs(gA)) / (400 - Math.abs(gA))),
      gC = Math.sign(gA) * (100 / frame.getFl()) * Math.pow(gCBase, 1 / 0.42),
      bCBase = Math.max(0, (27.13 * Math.abs(bA)) / (400 - Math.abs(bA))),
      bC = Math.sign(bA) * (100 / frame.getFl()) * Math.pow(bCBase, 1 / 0.42),
      rF = rC / frame.getRgbD()[0],
      gF = gC / frame.getRgbD()[1],
      bF = bC / frame.getRgbD()[2];

    const matrix = CamUtils.CAM16RGB_TO_XYZ,
      x = rF * matrix[0][0] + gF * matrix[0][1] + bF * matrix[0][2],
      y = rF * matrix[1][0] + gF * matrix[1][1] + bF * matrix[1][2],
      z = rF * matrix[2][0] + gF * matrix[2][1] + bF * matrix[2][2];

    return ColorUtils.XYZToColor(x, y, z);
  }

  /**
   * Distance in CAM16-UCS space between two colors.
   *
   * Much like L*a*b* was designed to measure distance between colors, the CAM16 standard
   * defined a color space called CAM16-UCS to measure distance between CAM16 colors.
   */
  distance(other: Cam) {
    const dJ = this.getJstar() - other.getJstar(),
      dA = this.getAstar() - other.getAstar(),
      dB = this.getBstar() - other.getBstar(),
      dEPrime = Math.sqrt(dJ * dJ + dA * dA + dB * dB),
      dE = 1.41 * Math.pow(dEPrime, 0.63);
    return dE;
  }

  /**
   * Find J, lightness in CAM16 color space, that creates a color with L* = `lstar` in the L*a*b* color space.
   * Returns null if no J could be found that generated a color with L* `lstar`.
   */
  static findCamByJ(hue: number, chroma: number, lstar: number) {
    let low = 0,
      high = 100,
      mid,
      bestdL = 1000,
      bestdE = 1000;

    let bestCam: Cam | null = null;
    while (Math.abs(low - high) > Cam.LIGHTNESS_SEARCH_ENDPOINT) {
      mid = low + (high - low) / 2;

      // Create the intended CAM color
      const camBeforeClip = Cam.fromJch(mid, chroma, hue);

      // Convert the CAM color to RGB. If the color didn't fit in RGB, during the conversion,
      // the initial RGB values will be outside 0 to 255. The final RGB values are clipped to
      // 0 to 255, distorting the intended color.
      const clipped = camBeforeClip.viewedInSrgb();
      const clippedLstar = CamUtils.lstarFromInt(clipped);
      const dL = Math.abs(lstar - clippedLstar);

      // If the clipped color's L* is within error margin...
      if (dL < Cam.DL_MAX) {
        // ...check if the CAM equivalent of the clipped color is far away from intended CAM
        // color. For the intended color, use lightness and chroma from the clipped color,
        // and the intended hue. Callers are wondering what the lightness is, they know
        // chroma may be distorted, so the only concern here is if the hue slipped too far.
        const camClipped = Cam.fromInt(clipped);
        const dE = camClipped.distance(Cam.fromJch(camClipped.getJ(), camClipped.getChroma(), hue));
        if (dE <= Cam.DE_MAX) {
          bestdL = dL;
          bestdE = dE;
          bestCam = camClipped;
        }
      }

      // If there's no error at all, there's no need to search more.
      //
      // Note: this happens much more frequently than expected, but this is a very delicate
      // property which relies on extremely precise sRGB <=> XYZ calculations, as well as fine
      // tuning of the constants that determine error margins and when the binary search can
      // terminate.
      if (bestdL === 0 && bestdE === 0) {
        break;
      }

      if (clippedLstar < lstar) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return bestCam;
  }

  /**
   * Given a hue & chroma in CAM16, L* in L*a*b*, return an ARGB integer. The chroma of the color
   * returned may, and frequently will, be lower than requested. Assumes the color is viewed in
   * the frame defined by the sRGB standard.
   */
  static getInt(hue: number, chroma: number, lstar: number) {
    return Cam.getInt_(hue, chroma, lstar, Frame.DEFAULT);
  }

  /**
   * Given a hue & chroma in CAM16, L* in L*a*b*, and the frame in which the color will be viewed,
   * return an ARGB integer.
   *
   * The chroma of the color returned may, and frequently will, be lower than requested.
   * This is a fundamental property of color that cannot be worked around by engineering.
   * For example, a red hue, with high chroma, and high L* does not exist: red hues have a maximum chroma below 10
   * in light shades, creating pink.
   */
  static getInt_(hue: number, chroma: number, lstar: number, frame: Frame) {
    // This is a crucial routine for building a color system, CAM16 itself is not sufficient.
    //
    // * Why these dimensions?
    // Hue and chroma from CAM16 are used because they're the most accurate measures of those
    // quantities. L* from L*a*b* is used because it correlates with luminance, luminance is
    // used to measure contrast for a11y purposes, thus providing a key constraint on what
    // colors
    // can be used.
    //
    // * Why is this routine required to build a color system?
    // In all perceptually accurate color spaces (i.e. L*a*b* and later), `chroma` may be
    // impossible for a given `hue` and `lstar`.
    // For example, a high chroma light red does not exist - chroma is limited to below 10 at
    // light red shades, we call that pink. High chroma light green does exist, but not dark
    // Also, when converting from another color space to RGB, the color may not be able to be
    // represented in RGB. In those cases, the conversion process ends with RGB values
    // outside 0-255
    // The vast majority of color libraries surveyed simply round to 0 to 255. That is not an
    // option for this library, as it distorts the expected luminance, and thus the expected
    // contrast needed for a11y
    //
    // * What does this routine do?
    // Dealing with colors in one color space not fitting inside RGB is, loosely referred to as
    // gamut mapping or tone mapping. These algorithms are traditionally idiosyncratic, there is
    // no universal answer. However, because the intent of this library is to build a system for
    // digital design, and digital design uses luminance to measure contrast/a11y, we have one
    // very important constraint that leads to an objective algorithm: the L* of the returned
    // color _must_ match the requested L*.
    //
    // Intuitively, if the color must be distorted to fit into the RGB gamut, and the L*
    // requested *must* be fulfilled, than the hue or chroma of the returned color will need
    // to be different from the requested hue/chroma.
    //
    // After exploring both options, it was more intuitive that if the requested chroma could
    // not be reached, it used the highest possible chroma. The alternative was finding the
    // closest hue where the requested chroma could be reached, but that is not nearly as
    // intuitive, as the requested hue is so fundamental to the color description.

    // If the color doesn't have meaningful chroma, return a gray with the requested Lstar.
    //
    // Yellows are very chromatic at L = 100, and blues are very chromatic at L = 0. All the
    // other hues are white at L = 100, and black at L = 0. To preserve consistency for users of
    // this system, it is better to simply return white at L* > 99, and black and L* < 0.
    if (frame === Frame.DEFAULT) {
      // If the viewing conditions are the same as the default sRGB-like viewing conditions,
      // skip to using HctSolver: it uses geometrical insights to find the closest in-gamut
      // match to hue/chroma/lstar.
      return HctSolver.solveToInt(hue, chroma, lstar);
    }

    if (chroma < 1 || Math.round(lstar) <= 0 || Math.round(lstar) >= 100) {
      return CamUtils.intFromLstar(lstar);
    }

    hue = hue < 0 ? 0 : Math.min(360, hue);

    // The highest chroma possible. Updated as binary search proceeds.
    let high = chroma;

    // The guess for the current binary search iteration. Starts off at the highest chroma,
    // thus, if a color is possible at the requested chroma, the search can stop after one try.
    let mid = chroma;
    let low = 0;
    let isFirstLoop = true;

    let answer: Cam | null = null;

    while (Math.abs(low - high) >= Cam.CHROMA_SEARCH_ENDPOINT) {
      // Given the current chroma guess, mid, and the desired hue, find J, lightness in
      // CAM16 color space, that creates a color with L* = `lstar` in the L*a*b* color space.
      const possibleAnswer = Cam.findCamByJ(hue, mid, lstar);

      if (isFirstLoop) {
        if (possibleAnswer != null) {
          return possibleAnswer.viewed(frame);
        } else {
          // If this binary search iteration was the first iteration, and this point
          // has been reached, it means the requested chroma was not available at the
          // requested hue and L*.
          // Proceed to a traditional binary search that starts at the midpoint between
          // the requested chroma and 0.
          isFirstLoop = false;
          mid = low + (high - low) / 2;
          continue;
        }
      }

      if (possibleAnswer == null) {
        // There isn't a CAM16 J that creates a color with L* `lstar`. Try a lower chroma.
        high = mid;
      } else {
        answer = possibleAnswer;
        // It is possible to create a color. Try higher chroma.
        low = mid;
      }

      mid = low + (high - low) / 2;
    }

    // There was no answer: meaning, for the desired hue, there was no chroma low enough to
    // generate a color with the desired L*.
    // All values of L* are possible when there is 0 chroma. Return a color with 0 chroma, i.e.
    // a shade of gray, with the desired L*.
    if (answer == null) {
      return CamUtils.intFromLstar(lstar);
    }

    return answer.viewed(frame);
  }

  static intFromLstar(lstar: number) {
    if (lstar < 1) {
      return 0xff000000;
    } else if (lstar > 99) {
      return 0xffffffff;
    }

    // XYZ to LAB conversion routine, assume a and b are 0.
    const fy = (lstar + 16) / 116;

    // fz = fx = fy because a and b are 0
    const fz = fy,
      fx = fy;

    const kappa = 24389 / 27,
      epsilon = 216 / 24389,
      lExceedsEpsilonKappa = lstar > 8,
      yT = lExceedsEpsilonKappa ? fy * fy * fy : lstar / kappa,
      cubeExceedEpsilon = fy * fy * fy > epsilon,
      xT = cubeExceedEpsilon ? fx * fx * fx : (116 * fx - 16) / kappa,
      zT = cubeExceedEpsilon ? fz * fz * fz : (116 * fx - 16) / kappa;

    return ColorUtils.XYZToColor(
      xT * CamUtils.WHITE_POINT_D65[0],
      yT * CamUtils.WHITE_POINT_D65[1],
      zT * CamUtils.WHITE_POINT_D65[2]
    );
  }

  static fromIntInFrame(argb: number, frame: Frame) {
    // Transform ARGB int to XYZ
    const xyz: [number, number, number] = CamUtils.xyzFromInt(argb);

    // Transform XYZ to 'cone'/'rgb' responses
    const matrix = CamUtils.XYZ_TO_CAM16RGB,
      rT: number = xyz[0] * matrix[0][0] + xyz[1] * matrix[0][1] + xyz[2] * matrix[0][2],
      gT: number = xyz[0] * matrix[1][0] + xyz[1] * matrix[1][1] + xyz[2] * matrix[1][2],
      bT: number = xyz[0] * matrix[2][0] + xyz[1] * matrix[2][1] + xyz[2] * matrix[2][2];

    // Discount illuminant
    const rD = frame.getRgbD()[0] * rT,
      gD = frame.getRgbD()[1] * gT,
      bD = frame.getRgbD()[2] * bT;

    // Chromatic adaptation
    const rAF = Math.pow((frame.getFl() * Math.abs(rD)) / 100, 0.42),
      gAF = Math.pow((frame.getFl() * Math.abs(gD)) / 100, 0.42),
      bAF = Math.pow((frame.getFl() * Math.abs(bD)) / 100, 0.42),
      rA = (Math.sign(rD) * 400 * rAF) / (rAF + 27.13),
      gA = (Math.sign(gD) * 400 * gAF) / (gAF + 27.13),
      bA = (Math.sign(bD) * 400 * bAF) / (bAF + 27.13);

    // redness-greennes
    const a = (11 * rA + -12 * gA + bA) / 11;
    // yellowness-blueness
    const b = (rA + gA - 2 * bA) / 9;

    // auxiliary components
    const u = (20 * rA + 20 * gA + 21 * bA) / 20,
      p2 = (40 * rA + 20 * gA + bA) / 20;

    // hue
    const atan2 = Math.atan2(b, a),
      atanDegrees = (atan2 * 180) / Math.PI,
      hue = atanDegrees < 0 ? atanDegrees + 360 : atanDegrees >= 360 ? atanDegrees - 360 : atanDegrees,
      hueRadians = (hue * Math.PI) / 180;

    // achromatic response to color
    const ac = p2 * frame.getNbb();

    // CAM16 lightness and brightness
    const j = 100 * Math.pow(ac / frame.getAw(), frame.getC() * frame.getZ());
    const q = (4 / frame.getC()) * Math.sqrt(j / 100) * (frame.getAw() + 4) * frame.getFlRoot();

    // CAM16 chroma, colorfulness, and saturation.
    const huePrime = hue < 20.14 ? hue + 360 : hue,
      eHue = 0.25 * (Math.cos((huePrime * Math.PI) / 180 + 2) + 3.8),
      p1 = (50000 / 13) * eHue * frame.getNc() * frame.getNcb(),
      t = (p1 * Math.sqrt(a * a + b * b)) / (u + 0.305),
      alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, frame.getN()), 0.73);

    // CAM16 chroma, colorfulness, saturation
    const c = alpha * Math.sqrt(j / 100),
      m = c * frame.getFlRoot(),
      s = 50 * Math.sqrt((alpha * frame.getC()) / (frame.getAw() + 4));

    // CAM16-UCS components
    const jstar = ((1 + 100 * 0.007) * j) / (1 + 0.007 * j),
      mstar = (1 / 0.0228) * Math.log(1 + 0.0228 * m),
      astar = mstar * Math.cos(hueRadians),
      bstar = mstar * Math.sin(hueRadians);

    return new Cam(hue, c, j, q, m, s, jstar, astar, bstar);
  }

  /**
   * Create a color appearance model from a ARGB integer representing a color. It is assumed the
   * color was viewed in the frame defined in the sRGB standard.
   */
  static fromInt(argb: number) {
    return Cam.fromIntInFrame(argb, Frame.DEFAULT);
  }
}

/**
 * Collection of methods for transforming between color spaces.
 *
 * Methods are named $xFrom$Y. For example, lstarFromInt() returns L* from an ARGB integer.
 *
 * These methods, generally, convert colors between the L*a*b*, XYZ, and sRGB spaces.
 *
 * L*a*b* is a perceptually accurate color space. This is particularly important in the L*
 * dimension: it measures luminance and unlike lightness measures traditionally used in UI work via
 * RGB or HSL, this luminance transitions smoothly, permitting creation of pleasing shades of a
 * color, and more pleasing transitions between colors.
 *
 * XYZ is commonly used as an intermediate color space for converting between one color space to
 * another. For example, to convert RGB to L*a*b*, first RGB is converted to XYZ, then XYZ is
 * converted to L*a*b*.
 *
 * sRGB is a "specification originated from work in 1990s through cooperation by Hewlett-Packard
 * and Microsoft, and it was designed to be a standard definition of RGB for the internet, which it
 * indeed became...The standard is based on a sampling of computer monitors at the time...The whole
 * idea of sRGB is that if everyone assumed that RGB meant the same thing, then the results would be
 * consistent, and reasonably good. It worked." - Fairchild, Color Models and Systems: Handbook of
 * Color Psychology, 2015
 */
export class CamUtils {
  /**
   * This is a more precise sRGB to XYZ transformation matrix than traditionally
   * used. It was derived using Schlomer's technique of transforming the xyY
   * primaries to XYZ, then applying a correction to ensure mapping from sRGB
   * 1, 1, 1 to the reference white point, D65.
   */
  static SRGB_TO_XYZ: [[number, number, number], [number, number, number], [number, number, number]] = [
    [0.41233895, 0.35762064, 0.18051042],
    [0.2126, 0.7152, 0.0722],
    [0.01932141, 0.11916382, 0.95034478],
  ];

  /**  Transforms XYZ color space coordinates to 'cone'/'RGB' responses in CAM16.*/
  static XYZ_TO_CAM16RGB: [[number, number, number], [number, number, number], [number, number, number]] = [
    [0.401288, 0.650173, -0.051461],
    [-0.250268, 1.204414, 0.045854],
    [-0.002079, 0.048952, 0.953127],
  ];

  static XYZ_TO_SRGB: [[number, number, number], [number, number, number], [number, number, number]] = [
    [3.2413774792388685, -1.5376652402851851, -0.49885366846268053],
    [-0.9691452513005321, 1.8758853451067872, 0.04156585616912061],
    [0.05562093689691305, -0.20395524564742123, 1.0571799111220335],
  ];

  /** Transforms 'cone'/'RGB' responses in CAM16 to XYZ color space coordinates. */
  static CAM16RGB_TO_XYZ: [[number, number, number], [number, number, number], [number, number, number]] = [
    [1.86206786, -1.01125463, 0.14918677],
    [0.38752654, 0.62144744, -0.00897398],
    [-0.0158415, -0.03412294, 1.04996444],
  ];

  /**
   * sRGB specification has D65 whitepoint - Stokes, Anderson, Chandrasekar, Motta - A Standard
   * Default Color Space for the Internet: sRGB, 1996
   */
  static WHITE_POINT_D65: [number, number, number] = [95.047, 100, 108.883];

  /** Returns L* from L*a*b*, perceptual luminance, from an ARGB integer (ColorInt). */
  static lstarFromInt(argb: number) {
    return CamUtils.lstarFromY(CamUtils.yFromInt(argb));
  }

  static lstarFromY(y: number) {
    y = y / 100;
    const e = 216 / 24389;
    let yIntermediate;
    if (y <= e) {
      return (24389 / 27) * y;
    } else {
      yIntermediate = Math.cbrt(y);
    }
    return 116 * yIntermediate - 16;
  }

  static yFromInt(argb: number) {
    const r = CamUtils.linearized(Color.red(argb)),
      g = CamUtils.linearized(Color.green(argb)),
      b = CamUtils.linearized(Color.blue(argb)),
      matrix = CamUtils.SRGB_TO_XYZ,
      y = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2];
    return y;
  }

  static xyzFromInt(argb: number): [number, number, number] {
    const r = CamUtils.linearized(Color.red(argb)),
      g = CamUtils.linearized(Color.green(argb)),
      b = CamUtils.linearized(Color.blue(argb));

    const matrix = CamUtils.SRGB_TO_XYZ,
      x = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2],
      y = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2],
      z = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2];

    return [x, y, z];
  }

  static linearized(rgbComponent: number): number {
    const normalized = rgbComponent / 255;

    if (normalized <= 0.04045) {
      return (normalized / 12.92) * 100;
    } else {
      return Math.pow((normalized + 0.055) / 1.055, 2.4) * 100;
    }
  }

  /**
   * Converts an L* value to a Y value.
   *
   * L* in L*a*b* and Y in XYZ measure the same quantity, luminance.
   *
   * L* measures perceptual luminance, a linear scale. Y in XYZ measures relative luminance, a
   * logarithmic scale.
   *
   * @param lstar L* in L*a*b*
   * @return Y in XYZ
   */
  static yFromLstar(lstar: number) {
    const ke = 8;
    if (lstar > ke) {
      return Math.pow((lstar + 16) / 116, 3) * 100;
    } else {
      return (lstar / (24389 / 27)) * 100;
    }
  }

  /**
   * Clamps an integer between two integers.
   *
   * @return input when min <= input <= max, and either min or max otherwise.
   */
  static clampInt(min: number, max: number, input: number) {
    if (input < min) {
      return min;
    } else if (input > max) {
      return max;
    }

    return input;
  }

  /**
   * Delinearizes an RGB component.
   *
   * @param rgbComponent 0 <= rgb_component <= 100, represents linear R/G/B channel
   * @return 0 <= output <= 255, color channel converted to regular RGB space
   */
  static delinearized(rgbComponent: number) {
    const normalized = rgbComponent / 100;
    let delinearized = 0;
    if (normalized <= 0.0031308) {
      delinearized = normalized * 12.92;
    } else {
      delinearized = 1.055 * Math.pow(normalized, 1 / 2.4) - 0.055;
    }
    return CamUtils.clampInt(0, 255, Math.round(delinearized * 255));
  }

  /** Converts a color from RGB components to ARGB format. */
  static argbFromRgb(red: number, green: number, blue: number) {
    return (255 << 24) | ((red & 255) << 16) | ((green & 255) << 8) | (blue & 255);
  }

  /** Converts a color from ARGB to XYZ. */
  static argbFromXyz(x: number, y: number, z: number) {
    const matrix = CamUtils.XYZ_TO_SRGB,
      linearR = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z,
      linearG = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z,
      linearB = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z,
      r = CamUtils.delinearized(linearR),
      g = CamUtils.delinearized(linearG),
      b = CamUtils.delinearized(linearB);

    return CamUtils.argbFromRgb(r, g, b);
  }

  /**
   * Convert a color appearance model representation to an ARGB color.
   *
   * Note: the returned color may have a lower chroma than requested. Whether a chroma is
   * available depends on luminance. For example, there's no such thing as a high chroma light
   * red, due to the limitations of our eyes and/or physics. If the requested chroma is
   * unavailable, the highest possible chroma at the requested luminance is returned.
   *
   * @param hue    hue, in degrees, in CAM coordinates
   * @param chroma chroma in CAM coordinates.
   * @param lstar  perceptual luminance, L* in L*a*b*
   */
  static CAMToColor(hue: number, chroma: number, lstar: number) {
    return Cam.getInt(hue, chroma, lstar);
  }

  /**
   * Converts an L* value to an ARGB representation.
   *
   * @param lstar L* in L*a*b*
   * @return ARGB representation of grayscale color with lightness matching L*
   */
  static argbFromLstar(lstar: number) {
    const fy = (lstar + 16) / 116,
      fz = fy,
      fx = fy,
      kappa = 24389 / 27,
      epsilon = 216 / 24389,
      lExceedsEpsilonKappa = lstar > 8,
      y = lExceedsEpsilonKappa ? fy * fy * fy : lstar / kappa,
      cubeExceedEpsilon = fy * fy * fy > epsilon,
      x = cubeExceedEpsilon ? fx * fx * fx : lstar / kappa,
      z = cubeExceedEpsilon ? fz * fz * fz : lstar / kappa,
      whitePoint = CamUtils.WHITE_POINT_D65;

    return CamUtils.argbFromXyz(x * whitePoint[0], y * whitePoint[1], z * whitePoint[2]);
  }

  /** Converts a color from linear RGB components to ARGB format. */
  static argbFromLinrgbComponents(r: number, g: number, b: number) {
    return CamUtils.argbFromRgb(CamUtils.delinearized(r), CamUtils.delinearized(g), CamUtils.delinearized(b));
  }

  /**
   * The signum function.
   *
   * @return 1 if num > 0, -1 if num < 0, and 0 if num = 0
   */
  static signum(num: number) {
    if (num < 0) {
      return -1;
    } else if (num === 0) {
      return 0;
    } else {
      return 1;
    }
  }

  static intFromLstar(lstar: number) {
    if (lstar < 1) {
      return 0xff000000;
    } else if (lstar > 99) {
      return 0xffffffff;
    }

    // XYZ to LAB conversion routine, assume a and b are 0.
    const fy = (lstar + 16) / 116;

    // fz = fx = fy because a and b are 0
    const fz = fy;
    const fx = fy;

    const kappa = 24389 / 27;
    const epsilon = 216 / 24389;
    const lExceedsEpsilonKappa = lstar > 8;
    const yT = lExceedsEpsilonKappa ? fy * fy * fy : lstar / kappa;
    const cubeExceedEpsilon = fy * fy * fy > epsilon;
    const xT = cubeExceedEpsilon ? fx * fx * fx : (116 * fx - 16) / kappa;
    const zT = cubeExceedEpsilon ? fz * fz * fz : (116 * fx - 16) / kappa;

    return ColorUtils.XYZToColor(
      xT * CamUtils.WHITE_POINT_D65[0],
      yT * CamUtils.WHITE_POINT_D65[1],
      zT * CamUtils.WHITE_POINT_D65[2]
    );
  }
}

/**
 * The frame, or viewing conditions, where a color was seen. Used, along with a color, to create a
 * color appearance model representing the color.
 *
 * To convert a traditional color to a color appearance model, it requires knowing what
 * conditions the color was observed in. Our perception of color depends on, for example, the tone
 * of the light illuminating the color, how bright that light was, etc.
 *
 * This class is modelled separately from the color appearance model itself because there are a
 * number of calculations during the color => CAM conversion process that depend only on the viewing
 * conditions. Caching those calculations in a Frame instance saves a significant amount of time.
 */
export class Frame {
  mN: number;
  mAw: number;
  mNbb: number;
  mNcb: number;
  mC: number;
  mNc: number;
  mRgbD: [number, number, number];
  mFl: number;
  mFlRoot: number;
  mZ: number;

  constructor(
    n: number,
    aw: number,
    nbb: number,
    ncb: number,
    c: number,
    nc: number,
    rgbD: [number, number, number],
    fl: number,
    fLRoot: number,
    z: number
  ) {
    this.mN = n;
    this.mAw = aw;
    this.mNbb = nbb;
    this.mNcb = ncb;
    this.mC = c;
    this.mNc = nc;
    this.mRgbD = rgbD;
    this.mFl = fl;
    this.mFlRoot = fLRoot;
    this.mZ = z;
  }

  getRgbD() {
    return this.mRgbD as [number, number, number];
  }
  getFl() {
    return this.mFl;
  }
  getNbb() {
    return this.mNbb;
  }
  getAw() {
    return this.mAw;
  }
  getC() {
    return this.mC;
  }
  getFlRoot() {
    return this.mFlRoot;
  }
  getNc() {
    return this.mNc;
  }
  getNcb() {
    return this.mNcb;
  }
  getZ() {
    return this.mZ;
  }
  getN() {
    return this.mN;
  }

  static make(
    whitepoint: [number, number, number],
    adaptingLuminance: number,
    backgroundLstar: number,
    surround: number,
    discountingIlluminant: boolean
  ) {
    // Transform white point XYZ to 'cone'/'rgb' responses
    const matrix = CamUtils.XYZ_TO_CAM16RGB,
      xyz = whitepoint,
      rW = xyz[0] * matrix[0][0] + xyz[1] * matrix[0][1] + xyz[2] * matrix[0][2],
      gW = xyz[0] * matrix[1][0] + xyz[1] * matrix[1][1] + xyz[2] * matrix[1][2],
      bW = xyz[0] * matrix[2][0] + xyz[1] * matrix[2][1] + xyz[2] * matrix[2][2];

    // Scale input surround, domain (0, 2), to CAM16 surround, domain (0.8, 1)
    const f = 0.8 + surround / 10;
    // "Exponential non-linearity"
    const c = f >= 0.9 ? MathUtils.lerp(0.59, 0.69, (f - 0.9) * 10) : MathUtils.lerp(0.525, 0.59, (f - 0.8) * 10);
    // Calculate degree of adaptation to illuminant
    let d = discountingIlluminant ? 1 : f * (1 - (1 / 3.6) * Math.exp((-adaptingLuminance - 42) / 92));
    // Per Li et al, if D is greater than 1 or less than 0, set it to 1 or 0.
    d = d > 1 ? 1 : d < 0 ? 0 : d;
    // Chromatic induction factor
    const nc = f;

    // Cone responses to the whitepoint, adjusted for illuminant discounting.
    //
    // Why use 100 instead of the white point's relative luminance?
    //
    // Some papers and implementations, for both CAM02 and CAM16, use the Y
    // value of the reference white instead of 100. Fairchild's Color Appearance
    // Models (3rd edition) notes that this is in error: it was included in the
    // CIE 2004a report on CIECAM02, but, later parts of the conversion process
    // account for scaling of appearance relative to the white point relative
    // luminance. This part should simply use 100 as luminance.
    const rgbD = [d * (100 / rW) + 1 - d, d * (100 / gW) + 1 - d, d * (100 / bW) + 1 - d] as [number, number, number];
    // Luminance-level adaptation factor
    const k = 1 / (5 * adaptingLuminance + 1);
    const k4 = k * k * k * k;
    const k4F = 1 - k4;
    const fl = k4 * adaptingLuminance + 0.1 * k4F * k4F * Math.cbrt(5 * adaptingLuminance);

    // Intermediate factor, ratio of background relative luminance to white relative luminance
    const n = CamUtils.yFromLstar(backgroundLstar) / whitepoint[1];

    // Base exponential nonlinearity
    // note Schlomer 2018 has a typo and uses 1.58, the correct factor is 1.48
    const z = 1.48 + Math.sqrt(n);

    // Luminance-level induction factors
    const nbb = 0.725 / Math.pow(n, 0.2);
    const ncb = nbb;

    // Discounted cone responses to the white point, adjusted for post-chromatic
    // adaptation perceptual nonlinearities.
    const rgbAFactors = [
      Math.pow((fl * rgbD[0] * rW) / 100, 0.42),
      Math.pow((fl * rgbD[1] * gW) / 100, 0.42),
      Math.pow((fl * rgbD[2] * bW) / 100, 0.42),
    ] as const;

    const rgbA = [
      (400 * rgbAFactors[0]) / (rgbAFactors[0] + 27.13),
      (400 * rgbAFactors[1]) / (rgbAFactors[1] + 27.13),
      (400 * rgbAFactors[2]) / (rgbAFactors[2] + 27.13),
    ] as const;

    const aw = (2 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * nbb;

    return new Frame(n, aw, nbb, ncb, c, nc, rgbD, fl, Math.pow(fl, 0.25), z);
  }

  static DEFAULT = Frame.make(CamUtils.WHITE_POINT_D65, ((200 / Math.PI) * CamUtils.yFromLstar(50)) / 100, 50, 2, false);
}
