import { University } from '../../domain/entities/university.entity';

/**
 * University Response DTO
 * API 응답용 데이터 전송 DTO
 */
export class UniversityResponseDto {
  id: number;
  name: string;
  domain: string;
  createdAt: Date;

  /**
   * Domain Entity를 Response DTO로 변환
   */
  static fromEntity(university: University): UniversityResponseDto {
    const id = university.getId();
    if (id === null) {
      throw new Error(
        '대학 엔티티가 저장되지 않았습니다',
      );
    }

    const dto = new UniversityResponseDto();
    dto.id = id;
    dto.name = university.getName();
    dto.domain = university.getDomain();
    dto.createdAt = university.getCreatedAt();
    return dto;
  }

  /**
   * 여러 Entity를 DTO 배열로 변환
   */
  static fromEntities(universities: University[]): UniversityResponseDto[] {
    return universities.map((university) =>
      UniversityResponseDto.fromEntity(university),
    );
  }
}

