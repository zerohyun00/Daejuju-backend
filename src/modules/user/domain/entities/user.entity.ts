import { BaseEntity } from '../../../../shared/domain/base.entity';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { Role, ROLE_ENUM } from '../enums/role.enum';
import { IUniversityRepository } from '../../../university/application/ports/university.repository.interface';

/**
 * User Entity
 * 사용자 도메인 엔티티
 */
export class User extends BaseEntity {
  private constructor(
    private email: Email,
    private password: Password,
    private role: Role,
    private refreshToken: string | null,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  /**
   * 새로운 User 생성 (University 도메인 검증 포함)
   */
  static async create(
    email: string,
    plainPassword: string,
    universityRepo: IUniversityRepository,
    role: Role = ROLE_ENUM.USER,
  ): Promise<User> {
    const emailVO = await Email.create(email, universityRepo);
    const passwordVO = await Password.create(plainPassword);

    return new User(emailVO, passwordVO, role, null);
  }

  /**
   * DB에서 불러온 데이터로 User 생성
   */
  static fromDB(data: {
    id: string;
    email: string;
    password: string;
    role: Role;
    refresh_token: string | null;
    created_at: Date;
    updated_at: Date;
  }): User {
    return new User(
      Email.fromDB(data.email),
      Password.fromDB(data.password),
      data.role,
      data.refresh_token,
      data.id,
      data.created_at,
      data.updated_at,
    );
  }

  /**
   * 비밀번호 일치 확인
   */
  async validatePassword(plainPassword: string): Promise<boolean> {
    return this.password.compare(plainPassword);
  }

  /**
   * Refresh Token 설정
   */
  setRefreshToken(token: string): void {
    this.refreshToken = token;
    this.touch();
  }

  /**
   * Refresh Token 제거 (로그아웃)
   */
  clearRefreshToken(): void {
    this.refreshToken = null;
    this.touch();
  }

  /**
   * 역할 확인
   */
  isAdmin(): boolean {
    return this.role === ROLE_ENUM.ADMIN;
  }

  /**
   * DB 저장용 데이터 변환
   */
  toPersistence() {
    return {
      id: this.getId(),
      email: this.email.getValue(),
      password: this.password.getValue(),
      role: this.role,
      refresh_token: this.refreshToken,
      created_at: this.getCreatedAt(),
      updated_at: this.getUpdatedAt(),
    };
  }

  // Getters
  getEmail(): Email {
    return this.email;
  }

  getEmailValue(): string {
    return this.email.getValue();
  }

  getRole(): Role {
    return this.role;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }
}

