import { v7 as uuidv7 } from 'uuid';

/**
 * Base Entity
 * 모든 Domain Entity의 부모 클래스
 * - 공통 속성 (id, createdAt, updatedAt)
 * - ID 생성 로직
 */
export abstract class BaseEntity {
  protected readonly id: string;
  protected readonly createdAt: Date;
  protected updatedAt: Date;

  protected constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
    const now = new Date();
    this.id = id ?? uuidv7();
    this.createdAt = createdAt ?? now;
    this.updatedAt = updatedAt ?? now;
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  protected touch(): void {
    this.updatedAt = new Date();
  }

  public equals(entity: BaseEntity): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this.id === entity.id;
  }
}

