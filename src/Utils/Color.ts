export default class Color {
  static TRANSPARENT = 0;

  static clampRGB = (value: number) => Color.clamp(Math.round(value), 0, 255);
  static clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

  static red = (color: number) => (color >> 16) & 0xff;
  static green = (color: number) => (color >> 8) & 0xff;
  static blue = (color: number) => color & 0xff;

  static rgb(red: number, green: number, blue: number) {
    red = Color.clampRGB(red);
    green = Color.clampRGB(green);
    blue = Color.clampRGB(blue);
    return 0xff000000 | (red << 16) | (green << 8) | blue;
  }
}
