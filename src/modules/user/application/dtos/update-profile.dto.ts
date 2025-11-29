import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../domain/constants/validation-messages';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: VALIDATION_MESSAGES.NAME_MAX_LENGTH })
  fullName?: string;

  @IsOptional()
  @IsUrl({}, { message: VALIDATION_MESSAGES.AVATAR_URL_INVALID })
  avatarUrl?: string;
}

