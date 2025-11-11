import { Profile } from '../../domain/entities/profile.entity';

export class ProfileResponseDto {
  id: string;
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  universityId: number;
  schoolRank: number | null;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Domain Entity를 Response DTO로 변환
   */
  static fromEntity(profile: Profile): ProfileResponseDto {
    const dto = new ProfileResponseDto();
    dto.id = profile.getId();
    dto.userId = profile.getUserId();
    dto.fullName = profile.getFullName();
    dto.avatarUrl = profile.getAvatarUrl();
    dto.universityId = profile.getUniversityId();
    dto.schoolRank = profile.getSchoolRank();
    dto.createdAt = profile.getCreatedAt();
    dto.updatedAt = profile.getUpdatedAt();
    return dto;
  }

  /**
   * 여러 Entity를 DTO 배열로 변환
   */
  static fromEntities(profiles: Profile[]): ProfileResponseDto[] {
    return profiles.map((profile) => ProfileResponseDto.fromEntity(profile));
  }
}

