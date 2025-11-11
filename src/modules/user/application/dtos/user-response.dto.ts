import { User } from '../../domain/entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Domain Entity를 Response DTO로 변환
   */
  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.getId();
    dto.email = user.getEmailValue();
    dto.createdAt = user.getCreatedAt();
    dto.updatedAt = user.getUpdatedAt();
    return dto;
  }

  /**
   * 여러 Entity를 DTO 배열로 변환
   */
  static fromEntities(users: User[]): UserResponseDto[] {
    return users.map((user) => UserResponseDto.fromEntity(user));
  }
}

