import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { USER_VALIDATION_MESSAGES } from '../../domain/constants/validation-messages';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: USER_VALIDATION_MESSAGES.NAME_MAX_LENGTH })
  fullName?: string;

  @IsOptional()
  @IsUrl({}, { message: USER_VALIDATION_MESSAGES.AVATAR_URL_INVALID })
  avatarUrl?: string;
}

