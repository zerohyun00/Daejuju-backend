import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { USER_VALIDATION_MESSAGES } from '../../domain/constants/validation-messages';

export class CreateUserDto {
  @IsEmail({}, { message: USER_VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsNotEmpty({ message: USER_VALIDATION_MESSAGES.EMAIL_REQUIRED })
  email: string;

  @IsString()
  @IsNotEmpty({ message: USER_VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @MinLength(8, { message: USER_VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH })
  password: string;
}

