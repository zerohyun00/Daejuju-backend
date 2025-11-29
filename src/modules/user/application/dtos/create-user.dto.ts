import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../domain/constants/validation-messages';

export class CreateUserDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  email: string;

  @IsString()
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @MinLength(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH })
  password: string;
}

