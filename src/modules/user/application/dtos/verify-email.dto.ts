import { IsEmail, IsString, Matches } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요' })
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: '인증 코드는 6자리 숫자여야 합니다' })
  code: string;
}

