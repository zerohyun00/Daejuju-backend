import { InvalidArgumentException } from '../../../../shared/domain/exceptions/invalid-argument.exception';
import { IUniversityRepository } from '../../../university/application/ports/university.repository.interface';

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email.toLowerCase().trim();
  }

  /**
   * 새로운 Email 생성 (University 도메인 검증 포함)
   * @param email 이메일 주소
   * @param universityRepo University Repository
   */
  static async create(
    email: string,
    universityRepo: IUniversityRepository,
  ): Promise<Email> {
    // 1. 기본 형식 검증
    if (!email || email.trim().length === 0) {
      throw new InvalidArgumentException('이메일은 필수입니다');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      throw new InvalidArgumentException('유효하지 않은 이메일 형식입니다');
    }

    // 2. 대학 도메인 검증
    const domain = email.split('@')[1];
    const university = await universityRepo.findByDomain(domain);

    if (!university) {
      throw new InvalidArgumentException(
        `등록되지 않은 대학 도메인입니다: ${domain}`,
      );
    }

    return new Email(email);
  }

  static fromDB(email: string): Email {
    return new Email(email);
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

