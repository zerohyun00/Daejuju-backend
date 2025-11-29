import { IsEmail } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../domain/constants/validation-messages';

export class SendVerificationEmailDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  email: string;
}

