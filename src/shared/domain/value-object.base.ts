/**
 * Value Object Base
 * 모든 Value Object의 부모 클래스
 * - 불변성 (Immutability)
 * - 값 기반 동등성 (Value Equality)
 */
export abstract class ValueObject<T> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  /**
   * 값 기반 동등성 비교
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  /**
   * Value Object의 값 반환
   */
  protected getValue(): T {
    return this.props;
  }
}

