import { IsNotEmpty, IsString } from 'class-validator';
import { AUTH_VALIDATION_MESSAGES } from '../../domain/constants';

/**
 * Refresh Token Request DTO
 */
export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.REFRESH_TOKEN_REQUIRED })
  refreshToken: string;
}

