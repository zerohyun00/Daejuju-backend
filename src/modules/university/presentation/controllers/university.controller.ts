import { Controller, Get } from '@nestjs/common';
import { GetUniversitiesUseCase } from '../../application/use-cases/queries/get-universities.use-case';
import { UniversityResponseDto } from '../../application/dtos/university-response.dto';

/**
 * University Controller
 * 대학 관련 API 엔드포인트
 */
@Controller('universities')
export class UniversityController {
  constructor(
    private readonly getUniversitiesUseCase: GetUniversitiesUseCase,
  ) { }

  /**
   * 모든 대학 목록 조회
   * @route GET /universities
   */
  @Get()
  async getUniversities(): Promise<UniversityResponseDto[]> {
    const universities = await this.getUniversitiesUseCase.execute();
    return UniversityResponseDto.fromEntities(universities);
  }
}

