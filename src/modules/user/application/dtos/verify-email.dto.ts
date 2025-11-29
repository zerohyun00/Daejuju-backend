import { IsEmail, IsString, Matches } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../domain/constants/validation-messages';

export class VerifyEmailDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: VALIDATION_MESSAGES.CODE_FORMAT_INVALID })
  code: string;
}

