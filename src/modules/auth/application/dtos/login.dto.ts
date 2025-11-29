import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AUTH_VALIDATION_MESSAGES } from '../../domain/constants';

/**
 * 로그인 Request DTO
 */
export class LoginDto {
  @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.EMAIL_REQUIRED })
  email: string;

  @IsString()
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  password: string;
}

