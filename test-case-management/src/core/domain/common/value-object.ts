export abstract class ValueObject {
  public equals(vo?: ValueObject): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.constructor !== this.constructor) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(vo);
  }
}