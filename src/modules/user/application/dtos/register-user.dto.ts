import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../domain/constants/validation-messages';

/**
 * 회원가입 DTO
 * 이메일 인증 완료 후 회원가입 시 사용
 */
export class RegisterUserDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  email: string;

  @IsString()
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @MinLength(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH })
  password: string;

  @IsString()
  @IsNotEmpty({ message: VALIDATION_MESSAGES.NAME_REQUIRED })
  @MaxLength(20, { message: VALIDATION_MESSAGES.NAME_MAX_LENGTH })
  fullName: string;
}

