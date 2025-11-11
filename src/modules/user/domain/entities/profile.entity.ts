import { BaseEntity } from '../../../../shared/domain/base.entity';

/**
 * Profile Entity
 * 사용자 프로필 엔티티
 */
export class Profile extends BaseEntity {
  private constructor(
    private readonly userId: string,
    private fullName: string | null,
    private avatarUrl: string | null,
    private readonly universityId: number,
    private schoolRank: number | null,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  /**
   * 새로운 Profile 생성
   */
  static create(userId: string, universityId: number): Profile {
    return new Profile(userId, null, null, universityId, null);
  }

  /**
   * DB에서 불러온 데이터로 Profile 생성
   */
  static fromDB(data: {
    id: string;
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
    university_id: number;
    school_rank: number | null;
    created_at: Date;
    updated_at: Date;
  }): Profile {
    return new Profile(
      data.user_id,
      data.full_name,
      data.avatar_url,
      data.university_id,
      data.school_rank,
      data.id,
      data.created_at,
      data.updated_at,
    );
  }

  /**
   * 프로필 업데이트
   */
  update(fullName: string | null, avatarUrl: string | null): void {
    this.fullName = fullName;
    this.avatarUrl = avatarUrl;
    this.touch();
  }

  /**
   * 학교 랭킹 설정
   */
  setSchoolRank(rank: number): void {
    this.schoolRank = rank;
    this.touch();
  }

  /**
   * DB 저장용 데이터 변환
   */
  toPersistence() {
    return {
      id: this.getId(),
      user_id: this.userId,
      full_name: this.fullName,
      avatar_url: this.avatarUrl,
      university_id: this.universityId,
      school_rank: this.schoolRank,
      created_at: this.getCreatedAt(),
      updated_at: this.getUpdatedAt(),
    };
  }

  // Getters
  getUserId(): string {
    return this.userId;
  }

  getFullName(): string | null {
    return this.fullName;
  }

  getAvatarUrl(): string | null {
    return this.avatarUrl;
  }

  getUniversityId(): number {
    return this.universityId;
  }

  getSchoolRank(): number | null {
    return this.schoolRank;
  }
}

