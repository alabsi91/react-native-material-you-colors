class MathUtils {
  static lerp(start: number, stop: number, amount: number) {
    return start + (stop - start) * amount;
  }

  static toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }
}

export default MathUtils;
