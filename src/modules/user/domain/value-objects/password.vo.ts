import * as bcrypt from 'bcrypt';
import { InvalidArgumentException } from '../../../../shared/domain/exceptions/invalid-argument.exception';
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN, SALT_ROUNDS } from '../constants/password';

export class Password {
  private readonly hashedValue: string;

  private constructor(hashedPassword: string) {
    this.hashedValue = hashedPassword;
  }

  static async create(plainPassword: string): Promise<Password> {
    if (!plainPassword || plainPassword.length < PASSWORD_MIN_LENGTH) {
      throw new InvalidArgumentException(
        `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다`,
      );
    }

    const passwordPattern = PASSWORD_PATTERN;
    if (!passwordPattern.test(plainPassword)) {
      throw new InvalidArgumentException(
        '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다',
      );
    }

    const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return new Password(hashed);
  }

  /**
   * DB에서 불러온 해시된 비밀번호로 Password 생성
   */
  static fromDB(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  /**
   * 비밀번호 일치 여부 확인
   */
  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hashedValue);
  }

  /**
   * 해시된 비밀번호 값 반환
   */
  getValue(): string {
    return this.hashedValue;
  }
}

